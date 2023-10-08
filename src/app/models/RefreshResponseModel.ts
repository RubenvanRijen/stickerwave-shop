import { userData } from './UserData';

export interface RefreshResponseModel {
  access_token: string;
  expires_in: number;
  token_type: string;
  user: userData;
}
