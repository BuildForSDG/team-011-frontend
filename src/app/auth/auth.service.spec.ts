import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SignupInput, SignupResp, LoginInput, LoginResp } from './auth.dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const signupInput: SignupInput = {
    email: 'test@mail.com',
    firstName: 'First',
    lastName: 'Last',
    password: '123qwE!',
    role: 'Landowner'
  };
  const loginInput: LoginInput = {
    password: signupInput.password,
    email: signupInput.email
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register user', () => {
    const expected: SignupResp = {
      canLogin: false
    };

    service.register(signupInput).subscribe(res => {
      expect(res).toEqual(expected);
    });

    const req = httpMock.expectOne(service.endpoint('register'));
    expect(req.request.method).toBe('POST');

    req.flush(expected);
  });

  it('should sign user in', () => {
    const expected: LoginResp = {
      accessToken: 'access_token'
    };
    service.login(loginInput).subscribe(res => {
      expect(res).toEqual(expected);
    });

    const req = httpMock.expectOne(service.endpoint('login'));
    expect(req.request.method).toBe('POST');

    req.flush(expected);
  });
});
