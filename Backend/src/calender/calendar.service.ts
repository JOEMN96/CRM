import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NewEntry, getAllEntries } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import * as moment from 'moment';
import { Payload } from 'src/auth/types';

@Injectable()
export class CalenderService {
  constructor(private dataSource: PrismaService) {}

  async addNewEntry(data: NewEntry, user: Payload) {
    let canEdit = this.canAddTimeEntry();

    if (!canEdit)
      throw new HttpException('Time frame is closed', HttpStatus.BAD_REQUEST);

    let currentMonth = this.getCurrentMonth();

    const projectID = await this.dataSource.project.findFirst({
      where: { id: data.project },
      select: {
        id: true,
      },
    });

    if (!projectID)
      throw new HttpException('Unknown Project ID', HttpStatus.BAD_REQUEST);

    const entryforDayAlreadyExits = await this.dataSource.calender.findFirst({
      where: {
        createdAt: {
          gte: new Date(this.getTimeFrameToEdit().start.split('T')[0]),
          lte: new Date(this.getTimeFrameToEdit().end.split('T')[0]),
        },
      },
    });

    if (entryforDayAlreadyExits) {
      await this.dataSource.calender.update({
        where: { id: entryforDayAlreadyExits.id },
        data: { workDescription: data.workDescription },
      });

      throw new HttpException('Time entry updated', HttpStatus.PARTIAL_CONTENT);
    }

    await this.dataSource.calender.create({
      data: {
        month: currentMonth,
        workDescription: data.workDescription,
        project: {
          connect: { id: projectID.id },
        },
        user: {
          connect: { id: user.id },
        },
      },
    });

    throw new HttpException('Time entry added', HttpStatus.CREATED);
  }

  async getcurrentMonthEntries(user: Payload, dto: getAllEntries) {
    return await this.dataSource.calender.findMany({
      where: { userId: user.id, month: dto.month, projectID: dto.projectId },
      select: {
        workDescription: true,
        id: true,
        createdAt: true,
      },
    });
  }

  //  Helpers
  canAddTimeEntry(): Boolean {
    let currentTime = moment().format('YYYY-MM-DD[T]h:mm:ss');
    let timeframeToEdit = this.getTimeFrameToEdit();

    return moment(currentTime).isBetween(
      moment(timeframeToEdit.start, 'YYYY-MM-DD[T]hh:mm:ss'),
      moment(timeframeToEdit.end, 'YYYY-MM-DD[T]hh:mm:ss'),
    );
  }

  getTimeFrameToEdit() {
    return {
      start: moment().subtract(24, 'hour').format('YYYY-MM-DD[T]hh:mm:ss'),
      end: moment().add(1, 'day').format('YYYY-MM-DD[T]hh:mm:ss'),
    };
  }

  getCurrentMonth() {
    return moment().month() + 1;
  }
}
