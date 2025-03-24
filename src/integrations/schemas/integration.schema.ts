import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Integration extends Document {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);

IntegrationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

IntegrationSchema.set('toObject', { virtuals: true });
