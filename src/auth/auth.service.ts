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
import { Role } from 'src/entities/role.entity';
import { ROLES } from 'src/constants/roles';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const defaultRole = await this.roleRepo.findOne({
      where: { name: ROLES.USER.name },
    });

    if (!defaultRole) {
      throw new Error('Default role not found. Please seed roles first.');
    }

    const hashedPass = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepo.create({
      ...createUserDto,
      password: hashedPass,
      role: defaultRole,
    });
    return this.userRepo.save(newUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
      relations: ['role', 'role.permissions', 'userPermissions'],
    });
    if (!user) {
      throw new NotFoundException('User not found...');
    }

    const isValid = bcrypt.compareSync(loginDto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const allPerms = [
      ...(user.role?.permissions?.map((p) => p.name) || []),
      ...(user.userPermissions?.map((p) => p.name) || []),
    ];

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      guard: user.role.guard,
      permissions: allPerms,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretKey', {
      expiresIn: '1h',
    });

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
