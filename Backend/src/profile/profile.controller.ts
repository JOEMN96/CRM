import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import profilePicConfig from 'src/utils/profilePicStorage.config';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('/profilePic')
  @UseInterceptors(FileInterceptor('profilePic', profilePicConfig))
  @HttpCode(HttpStatus.OK)
  addOrUpdateProfilePic(@UploadedFile() file: Express.Multer.File) {
    return this.profileService.addOrUpdateProfilePic(file);
  }
}
