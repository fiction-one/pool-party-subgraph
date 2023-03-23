import { BigInt, Bytes } from "@graphprotocol/graph-ts";

import { FName, User } from "./../generated/schema";
import {
  Renew as RenewEvent,
  Transfer as TransferEvent,
} from "../generated/NameRegistry/NameRegistry";

export function handleTransfer(event: TransferEvent): void {
  let fname = FName.load(event.params.tokenId.toString());

  if (!fname) {
    fname = new FName(event.params.tokenId.toString());
    fname.fname = extractFname(event.params.tokenId);
    fname.createdAtBlock = event.block.number;
    fname.createdAtTimestamp = event.block.timestamp;
  }

  fname.custodyAddr = event.params.to;
  fname.save();

  handleOldOwner(event.params.from.toHex());
  handleNewOwner(event.params.to.toHex(), event.params.tokenId.toString());
}

function handleNewOwner(to: string, tokenId: string): void {
  let user = User.load(to);

  if (!user) {
    user = new User(to);
    user.fid = "0";
  }

  user.fname = tokenId;
  user.save();
}

function handleOldOwner(from: string): void {
  let user = User.load(from);

  if (!user) {
    user = new User(from);
    user.fid = "0";
  }

  user.fname = "";
  user.save();
}

function extractFname(tokenId: BigInt): string {
  const tokenIdHex = tokenId.toHexString();
  const tokenIdBytes = Bytes.fromHexString(tokenIdHex);
  return tokenIdBytes.toString();
}

export function handleRenew(event: RenewEvent): void {
  // tokenId bigInt
  // expiry bigInt
}
