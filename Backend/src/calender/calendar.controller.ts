import { Body, Controller, Post } from '@nestjs/common';
import { NewEntry } from './dtos';

@Controller('calender')
export class CalenderController {
  @Post('/add')
  AddNewEntry(@Body() dto: NewEntry) {
    return 'true';
  }
}
