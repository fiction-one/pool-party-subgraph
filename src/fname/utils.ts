import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";

import { FName } from "../../generated/schema";
import {
  Transfer,
  NameRegistry,
} from "../../generated/NameRegistry/NameRegistry";

export function loadOrCreateFname(event: Transfer): FName {
  let fname = loadFname(event.params.tokenId);

  if (!fname) {
    fname = createFname(event);
  }

  return fname;
}

export function loadFname(tokenId: BigInt): FName | null {
  const fnameId = tokenId.toString();
  return FName.load(fnameId);
}

export function createFname(event: Transfer): FName {
  const tokenId = event.params.tokenId;

  const fname = new FName(tokenId.toString());

  fname.fname = extractNameFromId(tokenId);
  fname.createdAtBlock = event.block.number;
  fname.createdAtTs = event.block.timestamp;
  fname.expiryTs = getTokenExpiryTs(event);

  return fname;
}

export function updateFnameExpiry(fname: FName, expiryTs: BigInt): void {
  fname.expiryTs = expiryTs;
  fname.save();
}

export function updateFnameCustody(fname: FName, to: Address): void {
  fname.custodyAddr = to;
  fname.save();
}

export function extractNameFromId(tokenId: BigInt): string {
  const tokenIdHex = tokenId.toHexString();
  const tokenIdBytes = Bytes.fromHexString(tokenIdHex);
  return tokenIdBytes.toString();
}

function getTokenExpiryTs(event: Transfer): BigInt {
  const nameRegistry = NameRegistry.bind(event.address);
  const tokenId = event.params.tokenId;
  const expiryTsCallResult = nameRegistry.try_expiryOf(tokenId);
  return expiryTsCallResult.value;
}
