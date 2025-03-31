import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Candidate extends Document {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ trim: true })
  middleName?: string;

  @Prop({ trim: true })
  age: number;

  @Prop({ trim: true, unique: false, sparse: true })
  email?: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  photoUrl?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'City', required: false })
  city: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId;

  @Prop({ trim: true })
  salary: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Status', required: false })
  status: Types.ObjectId;

  @Prop({
    type: [
      {
        status: { type: MongooseSchema.Types.ObjectId, ref: 'Status' },
        expirationDate: Date,
      },
    ],
    default: [],
  })
  statusHistory: { status: Types.ObjectId; expirationDate?: Date }[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Source' })
  source?: Types.ObjectId;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
