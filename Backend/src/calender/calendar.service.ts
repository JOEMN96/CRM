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

    if (!canEdit) throw new HttpException('Time frame is closed', HttpStatus.BAD_REQUEST);

    let currentMonth = this.getCurrentMonth();

    const projectID = await this.dataSource.project.findFirst({
      where: { id: data.project },
      select: {
        id: true,
      },
    });

    if (!projectID) throw new HttpException('Unknown Project ID', HttpStatus.BAD_REQUEST);

    const entryforDayAlreadyExits = await this.dataSource.calender.findFirst({
      where: {
        createdAt: {
          gte: new Date((data.date + this.getCurrentTime()).split('T')[0]),
          lte: new Date((data.date + this.getCurrentTime()).split('T')[0]),
        },
        projectID: projectID.id,
        userId: user.id,
      },
    });

    if (entryforDayAlreadyExits) {
      await this.dataSource.calender.update({
        where: { id: entryforDayAlreadyExits.id, projectID: projectID.id },
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
    let [res, projectExits, isUserHaveAccessToProject] = await Promise.all([
      this.dataSource.calender.findMany({
        where: { userId: user.id, month: dto.month, projectID: dto.projectId },
        select: {
          workDescription: true,
          id: true,
          createdAt: true,
        },
      }),
      this.dataSource.project.findFirst({
        where: { id: dto.projectId },
        select: {
          id: true,
        },
      }),
      this.dataSource.users
        .findFirst({
          where: {
            id: user.id,
          },
          select: { projects: true },
        })
        .projects(),
    ]);

    const availableProjectsForUser = isUserHaveAccessToProject.map((project) => project.id);

    if (user.role === 'USER' && !availableProjectsForUser.includes(projectExits.id)) {
      throw new HttpException("User don't have access to this project", HttpStatus.FORBIDDEN);
    }

    if (!projectExits) throw new HttpException('Unknown Project ID', HttpStatus.BAD_REQUEST);

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

  async getEntriesById(userId: number) {
    let res = await this.dataSource.users.findUnique({
      where: { id: userId },
      select: {
        calender: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    if (res) {
      return res.calender;
    } else {
      return [];
    }
  }

  //  Helpers
  canAddTimeEntry(customDate: string | null): Boolean {
    let currentTime: string;

    try {
      if (customDate) {
        currentTime = moment(customDate, 'YYYY-MM-DD').format('YYYY-MM-DD') + this.getCurrentTime();
      } else {
        currentTime = moment().format('YYYY-MM-DD[T]HH:mm:ss');
      }
    } catch (error) {
      throw new HttpException('Time Calculation error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let timeframeToEdit = this.getTimeFrameToEdit();

    return moment(currentTime).isBetween(moment(timeframeToEdit.start, 'YYYY-MM-DD[T]HH:mm:ss'), moment(timeframeToEdit.end, 'YYYY-MM-DD[T]HH:mm:ss'));
  }

  getTimeFrameToEdit() {
    return {
      start: moment().subtract(25, 'hours').format('YYYY-MM-DD[T]HH:mm:ss'),
      end: moment().add(10, 'minutes').format('YYYY-MM-DD[T]HH:mm:ss'),
    };
  }

  getCurrentMonth() {
    return moment().month() + 1;
  }

  getCurrentTime() {
    return moment().format('[T]HH:mm:ss');
  }
}
