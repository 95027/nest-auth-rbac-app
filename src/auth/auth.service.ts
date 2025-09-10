import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPass = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepo.create({
      ...createUserDto,
      password: hashedPass,
    });
    return this.userRepo.save(newUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new NotFoundException('User not found...');
    }

    const isValid = bcrypt.compareSync(loginDto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1h' },
    );

    return {
      token,
    };
  }

  async getUserByToken(req: any) {
    const payload = req.user;

    if (!payload?.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
