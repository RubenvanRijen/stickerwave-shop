import { userData } from './UserData';

export interface loginResponseModel {
  access_token: string;
  expires_in: number;
  token_type: string;
  user: userData;
  message: string;
}
