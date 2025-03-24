import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module'; // ✅ Импорт UsersModule
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { Candidate, CandidateSchema } from './schemas/candidate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
    forwardRef(() => UsersModule), // ✅ Добавляем UsersModule
  ],
  controllers: [CandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
