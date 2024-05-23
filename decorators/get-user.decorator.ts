import { createParamDecorator } from '@nestjs/common';

export const getUser = createParamDecorator((_data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
