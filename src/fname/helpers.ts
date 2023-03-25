import { BigInt, Bytes } from "@graphprotocol/graph-ts";

import { FName, Pool } from "../../generated/schema";
import {
  Transfer,
  NameRegistry,
} from "../../generated/NameRegistry/NameRegistry";
import { incrementCount } from "../global/helpers";

export const FNAME_COUNTER_ID = "fname_count";
export const POOL_ID = "fname_pool";

export function loadOrCreateFname(event: Transfer): FName {
  let fname = loadFname(event.params.tokenId);

  if (!fname) {
    fname = createFname(event);
    incrementCount(FNAME_COUNTER_ID);
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

  return fname;
}

export function updateFnameExpiryAsync(fname: FName, event: Transfer): void {
  fname.expiryTs = getTokenExpiryTs(event);
}

export function updateFnameExpiry(fname: FName, expiryTs: BigInt): void {
  fname.expiryTs = expiryTs;
}

export function updateFnameCustody(fname: FName, to: string): void {
  fname.custodyAddr = to;
}

export function extractNameFromId(tokenId: BigInt): string {
  const tokenIdHex = tokenId.toHexString();
  const tokenIdBytes = Bytes.fromHexString(tokenIdHex);
  return tokenIdBytes.toString();
}

function getTokenExpiryTs(event: Transfer): BigInt {
  const nameRegistry = NameRegistry.bind(event.address);
  const tokenId = event.params.tokenId;
  return nameRegistry.expiryOf(tokenId);
}

export function loadOrCreatePool(): Pool {
  let pool = Pool.load(POOL_ID);

  if (!pool) {
    pool = new Pool(POOL_ID);
  }

  return pool;
}
