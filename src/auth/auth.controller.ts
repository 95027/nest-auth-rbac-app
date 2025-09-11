import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/entities/user.entity';

@ApiTags('Auth') // Group endpoints under "Auth"
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: User })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login user and return JWT token in cookie' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto).then(({ token }) => {
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      return { message: 'Login successful' };
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user info from JWT token' })
  @ApiResponse({ status: 200, description: 'Returns user info', type: User })
  @ApiCookieAuth() // JWT in cookie
  getUserByToken(@Req() req: any) {
    return this.authService.getUserByToken(req);
  }
}
