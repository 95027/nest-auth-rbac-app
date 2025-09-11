import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid Email Format' })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password of the user',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
