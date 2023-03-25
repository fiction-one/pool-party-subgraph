import {
  Renew as RenewEvent,
  Transfer as TransferEvent,
} from "../../generated/NameRegistry/NameRegistry";
import {
  updateFnameCustody,
  loadOrCreateFname,
  loadFname,
  updateFnameExpiry,
} from "./helpers";
import { updateUserFnameId, deleteUserFnameId } from "../user/helpers";

export function handleTransfer(event: TransferEvent): void {
  const newCustody = event.params.to;
  const oldCustody = event.params.from;

  let fname = loadOrCreateFname(event);

  updateFnameCustody(fname, newCustody);
  deleteUserFnameId(oldCustody.toHex());
  updateUserFnameId(newCustody.toHex(), fname);
}

export function handleRenew(event: RenewEvent): void {
  let fname = loadFname(event.params.tokenId);

  if (fname) {
    updateFnameExpiry(fname, event.params.expiry);
  }
}
