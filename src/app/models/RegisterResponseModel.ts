import { userData } from "./UserData";

export interface registerResponseModel{
access_token: string;
expires_in:number
token_type: string;
user: userData;
}