import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, HttpStatus, HttpCode, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import profilePicConfig from 'src/profile/configs/profilePicStorage.config';
import { Payload } from 'src/auth/types';
import { User } from '../utils/getUser.decorator';
import documentsConfig from './configs/profileDocuments.config';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('/upload/profilePic')
  @UseInterceptors(FileInterceptor('profilePic', profilePicConfig))
  @HttpCode(HttpStatus.OK)
  addOrUpdateProfilePic(@UploadedFile() file: Express.Multer.File, @User() user: Payload) {
    return this.profileService.addOrUpdateProfilePic(file, user);
  }

  @Post('/upload/documents')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'documents', maxCount: 10 }], documentsConfig))
  @HttpCode(HttpStatus.OK)
  uploadDocuments(@UploadedFiles() files: { documents: Express.Multer.File[] }, @User() user: Payload) {
    return this.profileService.uploadDocuments(files, user);
  }

  @Get('/documents')
  getUsersDocuments(@User() user: Payload) {}
}
