import { MulterError, diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

const PROFILE_PIC_STORAGE_PATH = join(
  __dirname,
  '..',
  '..',
  'uploads/images/profilePics',
);

const fileConfig = {
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) cb(null, true);
    else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    }
  },
  storage: diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      if (!existsSync(PROFILE_PIC_STORAGE_PATH)) {
        mkdirSync(PROFILE_PIC_STORAGE_PATH, { recursive: true });
      }
      cb(null, join(__dirname, '..', '..', 'uploads/images/profilePics'));
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const fileName =
        new Date().getUTCMilliseconds() +
        file.originalname.replaceAll(' ', '-');
      cb(null, fileName);
    },
  }),
};

export default fileConfig;
