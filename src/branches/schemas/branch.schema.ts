import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Branch extends Document {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    index: true,
  })
  name: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'City' })
  city: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

BranchSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

BranchSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
