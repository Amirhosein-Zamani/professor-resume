import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

const CV_UPLOAD_DIR = join(process.cwd(), 'assets', 'cvs');
const CV_PUBLIC_PATH_PREFIX = '/assets/cvs';
const CV_MAX_SIZE_BYTES = 10 * 1024 * 1024;

@Injectable()
export class CvStorageService {
  constructor() {
    if (!existsSync(CV_UPLOAD_DIR)) {
      mkdirSync(CV_UPLOAD_DIR, { recursive: true });
    }
  }

  saveCv(file: Express.Multer.File): string {
    this.validatePdf(file);

    const filename = `${randomUUID()}.pdf`;
    const filePath = join(CV_UPLOAD_DIR, filename);

    writeFileSync(filePath, file.buffer);

    return `${CV_PUBLIC_PATH_PREFIX}/${filename}`;
  }

  private validatePdf(file: Express.Multer.File): void {
    if (file.size <= 0 || file.size > CV_MAX_SIZE_BYTES) {
      throw new BadRequestException(
        'CV file must be a non-empty PDF no larger than 10 MB.',
      );
    }

    if (
      file.mimetype !== 'application/pdf' ||
      !file.originalname.toLowerCase().endsWith('.pdf')
    ) {
      throw new BadRequestException('CV file must be a PDF document.');
    }

    const header = file.buffer.subarray(0, 5).toString('ascii');
    const trailer = file.buffer
      .subarray(Math.max(0, file.buffer.length - 4096))
      .toString('latin1');

    if (header !== '%PDF-' || !trailer.includes('%%EOF')) {
      throw new BadRequestException(
        'The uploaded CV does not contain a valid PDF signature.',
      );
    }
  }

  deleteCvIfExists(cvUrl?: string | null): void {
    if (!cvUrl || !cvUrl.startsWith(CV_PUBLIC_PATH_PREFIX)) {
      return;
    }

    const filename = cvUrl.replace(`${CV_PUBLIC_PATH_PREFIX}/`, '');

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.pdf$/i.test(
        filename,
      )
    ) {
      return;
    }

    const filePath = join(CV_UPLOAD_DIR, filename);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
