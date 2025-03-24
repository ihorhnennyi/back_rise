import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { UserRole } from '../../auth/enums/user-role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ trim: true })
  lastName?: string;

  @Prop({ trim: true })
  middleName?: string;

  @Prop()
  birthDate?: Date;

  @Prop({ required: true, unique: true, trim: true, index: true })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  telegram?: string;

  @Prop({ trim: true })
  viber?: string;

  @Prop({ trim: true })
  whatsapp?: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ required: true, enum: Object.values(UserRole) })
  role: UserRole;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'City' })
  city?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branch?: Types.ObjectId;

  @Prop({ type: String })
  photoUrl?: string;

  @Prop({ type: String })
  comment?: string;

  @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Integration' }] })
  integrations?: Types.ObjectId[];

  @Prop({
    type: [
      {
        integrationId: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'Integration',
        },
        login: String,
        password: String,
      },
    ],
  })
  integrationCredentials?: {
    integrationId: Types.ObjectId;
    login: string;
    password: string;
  }[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'City' }] })
  createdCities: Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Branch' }] })
  createdBranches: Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Status' }] })
  createdStatuses: Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Integration' }] })
  createdIntegrations: Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Candidate' }] })
  createdCandidates: Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  createdUsers: Types.ObjectId[]; // 🔥 Админ хранит пользователей, которых он создал

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
