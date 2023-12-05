import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { rmSync, existsSync } from 'fs';
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
    const path = this.getRelativePath(file.path);

    // Remove the old file
    const { profilePicFilePath } = await this.dataSource.users
      .findUnique({
        where: {
          id,
        },
      })
      .profile();

    if (profilePicFilePath) {
      this.removeFile(profilePicFilePath);
    }

    //  Add the new file
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
  }

  async uploadDocuments(files: { documents: Express.Multer.File[] }, { id }: Payload) {
    console.log();
    let uploadedFiles: IDocument[] = files.documents.map((file) => {
      return { documentName: file.filename, path: this.getRelativePath(file.path) };
    });

    // let res = await this.dataSource.userProfile.create({
    //   where: {
    //     userId: id,
    //   },
    //   data: {
    //     documents: {
    //       createMany: {
    //         data: uploadedFiles,
    //       },
    //     },
    //   },
    // });
    // console.log(res);

    return null;
  }

  async getUsersDocuments(user: Payload) {}

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
