export const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
export const passwordLength = { min: 8, max: 20 };
export const invalidPasswordMessage =
  'password must contain at least one number, one lowercase letter, and one special character';
export const invalidPasswordLengthMessage = `password must be at least ${passwordLength.min} to ${passwordLength.max} characters`;

export const APP_MESSAGES = {
  DB_ERRORS: {},
  USER: {
    SUCCESS_PROFILE_CREATED: 'Profile created successfully.',
    SUCCESS_PASSWORD_UPDATED: 'Password updated successfully.',
    SUCCESS_REFRESH_TOKEN: 'Profile get successfully.',
    SUCCESS_PROFILE_LOGIN: 'Profile login successfully.',
  },
};
