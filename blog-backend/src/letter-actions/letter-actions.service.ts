import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLetterActionInput } from './dto/create-letter-action.input';

@Injectable()
export class LetterActionsService {
  constructor(private prisma: PrismaService) { }
  create(input: CreateLetterActionInput) {
    return this.prisma.letterAction.create({ data: input })
  }
}
