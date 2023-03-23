import { User } from "../generated/schema";

export function updateUserFid(to: string, fid: string): void {
  let user = User.load(to);

  if (!user) {
    user = new User(to);
    user.fname = "";
  }

  user.fid = fid;
  user.save();
}

export function deleteUserFid(from: string): void {
  let user = User.load(from);

  if (user) {
    user.fid = "";
    user.save();
  }
}
