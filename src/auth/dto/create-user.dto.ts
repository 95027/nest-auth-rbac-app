import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid Email Format' })
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Password of the user', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ example: '9876543210', description: 'Phone number of the user', minLength: 10, maxLength: 15 })
  @IsOptional()
  @MinLength(6, { message: 'phone must be at least 10 characters long' })
  @MaxLength(15, { message: 'phone must be at less than 15 characters long' })
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', description: 'Avatar URL of the user' })
  @IsOptional()
  @IsString()
  avatar?: string;
}
