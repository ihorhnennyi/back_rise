import { Document, Types } from 'mongoose';
import { UserRole } from '../../auth/enums/user-role.enum';

export interface IUser extends Document {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName?: string;
  readonly birthDate: Date;
  readonly phone: string;
  readonly email: string;
  password: string;
  readonly role: UserRole;
  readonly city: Types.ObjectId;
  readonly branch: Types.ObjectId;
  readonly telegram?: string;
  readonly viber?: string;
  readonly whatsapp?: string;
  readonly photoUrl?: string;
  readonly integrations?: Types.ObjectId[];
  readonly integrationCredentials?: {
    integrationId: Types.ObjectId;
    login: string;
    password: string;
  }[];
  readonly status: 'active' | 'inactive';
  readonly comment?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdUsers?: Types.ObjectId[];
  readonly createdCandidates?: Types.ObjectId[];
  readonly createdCities?: Types.ObjectId[];
  readonly createdBranches?: Types.ObjectId[];
  readonly createdStatuses?: Types.ObjectId[];
  readonly createdIntegrations?: Types.ObjectId[];
}
