import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import {
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";

import {
  Transfer as TransferEvent,
  Renew as RenewEvent,
  ChangePool as ChangePoolEvent,
} from "../../generated/NameRegistry/NameRegistry";

export const createTransferEvent = (
  from: string,
  to: string,
  tokenId: string,
  contractAddr: Address
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

  transferEvent.address = contractAddr;

  return transferEvent;
};

export const createRenewEvent = (
  tokenId: string,
  expiry: string,
  contractAddr: Address
): RenewEvent => {
  let mockEvent = newMockEvent();
  let renewEvent = new RenewEvent(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  renewEvent.parameters = new Array<ethereum.EventParam>(2);

  let tokenIdParam = new ethereum.EventParam(
    "tokenId",
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))
  );
  let expiryParam = new ethereum.EventParam(
    "expiry",
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(expiry))
  );

  renewEvent.parameters[0] = tokenIdParam;
  renewEvent.parameters[1] = expiryParam;

  renewEvent.address = contractAddr;

  return renewEvent;
};

export const createChangePoolEvent = (pool: string): ChangePoolEvent => {
  let mockEvent = newMockEvent();
  let changePoolEvent = new ChangePoolEvent(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  changePoolEvent.parameters = new Array<ethereum.EventParam>(1);

  let poolParam = new ethereum.EventParam(
    "pool",
    ethereum.Value.fromAddress(Address.fromString(pool))
  );

  changePoolEvent.parameters[0] = poolParam;

  return changePoolEvent;
};

export const mockGetTokenExpiryTs = (
  tokenId: string,
  contractAddr: Address,
  REGISTRATION_PERIOD: string
): void => {
  let mockEvent = newMockEvent();
  let tokenIdParam = ethereum.Value.fromUnsignedBigInt(
    BigInt.fromString(tokenId)
  );

  let expectedExpiryTs = BigInt.fromString(REGISTRATION_PERIOD).plus(
    mockEvent.block.timestamp
  );

  createMockedFunction(contractAddr, "expiryOf", "expiryOf(uint256):(uint256)")
    .withArgs([tokenIdParam])
    .returns([ethereum.Value.fromUnsignedBigInt(expectedExpiryTs)]);
};
