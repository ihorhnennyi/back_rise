import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Status extends Document {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, type: String, match: /^#([0-9A-Fa-f]{6})$/ })
  color: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const StatusSchema = SchemaFactory.createForClass(Status);

StatusSchema.set('toJSON', { virtuals: true });
StatusSchema.set('toObject', { virtuals: true });

StatusSchema.index({ name: 1 }, { unique: true });
