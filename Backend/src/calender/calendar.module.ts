import { Module } from '@nestjs/common';
import { CalenderController } from './calendar.controller';
import { CalenderService } from './calendar.service';

@Module({
  controllers: [CalenderController],
  providers: [CalenderService],
})
export class CalenderModule {}
