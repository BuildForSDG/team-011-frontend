export type UserRole = 'Farmer' | 'Landowner' | 'Admin';
export interface LoginInput {
  email: string;
  password: string;
}
export interface SignupInput extends LoginInput {
  role: UserRole;
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
