// user.model.ts (contoh)
import { Schema, model, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema<User>({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = model<User>('User', UserSchema);
