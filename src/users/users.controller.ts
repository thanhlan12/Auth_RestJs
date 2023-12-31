import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/auth/roles/user.roles';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {CreateUserDto} from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @hasRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query('skip') skip: string, @Query('limit') limit: string) {
    return this.usersService.findAll(+skip, +limit);
  }



  @hasRoles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/add')
  add(@Body() createUserDto: CreateUserDto):Promise<{token:string}>{
    return this.usersService.add(createUserDto);
}

  // @hasRoles(UserRole.Admin, UserRole.User)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @hasRoles(UserRole.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  //}
}
