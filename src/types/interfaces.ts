export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  refreshToken: string;
  save: Function;
}

enum Role {
  "host",
  "guest",
}

export interface newUser {
  name: string;
  password: string;
  email: string;
  role: string;
  _id: string;
}
