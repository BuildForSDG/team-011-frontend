export interface LoginInput {
  email: string;
  password: string;
}
export interface SignupInput extends LoginInput {
  role: 'Farmer' | 'Landowner';
  firstName: string;
  lastName: string;
}

export interface LoginResp {
  accessToken: string;
  expiresInMins: number;
}

export interface SignupResp {
  canLogin: boolean;
}
