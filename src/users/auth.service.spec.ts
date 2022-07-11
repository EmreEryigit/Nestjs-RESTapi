import { Test } from '@nestjs/testing';
import { doesNotMatch } from 'assert';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed pw', async () => {
    const user = await service.signup('emre@emre.com', '1234');

    expect(user.password).not.toEqual('1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('email in use', async (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    try {
      await service.signup('emre@emre.com', '1234');
    } catch (err) {
      done();
    }
  });

  it('not registered email', async (done) => {
    try {
      await service.signin('asfas@asdf.com', 'adfasd');
    } catch (err) {
      done();
    }
  });

  it('invalid password', async (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([{ email: 'asdf@asfd.com', password: 'adfasd' } as User]);

    try {
      await service.signin('adfasdf', 'passowrd');
    } catch (err) {
      done();
    }
  });
});
