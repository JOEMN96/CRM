import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NewEntry, getAllEntries } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import * as moment from 'moment';
import { Payload } from 'src/auth/types';

@Injectable()
export class CalenderService {
  constructor(private dataSource: PrismaService) {}

  async addNewEntry(data: NewEntry, user: Payload) {
    let canEdit = this.canAddTimeEntry(data.date);

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
          gte: new Date((data.date + this.getCurrentTime()).split('T')[0]),
          lte: new Date((data.date + this.getCurrentTime()).split('T')[0]),
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
        createdAt: new Date(data.date),
      },
    });

    throw new HttpException('Time entry added', HttpStatus.CREATED);
  }

  async getcurrentMonthEntries(user: Payload, dto: getAllEntries) {
    let res = await this.dataSource.calender.findMany({
      where: { userId: user.id, month: dto.month, projectID: dto.projectId },
      select: {
        workDescription: true,
        id: true,
        createdAt: true,
      },
    });

    let entries = res.map(({ createdAt, workDescription, id }) => {
      return {
        title: workDescription,
        start: moment(createdAt).format('YYYY-MM-DD[T]HH:mm:ss'),
        end: moment(createdAt).format('YYYY-MM-DD[T]HH:mm:ss'),
        id: id,
      };
    });

    return {
      entries,
      config: {
        timeFrame: this.getTimeFrameToEdit(),
        ClientCalendarDate: moment().startOf('month').format('YYYY-MM-DD'),
      },
    };
  }

  //  Helpers
  canAddTimeEntry(customTime: string | null): Boolean {
    let currentTime = moment().format('YYYY-MM-DD[T]HH:mm:ss');
    if (customTime) {
      currentTime = moment(currentTime).format('YYYY-MM-DD[T]HH:mm:ss');
    }

    let timeframeToEdit = this.getTimeFrameToEdit();

    return moment(currentTime).isBetween(
      moment(timeframeToEdit.start, 'YYYY-MM-DD[T]HH:mm:ss'),
      moment(timeframeToEdit.end, 'YYYY-MM-DD[T]HH:mm:ss'),
    );
  }

  getTimeFrameToEdit() {
    return {
      start: moment().subtract(24, 'hours').format('YYYY-MM-DD[T]HH:mm:ss'),
      end: moment().add(4, 'hours').format('YYYY-MM-DD[T]HH:mm:ss'),
    };
  }

  getCurrentMonth() {
    return moment().month() + 1;
  }

  getCurrentTime() {
    return moment().format('[T]HH:mm:ss');
  }
}
