import { BigInt } from "@graphprotocol/graph-ts";

import { FID } from "../../generated/schema";
import { Register as RegisterEvent } from "../../generated/IdRegistry/IdRegistry";

export function createFID(event: RegisterEvent): FID {
  const tokenId = event.params.id;

  const fid = new FID(tokenId.toString());

  fid.custodyAddr = event.params.to.toHex();
  fid.createdAtBlock = event.block.number;
  fid.createdAtTs = event.block.timestamp;

  return fid;
}

export function loadFID(tokenId: BigInt): FID | null {
  const fidId = tokenId.toString();
  return FID.load(fidId);
}

export function updateFidCustody(fid: FID, to: string): void {
  fid.custodyAddr = to;
  fid.save();
}
