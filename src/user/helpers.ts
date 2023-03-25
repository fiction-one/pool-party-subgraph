import { FName, User, FID } from "../../generated/schema";
import { incrementCount } from "../global/helpers";

const USER_COUNT_ID = "user_count";

export function updateUserFnameId(to: string, fname: FName): void {
  const user = loadOrCreateUser(to);

  user.fname = fname.id;
  user.save();
}

export function deleteUserFnameId(from: string): void {
  const user = loadOrCreateUser(from);

  user.fname = null;
  user.save();
}

export function updateUserFid(to: string, fid: FID): void {
  const user = loadOrCreateUser(to);

  user.fid = fid.id;
  user.save();
}

export function deleteUserFid(from: string): void {
  let user = User.load(from);

  if (user) {
    user.fid = null;
    user.save();
  }
}

function loadOrCreateUser(id: string): User {
  let user = User.load(id);

  if (!user) {
    user = new User(id);
    incrementCount(USER_COUNT_ID);
  }

  return user;
}
