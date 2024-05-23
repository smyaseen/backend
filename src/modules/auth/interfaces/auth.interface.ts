import { IUserAuthResponse } from 'interfaces/user.interface';

export interface RegistrationStatus {
  success: boolean;
  message: string;
  data?: IUserAuthResponse;
}
