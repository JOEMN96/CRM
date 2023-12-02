import { MulterError, diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

const PROFILE_PIC_STORAGE_PATH = join(__dirname, '..', '..', '..', 'uploads/public/images/profilePics');

const profilePicConfig = {
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) cb(null, true);
    else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'profilePic'), false);
    }

    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
  storage: diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      if (!existsSync(PROFILE_PIC_STORAGE_PATH)) {
        mkdirSync(PROFILE_PIC_STORAGE_PATH, { recursive: true });
      }
      cb(null, PROFILE_PIC_STORAGE_PATH);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const fileName = new Date().getUTCMilliseconds() + file.originalname.replaceAll(' ', '-');
      cb(null, fileName);
    },
  }),
};

export default profilePicConfig;
