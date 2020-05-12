export interface LoginInput {
  email: string;
  password: string;
}
export interface SignupInput extends LoginInput {
  role: 'Farmer' | 'Landowner';
  firstName: string;
  lastName: string;
}
