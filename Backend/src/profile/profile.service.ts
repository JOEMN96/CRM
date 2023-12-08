import { Injectable, HttpException, HttpStatus, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { rmSync, existsSync, createReadStream } from 'fs';
import { resolve } from 'node:path/posix';
import { join } from 'path';
import { Payload } from 'src/auth/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private dataSource: PrismaService) {}

  async addOrUpdateProfilePic(file: Express.Multer.File, { id }: Payload) {
    if (!file) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const path = this.getRelativePath(file.path).split('uploads/public')[1];

    // Remove the old file
    const profile = await this.dataSource.users
      .findUnique({
        where: {
          id,
        },
      })
      .profile();

    if (profile && profile.profilePicFilePath) {
      this.removeFile(profile.profilePicFilePath);
      await this.dataSource.users.update({
        where: {
          id: id,
        },
        data: {
          profile: {
            update: {
              profilePicFilePath: path,
            },
          },
        },
      });
      return;
    }

    //  Add the new file
    await this.dataSource.userProfile.create({
      data: {
        profilePicFilePath: path,
        userId: id,
      },
    });
  }

  async uploadDocuments(files: { documents: Express.Multer.File[] }, { id }: Payload) {
    let uploadedFiles: IDocument[] = files.documents.map((file) => {
      return { documentName: file.filename, path: this.getRelativePath(file.path), type: file.mimetype };
    });

    await this.dataSource.users.update({
      where: {
        id,
      },
      data: {
        documents: {
          createMany: {
            data: uploadedFiles,
          },
        },
      },
    });
  }

  async getUsersDocuments({ id }: Payload) {
    return await this.dataSource.users
      .findUnique({
        where: {
          id,
        },
      })
      .documents();
  }

  async getFile(filePath: string, res: Response, { id }: Payload): Promise<StreamableFile> {
    let documents = await this.dataSource.users
      .findUnique({
        where: {
          id,
        },
      })
      .documents();

    if (documents.length < 1 || !existsSync(join(process.cwd(), filePath))) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    let isDocAvailable = documents.some((doc) => doc.path === filePath);

    if (!isDocAvailable) {
      throw new HttpException('You don"t have access to view this file', HttpStatus.FORBIDDEN);
    }

    res.set({
      'Content-Type': 'application/pdf',
    });
    const file = createReadStream(join(process.cwd(), filePath));
    return new StreamableFile(file);
  }

  async getProfile({ id }: Payload) {
    let profile = await this.dataSource.users
      .findUnique({
        where: {
          id: id,
        },
      })
      .profile();

    let user = await this.dataSource.users.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        role: true,
        id: true,
        email: true,
      },
    });

    if (profile || user) {
      return { profile, user };
    } else {
      return {};
    }
  }

  // Utility Functions
  replaceBackwardSlash(path: string) {
    return path.replace(/\\/g, '/');
  }

  getRelativePath(absolutePath: string) {
    const relativePath = absolutePath.split('dist');
    return '/dist' + this.replaceBackwardSlash(relativePath[1]);
  }

  removeFile(path: string) {
    let filePath = join(__dirname, '..', '..', '..', path);
    if (existsSync(filePath)) {
      rmSync(filePath, {
        force: true,
      });
    }
  }
}
