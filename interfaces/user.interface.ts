interface IUser {
  name: string;
  role: string;
}

export interface IUserAuthResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: IUser;
}
