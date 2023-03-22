import { FName } from "./../generated/schema";
import {
  Renew as RenewEvent,
  Transfer as TransferEvent,
  ReclaimCall,
  RegisterCall,
  TrustedRegisterCall,
} from "../generated/NameRegistry/NameRegistry";

export function handleTransfer(event: TransferEvent): void {
  let fname = FName.load(event.params.tokenId.toString());

  if (fname) {
    fname.custodyAddr = event.params.to;
    fname.save();
  } else {
    fname = new FName(event.params.tokenId.toString());
    fname.custodyAddr = event.params.to;
    fname.createdAtBlock = event.block.number;
    fname.createdAtTimestamp = event.block.timestamp;
    fname.fname = "";
    fname.save();
  }
}

export function handleRegister(call: RegisterCall): void {
  const fname = new FName("1");
  fname.custodyAddr = call.inputs.to;
  fname.createdAtBlock = call.block.number;
  fname.createdAtTimestamp = call.block.timestamp;
  fname.fname = "test1";
  fname.save();
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
