export type UserRole = "Farmer" | "Landowner" | "Admin";
export class LoginInput {
  email: string;
  password: string;

  constructor(input?: Partial<LoginInput>) {
    Object.assign(this, input);
  }
}
export class SignupInput extends LoginInput {
  role: UserRole;
  firstName: string;
  lastName: string;
  /**
   *
   */
  constructor(input?: Partial<SignupInput>) {
    super(input);
    Object.assign(this, input);
  }
}

export class LoginResp {
  accessToken: string;
}

export class SignupResp {
  canLogin: boolean;
}
