import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesModule } from '../cities/cities.module';
import { UsersModule } from '../users/users.module';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { Branch, BranchSchema } from './schemas/branch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }]),
    forwardRef(() => CitiesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
