import { FName } from "./../generated/schema";
import {
  Renew as RenewEvent,
  Transfer as TransferEvent,
  ReclaimCall,
  RegisterCall,
  TrustedRegisterCall,
} from "../generated/NameRegistry/NameRegistry";

export function handleTransfer(event: TransferEvent): void {
  // from Address
  // to Address
  // tokenId bigInt
  let fname = FName.load(event.params.tokenId.toString());

  if (fname) {
    fname.custodyAddr = event.params.to;
    fname.save();
  } else {
    fname = new FName(event.params.tokenId.toString());
    fname.custodyAddr = event.params.to;
    fname.createdAtBlock = event.block.number;
    fname.createdAtTimestamp = event.block.timestamp;
    fname.save();
  }
}

export function handleRegister(call: RegisterCall): void {
  // fname string
  // to Address
  // secret string
  // recovery Address
}

export function handleRenew(event: RenewEvent): void {
  // tokenId bigInt
  // expiry bigInt
}

export function handleReclaim(call: ReclaimCall): void {
  // tokenId bigInt
}

export function handleTrustedRegister(call: TrustedRegisterCall): void {
  // fname string
  // to Address
  // recovery Address
  // inviter bigInt
  // invitee bigInt
}
