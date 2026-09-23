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
          return base64Pattern.test(value) && value.length % 4 === 0;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'avatar must be a plain base64-encoded string (no data URI prefix such as "data:image/...;base64,")';
        },
      },
    });
  };
}
