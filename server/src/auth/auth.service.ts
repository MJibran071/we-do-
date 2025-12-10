
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: any) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }

  async register(userDto: any) {
    const existingUser = await this.usersService.findOne(userDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    
    const user = await this.usersService.create(userDto);
    const payload = { username: user.email, sub: user.id, role: user.role };
    
    const { password, ...userProfile } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userProfile
    };
  }
}
