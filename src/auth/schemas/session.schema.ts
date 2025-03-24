import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ required: true, trim: true })
  userId: string;

  @Prop({ required: true, trim: true })
  ip: string;

  @Prop({ required: true, trim: true })
  userAgent: string;

  @Prop({ required: true, default: true })
  active: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// ✅ Логирование при изменении статуса сессии
SessionSchema.pre('save', function (next) {
  console.log(
    `Оновлення сесії для користувача: ${this.userId}, активна: ${this.active}`,
  );
  next();
});
