import { UserRole } from '../enums/user-role.enum';

export interface JwtPayload {
  email: string;
  role: UserRole;
  id: string;
}
