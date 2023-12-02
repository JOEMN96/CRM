import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Payload } from 'src/auth/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private dataSource: PrismaService) {}

  async addOrUpdateProfilePic(file: Express.Multer.File, { id }: Payload) {
    if (!file) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const path = this.replaceBackwardSlash(file.path);

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

  async uploadDocuments(file: Express.Multer.File, { id }: Payload) {}

  // Utility Functions
  replaceBackwardSlash(path: string) {
    return path.replace(/\\/g, '/');
  }
}
