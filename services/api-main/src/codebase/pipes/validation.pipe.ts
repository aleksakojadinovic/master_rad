import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      throw e;
    }
  }
}
