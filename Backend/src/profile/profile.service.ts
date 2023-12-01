import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  async addOrUpdateProfilePic(file: Express.Multer.File) {
    console.log(file);
    return '';
  }
}
