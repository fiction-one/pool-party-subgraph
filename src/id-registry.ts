import { FID } from "./../generated/schema";
import {
  CancelRecovery,
  ChangeHome,
  ChangeRecoveryAddress,
  ChangeTrustedCaller,
  DisableTrustedOnly,
  OwnershipTransferred,
  Register,
  RequestRecovery,
  Transfer,
} from "../generated/IdRegistry/IdRegistry";

export function handleRegister(event: Register): void {
  let fid = new FID(event.params.id.toString());
  fid.owner = event.params.to;
  fid.recoveryAddr = event.params.recovery;
  fid.createdAtBlock = event.block.number;
  fid.createdAtTimestamp = event.block.timestamp;
  fid.save();
}

export function handleCancelRecovery(event: CancelRecovery): void {}

export function handleChangeHome(event: ChangeHome): void {}

export function handleChangeRecoveryAddress(
  event: ChangeRecoveryAddress
): void {}

export function handleChangeTrustedCaller(event: ChangeTrustedCaller): void {}

export function handleDisableTrustedOnly(event: DisableTrustedOnly): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRequestRecovery(event: RequestRecovery): void {}

export function handleTransfer(event: Transfer): void {}
