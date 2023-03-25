import { FName, User, FID } from "../../generated/schema";

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

export function updateUserFid(to: string, fid: FID): void {
  let user = User.load(to);

  if (!user) {
    user = new User(to);
  }

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
