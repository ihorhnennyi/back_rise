import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/crm',
    ),
  ],
  providers: [DatabaseService],
  exports: [MongooseModule, DatabaseService],
})
export class DatabaseModule {}
