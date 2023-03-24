import { FName } from "../generated/schema";
import { Transfer, NameRegistry } from "../generated/NameRegistry/NameRegistry";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { User } from "../generated/schema";

export function initializeFname(event: Transfer): FName {
  const tokenId = event.params.tokenId;

  const fname = new FName(tokenId.toString());
  fname.fname = extractNameFromId(tokenId);
  fname.createdAtBlock = event.block.number;
  fname.createdAtTs = event.block.timestamp;
  fname.expirationTimestamp = getTokenExpirationTimestamp(event);

  return fname;
}

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

export function extractNameFromId(tokenId: BigInt): string {
  const tokenIdHex = tokenId.toHexString();
  const tokenIdBytes = Bytes.fromHexString(tokenIdHex);
  return tokenIdBytes.toString();
}

function getTokenExpirationTimestamp(event: Transfer): BigInt {
  const nameRegistry = NameRegistry.bind(event.address);
  const tokenId = event.params.tokenId;
  const expirationTimestampCallResult = nameRegistry.try_expiryOf(tokenId);
  return expirationTimestampCallResult.value;
}
