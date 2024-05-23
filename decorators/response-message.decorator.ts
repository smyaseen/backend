import { SetMetadata } from '@nestjs/common';

export const responseMessageKey = 'ResponseMessageKey';
export const responseMessageMetadata = (message: string) =>
  SetMetadata(responseMessageKey, message);
