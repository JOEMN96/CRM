import { MulterError, diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';

const DOCUMENTS_STORAGE_PATH = join(__dirname, '..', '..', '..', 'uploads/private/documents');

const documentsConfig = {
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.originalname.match(/^.*\.(pdf|doc|docx)$/)) cb(null, true);
    else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'documents'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 100, // 100 MB
  },
  storage: diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      if (!existsSync(DOCUMENTS_STORAGE_PATH)) {
        mkdirSync(DOCUMENTS_STORAGE_PATH, { recursive: true });
      }
      cb(null, DOCUMENTS_STORAGE_PATH);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const fileName = new Date().getUTCMilliseconds() + file.originalname.replaceAll(' ', '-');
      cb(null, fileName);
    },
  }),
};

export default documentsConfig;
