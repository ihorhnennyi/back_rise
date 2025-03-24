import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class City extends Document {
  @Prop({ required: true, unique: true, trim: true, minlength: 2, index: true })
  name: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  createdBy: Types.ObjectId;
}

export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

CitySchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
