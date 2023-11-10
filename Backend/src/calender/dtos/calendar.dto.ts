import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewEntry {
  @IsNotEmpty()
  @IsString()
  workDescription: string;
}
