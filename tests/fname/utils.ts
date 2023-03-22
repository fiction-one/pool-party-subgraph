import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import { newMockEvent, newMockCall } from "matchstick-as/assembly/index";

import {
  Transfer as TransferEvent,
  RegisterCall,
} from "../../generated/NameRegistry/NameRegistry";

export const createTransferEvent = (
  from: string,
  to: string,
  tokenId: string
): TransferEvent => {
  let mockEvent = newMockEvent();
  let transferEvent = new TransferEvent(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  transferEvent.parameters = new Array<ethereum.EventParam>(3);

  let fromParam = new ethereum.EventParam(
    "from",
    ethereum.Value.fromAddress(Address.fromString(from))
  );
  let toParam = new ethereum.EventParam(
    "to",
    ethereum.Value.fromAddress(Address.fromString(to))
  );
  let tokenIdParam = new ethereum.EventParam(
    "tokenId",
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))
  );

  transferEvent.parameters[0] = fromParam;
  transferEvent.parameters[1] = toParam;
  transferEvent.parameters[2] = tokenIdParam;

  return transferEvent;
};

export const createRegisterCall = (
  fname: string,
  to: string,
  secret: string,
  recovery: string
): RegisterCall => {
  let mockCall = newMockCall();
  let registerCall = new RegisterCall(
    mockCall.to,
    mockCall.from,
    mockCall.block,
    mockCall.transaction,
    mockCall.inputValues,
    mockCall.outputValues
  );

  registerCall.inputValues = new Array<ethereum.EventParam>(4);

  let fnameParam = new ethereum.EventParam(
    "fname",
    ethereum.Value.fromString(fname)
  );

  let toParam = new ethereum.EventParam(
    "to",
    ethereum.Value.fromAddress(Address.fromString(to))
  );

  let secretParam = new ethereum.EventParam(
    "secret",
    ethereum.Value.fromString(secret)
  );

  let recoveryParam = new ethereum.EventParam(
    "recovery",
    ethereum.Value.fromAddress(Address.fromString(recovery))
  );

  registerCall.inputValues[0] = fnameParam;
  registerCall.inputValues[1] = toParam;
  registerCall.inputValues[2] = secretParam;
  registerCall.inputValues[3] = recoveryParam;

  return registerCall;
};
