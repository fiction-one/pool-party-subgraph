import { FID, User } from "./../generated/schema";
import { Register, Transfer } from "../generated/IdRegistry/IdRegistry";

export function handleRegister(event: Register): void {
  let fid = new FID(event.params.id.toString());
  fid.custodyAddr = event.params.to;
  fid.createdAtBlock = event.block.number;
  fid.createdAtTimestamp = event.block.timestamp;
  fid.save();

  handleNewOwner(event.params.to.toHex(), event.params.id.toString());
}

export function handleTransfer(event: Transfer): void {
  let fid = FID.load(event.params.id.toString());

  if (fid) {
    fid.custodyAddr = event.params.to;
    fid.save();
  }

  handleNewOwner(event.params.to.toHex(), event.params.id.toString());
  handleOldOwner(event.params.from.toHex());
}

function handleNewOwner(to: string, fid: string): void {
  let user = User.load(to);

  if (!user) {
    user = new User(to);
    user.fname = "";
  }

  user.fid = fid;
  user.save();
}

function handleOldOwner(from: string): void {
  let user = User.load(from);

  if (user) {
    user.fid = "";
    user.save();
  }
}
