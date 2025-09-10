import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid Email Format' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @MinLength(6, { message: 'phone must be at least 10 characters long' })
  @MaxLength(15, { message: 'phone must be at less than 15 characters long' })
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
