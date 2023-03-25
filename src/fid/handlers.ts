import { Register, Transfer } from "../../generated/IdRegistry/IdRegistry";
import { incrementCount } from "../global/helpers";
import { updateUserFid, deleteUserFid } from "../user/helpers";
import { createFID, loadFID, updateFidCustody } from "./helpers";

export const FID_COUNT_ID = "fid_count";

export function handleRegister(event: Register): void {
  let fid = createFID(event);
  fid.save();

  incrementCount(FID_COUNT_ID);
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
