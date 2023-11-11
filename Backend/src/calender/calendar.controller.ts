import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NewEntry, getAllEntries } from './dtos';
import { CalenderService } from './calendar.service';
import { User } from 'src/utils';
import { Payload } from 'src/auth/types';

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
}
