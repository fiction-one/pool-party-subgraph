import { FName, User } from "../../generated/schema";

export function updateUserFnameId(to: string, fname: FName): void {
  let user = User.load(to);

  if (!user) {
    user = new User(to);
  }

  user.fname = fname.id;
  user.save();
}

export function deleteUserFnameId(from: string): void {
  let user = User.load(from);

  if (!user) {
    user = new User(from);
  }

  user.fname = null;
  user.save();
}
