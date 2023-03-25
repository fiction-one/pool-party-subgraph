import { FID, User } from "../../generated/schema";

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
