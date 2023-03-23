import { FName } from "./../generated/schema";
import {
  Renew as RenewEvent,
  Transfer as TransferEvent,
} from "../generated/NameRegistry/NameRegistry";
import { updateUserFnameId, deleteUserFnameId, initializeFname } from "./utils";

export function handleTransfer(event: TransferEvent): void {
  const tokenId = event.params.tokenId;
  const newCustody = event.params.to;
  const oldCustody = event.params.from;

  let fname = FName.load(tokenId.toString());

  if (!fname) {
    fname = initializeFname(event);
  }

  fname.custodyAddr = newCustody;
  fname.save();

  deleteUserFnameId(oldCustody.toHex());
  updateUserFnameId(newCustody.toHex(), tokenId.toString());
}

export function handleRenew(event: RenewEvent): void {
  // tokenId bigInt
  // expiry bigInt
}
