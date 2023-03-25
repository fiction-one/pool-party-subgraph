import { ChangePool } from './../../generated/NameRegistry/NameRegistry';
import {
  Renew as RenewEvent,
  Transfer as TransferEvent,
} from "../../generated/NameRegistry/NameRegistry";
import {
  updateFnameCustody,
  loadOrCreateFname,
  loadFname,
  updateFnameExpiry,
  updateFnameExpiryAsync,
  loadOrCreatePool,
} from "./helpers";
import { updateUserFnameId, deleteUserFnameId } from "../user/helpers";

export function handleTransfer(event: TransferEvent): void {
  const newCustody = event.params.to.toHex();
  const oldCustody = event.params.from.toHex();

  let fname = loadOrCreateFname(event);

  updateFnameExpiryAsync(fname, event);
  updateFnameCustody(fname, newCustody);
  fname.save();

  deleteUserFnameId(oldCustody);
  updateUserFnameId(newCustody, fname);
}

export function handleRenew(event: RenewEvent): void {
  let fname = loadFname(event.params.tokenId);

  if (fname) {
    updateFnameExpiry(fname, event.params.expiry);
    fname.save();
  }
}

export function handleChangePool(event: ChangePool): void {
  let pool = loadOrCreatePool();
  pool.address = event.params.pool.toHex();
  pool.save()
}