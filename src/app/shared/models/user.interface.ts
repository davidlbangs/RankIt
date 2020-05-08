export interface Roles {
  user: boolean;
  admin?: boolean;
  super?: boolean;
}

export class User {
  email: string;
  roles?: Roles;
  uid: string;
  authenticated?: boolean;

  constructor(authData) {
    this.email = authData.email
    this.uid = authData.uid
    this.roles = {user: true}
  }
}