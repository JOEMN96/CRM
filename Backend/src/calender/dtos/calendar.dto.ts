import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewEntry {
  @IsNotEmpty()
  @IsString()
  workDescription: string;

  @IsNotEmpty()
  @IsNumber()
  project: number;

  @IsNotEmpty()
  @IsString()
  date: string;
}

export class getAllEntries {
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
