import { FID } from "./../generated/schema";
import { Register, Transfer } from "../generated/IdRegistry/IdRegistry";

export function handleRegister(event: Register): void {
  let fid = new FID(event.params.id.toString());
  fid.custodyAddr = event.params.to;
  fid.recoveryAddr = event.params.recovery;
  fid.createdAtBlock = event.block.number;
  fid.createdAtTimestamp = event.block.timestamp;
  fid.save();
}

export function handleTransfer(event: Transfer): void {}
