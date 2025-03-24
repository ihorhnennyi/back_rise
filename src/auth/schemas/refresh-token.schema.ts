import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshToken extends Document {
  @Prop({ required: true, unique: true, trim: true })
  token: string;

  @Prop({ required: true, trim: true })
  userId: string;

  @Prop({ required: true, default: () => Date.now(), expires: '30d' })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// ✅ Логирование при удалении истёкших токенов
RefreshTokenSchema.pre('findOneAndDelete', function (next) {
  console.log(`📌 Видаляється прострочений токен: ${this.get('token')}`);
  next();
});
