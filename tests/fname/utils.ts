import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as/assembly/index";

import { Transfer as TransferEvent } from "../../generated/NameRegistry/NameRegistry";

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
