export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export type UpdateUserInput = Partial<IUser>;