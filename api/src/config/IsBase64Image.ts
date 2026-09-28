import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBase64Image',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          if (typeof value !== 'string' || value.length === 0) {
            return false;
          }

          // اگر به‌اشتباه data URI کامل فرستاده شود (data:image/...;base64,XXXX)
          // رد می‌کنیم، چون طبق تصمیم پروژه فقط base64 خالص ذخیره می‌شود.
          if (value.startsWith('data:')) {
            return false;
          }

          const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
          if (!base64Pattern.test(value) || value.length % 4 !== 0) {
            return false;
          }

          try {
            const bytes = Buffer.from(value, 'base64');
            if (bytes.length === 0 || bytes.length > 5 * 1024 * 1024) {
              return false;
            }

            const isJpeg =
              bytes.length >= 3 &&
              bytes[0] === 0xff &&
              bytes[1] === 0xd8 &&
              bytes[2] === 0xff;

            const isPng =
              bytes.length >= 8 &&
              bytes[0] === 0x89 &&
              bytes[1] === 0x50 &&
              bytes[2] === 0x4e &&
              bytes[3] === 0x47 &&
              bytes[4] === 0x0d &&
              bytes[5] === 0x0a &&
              bytes[6] === 0x1a &&
              bytes[7] === 0x0a;

            const isWebp =
              bytes.length >= 12 &&
              bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
              bytes.subarray(8, 12).toString('ascii') === 'WEBP';

            return isJpeg || isPng || isWebp;
          } catch {
            return false;
          }
        },
        defaultMessage(_args: ValidationArguments) {
          return 'avatar must be a valid JPG, PNG, or WebP image encoded as plain base64 without a data URI prefix';
        },
      },
    });
  };
}
