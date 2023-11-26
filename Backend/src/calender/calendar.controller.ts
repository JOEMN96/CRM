import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  HttpException,
} from '@nestjs/common';
import { NewEntry, getAllEntries } from './dtos';
import { CalenderService } from './calendar.service';
import { User } from 'src/utils';
import { Payload } from 'src/auth/types';
import { Role, Roles } from 'src/auth/common';

@Controller('calender')
export class CalenderController {
  constructor(private calenderService: CalenderService) {}

  @Post('/add')
  @HttpCode(HttpStatus.OK)
  AddNewEntry(@Body() dto: NewEntry, @User() user: Payload) {
    return this.calenderService.addNewEntry(dto, user);
  }

  @Get('/getEntries')
  getcurrentMonthEntries(@User() user: Payload, @Body() dto: getAllEntries) {
    return this.calenderService.getcurrentMonthEntries(user, dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('/getEntriesById/:id')
  @HttpCode(HttpStatus.OK)
  getEntriesById(@Param('id') userId: string) {
    if (!Number(userId)) {
      throw new HttpException('Bad ID', HttpStatus.BAD_REQUEST);
    }
    return this.calenderService.getEntriesById(Number(userId));
  }
}
