import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @Public()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.login(loginDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return { message: 'Login successful' };
  }

  @Get('me')
  getUserByToken(@Req() req: any) {
    return this.authService.getUserByToken(req);
  }
}
