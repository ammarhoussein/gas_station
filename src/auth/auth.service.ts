import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Ensure bcrypt is installed
import * as dotenv from 'dotenv';
// auth.service.ts
type AuthInput={username:string,password:string}
type SignInData={userId:string,username:string}
type AuthResult={accesstoken:string,userId:string,username:string}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async authenticate(input:AuthInput):Promise<AuthResult>{
    const user =await this.validateUser(input);
    if(!user){
        throw new UnauthorizedException;
    }
    return this.login(user)
  }

  async validateUser(input:AuthInput): Promise<SignInData|null> {
    const user = await this.usersService.findOneByUsername(input.username);
    if (user && await bcrypt.compare(input.password, user.password_hash)) {
      //const { password_hash, ...result } = user;
      return {
        userId:user.id,
        username:user.username
      };
    }
    return null;
  }

  async login(user: SignInData):Promise<AuthResult> {
    const payload = {sub: user.userId, username: user.username };
    return {
      accesstoken: await this.jwtService.signAsync(payload),
      userId:payload.sub,
      username:payload.username // Useful for the Android app to know the user's role immediately
    };
  }
}
