import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";

import {
  Register as RegisterEvent,
  Transfer as TransferEvent,
} from "./../../generated/IdRegistry/IdRegistry";

export const createRegisterEvent = (
  to: string,
  id: string,
  recovery: string,
  url: string
): RegisterEvent => {
  let mockEvent = newMockEvent();
  let registerEvent = new RegisterEvent(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  registerEvent.parameters = new Array<ethereum.EventParam>(4);

  let toParam = new ethereum.EventParam(
    "to",
    ethereum.Value.fromAddress(Address.fromString(to))
  );
  let idParam = new ethereum.EventParam(
    "id",
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(id))
  );
  let recoveryParam = new ethereum.EventParam(
    "recovery",
    ethereum.Value.fromAddress(Address.fromString(recovery))
  );
  let urlParam = new ethereum.EventParam("url", ethereum.Value.fromString(url));

  registerEvent.parameters[0] = toParam;
  registerEvent.parameters[1] = idParam;
  registerEvent.parameters[2] = recoveryParam;
  registerEvent.parameters[3] = urlParam;

  return registerEvent;
};

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
    "id",
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))
  );

  transferEvent.parameters[0] = fromParam;
  transferEvent.parameters[1] = toParam;
  transferEvent.parameters[2] = tokenIdParam;

  return transferEvent;
};
