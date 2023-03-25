import { Register, Transfer } from "../../generated/IdRegistry/IdRegistry";
import { updateUserFid, deleteUserFid } from "../user/utils";
import { createFID, loadFID, updateFidCustody } from "./utils";

export function handleRegister(event: Register): void {
  let fid = createFID(event);
  fid.save();

  updateUserFid(event.params.to.toHex(), fid);
}

export function handleTransfer(event: Transfer): void {
  let fid = loadFID(event.params.id);

  if (fid) {
    updateFidCustody(fid, event.params.to);
    deleteUserFid(event.params.from.toHex());
    updateUserFid(event.params.to.toHex(), fid);
  }
}
