import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

@UseGuards(PermissionsGuard)
@Controller('admin/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUser() {
    return this.userService.getAllUsers();
  }
}
