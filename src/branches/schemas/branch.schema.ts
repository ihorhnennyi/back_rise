import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

/**
 * 🏢 Схема філії для MongoDB
 */
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
  name: string; // 🏢 Назва філії

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'City' })
  city: Types.ObjectId; // 📍 Місто, до якого належить філія

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId; // 👤 Користувач, який створив філію
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

// 🔄 Автоматично конвертуємо ObjectId в рядок при отриманні JSON
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
