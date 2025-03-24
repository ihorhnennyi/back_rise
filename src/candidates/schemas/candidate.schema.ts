import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Candidate extends Document {
  @Prop({ required: true, trim: true })
  firstName: string; // Имя

  @Prop({ required: true, trim: true })
  lastName: string; // Фамилия

  @Prop({ trim: true })
  middleName?: string; // Отчество

  @Prop({ required: true })
  age: number; // Возраст

  @Prop({ required: true, unique: true, trim: true })
  email: string; // Email

  @Prop({ required: false, trim: true })
  phone: string; // Телефон

  @Prop({ trim: true })
  photoUrl?: string; // Фото профиля

  @Prop({ trim: true })
  description?: string; // Описание

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'City', required: false })
  city: Types.ObjectId; // Город

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; // Кто создал кандидата

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId; // Текущий рекрутер

  @Prop({ required: true })
  salary: number; // Зарплата

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Status', required: false })
  status: Types.ObjectId; // Текущий статус кандидата

  @Prop({
    type: [
      {
        status: { type: MongooseSchema.Types.ObjectId, ref: 'Status' },
        expirationDate: Date,
      },
    ],
    default: [],
  })
  statusHistory: { status: Types.ObjectId; expirationDate?: Date }[]; // История статусов

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
