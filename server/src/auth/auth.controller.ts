
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to get JWT token' })
  @ApiBody({ schema: { example: { email: 'admin@wedo.com', password: 'password' } } })
  async login(@Body() req) {
    return this.authService.login(req);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ schema: { example: { email: 'user@wedo.com', password: 'password', name: 'John Doe' } } })
  async signup(@Body() req) {
    return this.authService.register(req);
  }
}
