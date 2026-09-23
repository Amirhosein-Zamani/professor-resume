import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

const FACULTY_ICON_PUBLIC_PREFIX = '/assets/faculties';
const MAX_SVG_SIZE_BYTES = 256 * 1024;

function resolveApiRoot(): string {
  const currentDirectory = process.cwd();

  if (existsSync(join(currentDirectory, 'prisma'))) {
    return currentDirectory;
  }

  return join(currentDirectory, 'apps', 'api');
}

@Injectable()
export class FacultyIconStorageService {
  private readonly uploadDirectory = join(
    resolveApiRoot(),
    'assets',
    'faculties',
  );

  constructor() {
    if (!existsSync(this.uploadDirectory)) {
      mkdirSync(this.uploadDirectory, { recursive: true });
    }
  }

  saveIcon(file: Express.Multer.File): string {
    this.validateSvg(file);

    const filename = `${randomUUID()}.svg`;
    writeFileSync(join(this.uploadDirectory, filename), file.buffer);

    return `${FACULTY_ICON_PUBLIC_PREFIX}/${filename}`;
  }

  deleteIconIfExists(iconUrl?: string | null): void {
    if (!iconUrl?.startsWith(`${FACULTY_ICON_PUBLIC_PREFIX}/`)) {
      return;
    }

    const filename = iconUrl.slice(FACULTY_ICON_PUBLIC_PREFIX.length + 1);

    if (!/^[a-f0-9-]+\.svg$/i.test(filename)) {
      return;
    }

    const filePath = join(this.uploadDirectory, filename);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  private validateSvg(file: Express.Multer.File): void {
    if (file.size > MAX_SVG_SIZE_BYTES) {
      throw new BadRequestException('SVG icon must be 256 KB or smaller.');
    }

    if (!file.originalname.toLowerCase().endsWith('.svg')) {
      throw new BadRequestException('Faculty icon must be an SVG file.');
    }

    if (file.mimetype !== 'image/svg+xml') {
      throw new BadRequestException(
        'Faculty icon must use the image/svg+xml MIME type.',
      );
    }

    const svg = file.buffer.toString('utf8').trim();

    if (svg.includes('\u0000')) {
      throw new BadRequestException('The SVG contains invalid binary data.');
    }

    if (
      !/^<svg(?:\s|>)/i.test(svg) &&
      !/^<\?xml[\s\S]*?<svg(?:\s|>)/i.test(svg)
    ) {
      throw new BadRequestException('The uploaded file is not a valid SVG.');
    }

    const unsafePattern =
      /<\s*(script|style|foreignObject|iframe|object|embed|image|use)|\son[a-z]+\s*=|(?:href|xlink:href)\s*=|url\s*\(|javascript\s*:|data\s*:|<!DOCTYPE|<!ENTITY/i;

    if (unsafePattern.test(svg)) {
      throw new BadRequestException('The SVG contains unsafe content.');
    }
  }
}
