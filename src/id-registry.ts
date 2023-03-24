import { FID } from "./../generated/schema";
import { Register, Transfer } from "../generated/IdRegistry/IdRegistry";
import { updateUserFid, deleteUserFid } from "../utils/id-registry";

export function handleRegister(event: Register): void {
  let fid = new FID(event.params.id.toString());
  fid.custodyAddr = event.params.to;
  fid.createdAtBlock = event.block.number;
  fid.createdAtTs = event.block.timestamp;
  fid.save();

  updateUserFid(event.params.to.toHex(), fid);
}

export function handleTransfer(event: Transfer): void {
  let fid = FID.load(event.params.id.toString());

  if (fid) {
    fid.custodyAddr = event.params.to;
    fid.save();
    deleteUserFid(event.params.from.toHex());
    updateUserFid(event.params.to.toHex(), fid);
  }
}
