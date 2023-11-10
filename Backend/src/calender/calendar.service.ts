import { Injectable } from '@nestjs/common';
import { NewEntry } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalenderService {
  constructor(private dataSource: PrismaService) {}

  async addNewEntry(data: NewEntry) {}
}
