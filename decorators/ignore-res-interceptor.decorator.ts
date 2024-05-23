import { SetMetadata } from '@nestjs/common';

export const keyIgnoreResponseInterceptor = 'ignore-res-interceptor-meta';

/**
 * Decorate to set meta-property of route to ignore gloabal response-interceptor
 */

export const setMetaIgnoreResponseInterceptor = (status: boolean) =>
  SetMetadata(keyIgnoreResponseInterceptor, status);
