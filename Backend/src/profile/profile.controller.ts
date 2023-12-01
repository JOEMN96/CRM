import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import fileConfig from 'src/utils/fileStorage.config';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('/profilePic')
  @UseInterceptors(FileInterceptor('image', fileConfig))
  addOrUpdateProfilePic(@UploadedFiles() file: Express.Multer.File) {
    return this.profileService.addOrUpdateProfilePic(file);
  }
}
