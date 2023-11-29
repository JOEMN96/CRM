import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role, Roles } from 'src/auth/common';
import { CreateNewUser } from './dto';
import { Observable, interval, map } from 'rxjs';
import { User } from 'src/utils';
import { Payload } from 'src/auth/types';

@Controller('users')
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    if (!Number(id)) {
      throw new HttpException('Bad ID', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.getUserById(Number(id));
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  deleteUserById(@Param('id') id: string) {
    if (!Number(id)) {
      throw new HttpException('Bad ID', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.deleteUserById(Number(id));
  }

  @Post('/new')
  @HttpCode(HttpStatus.OK)
  createNewUser(@Body() dto: CreateNewUser) {
    return this.usersService.createNewUser(dto);
  }

  @Sse('notification/sse')
  sse(@User() user: Payload): Observable<MessageEvent> {
    console.log(user);
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
