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
  // Sse,
  // MessageEvent,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role, Roles } from 'src/auth/common';
import { CreateNewUser } from './dto';
// import { Observable, fromEvent, map } from 'rxjs';
// import { User } from 'src/utils';
// import { Payload } from 'src/auth/types';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { EventAddNewNotificatoin } from 'src/notification/types';

@Controller('users')
@Roles(Role.ADMIN, Role.SUPERADMIN)
export class UsersController {
  constructor(
    private readonly usersService: UsersService, // private eventEmitter: EventEmitter2,
  ) {}

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

  // @Sse('notification/sse')
  // sse(@User() user: Payload): Observable<MessageEvent> {
  //   return fromEvent(this.eventEmitter, 'notification.sent').pipe(
  //     map((eve: EventAddNewNotificatoin) => {
  //       if (eve.user.id === user.id) {
  //         let data = eve.data;
  //         return { data } as unknown as MessageEvent;
  //       }
  //     }),
  //   );
  // }
}
