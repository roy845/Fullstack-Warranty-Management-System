import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestException('Only PDF, JPEG, and PNG files are allowed!'),
      false,
    );
  }
};
