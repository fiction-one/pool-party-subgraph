import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  test,
  describe,
  assert,
  beforeAll,
  clearStore,
  afterEach,
  log,
  beforeEach,
} from "matchstick-as/assembly/index";

import { createRenewEvent, createTransferEvent } from "./utils";
import { handleRenew, handleTransfer } from "../../src/fname/handlers";
import { mockGetTokenExpiryTs } from "./utils";
import { Transfer as TransferEvent } from "../../generated/NameRegistry/NameRegistry";
import { FNAME_COUNTER_ID } from "../../src/fname/helpers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const CUSTODY_ADDRESS_1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
const CUSTODY_ADDRESS_2 = "0x39ff405821ece5c94e976f3d6ac676f125976304";
const NAME_REGISTRY_ADDR = "0x39ff405821ece5c94e976f3d6ac676f125976303";

const NULL_FNAME = "null";
let FNAME = "forgiven";
let FNAME_ID =
  "46332820166748109116313618006930084042246649282465195123424451738721335640064";
let FNAME_ID_2 =
  "46332820166748109116313618006930084042246649282465195123424451738721335640065";
const REGISTRATION_PERIOD = "31536000";

let transferEvent: TransferEvent;

const createTransferEventWithContstants = (
  from: string = ZERO_ADDRESS,
  to: string = CUSTODY_ADDRESS_1,
  tokenId: string = FNAME_ID,
  nameRegistry: Address = Address.fromString(NAME_REGISTRY_ADDR)
): TransferEvent => {
  return createTransferEvent(from, to, tokenId, nameRegistry);
};

describe("NameRegistry", () => {
  describe("Transfer Event", () => {
    beforeEach(() => {
      transferEvent = createTransferEventWithContstants();
      handleTransfer(transferEvent);
    });
    beforeAll(() => {
      mockGetTokenExpiryTs(
        FNAME_ID,
        Address.fromString(NAME_REGISTRY_ADDR),
        REGISTRATION_PERIOD
      );
    });
    afterEach(() => {
      clearStore();
    });
    test("if fname doesn't exist should create a new fname ", () => {
      assert.fieldEquals("FName", FNAME_ID, "custodyAddr", CUSTODY_ADDRESS_1);
      assert.fieldEquals("FName", FNAME_ID, "fname", FNAME);
      assert.fieldEquals("FName", FNAME_ID, "createdAtBlock", "1");
      assert.fieldEquals("FName", FNAME_ID, "createdAtTs", "1");
    });
    test("if fname exists, it should update this fname", () => {
      let transferEvent2 = createTransferEventWithContstants(
        CUSTODY_ADDRESS_1,
        CUSTODY_ADDRESS_2
      );

      handleTransfer(transferEvent2);

      assert.fieldEquals("FName", FNAME_ID, "custodyAddr", CUSTODY_ADDRESS_2);
      assert.fieldEquals("FName", FNAME_ID, "fname", FNAME);
      assert.fieldEquals("FName", FNAME_ID, "createdAtBlock", "1");
      assert.fieldEquals("FName", FNAME_ID, "createdAtTs", "1");
    });
    test("should update new owner's fname", () => {
      assert.fieldEquals("User", CUSTODY_ADDRESS_1, "fname", FNAME_ID);
    });
    test("should update old owner's fname", () => {
      let transferEvent2 = createTransferEventWithContstants(
        CUSTODY_ADDRESS_1,
        CUSTODY_ADDRESS_2
      );

      handleTransfer(transferEvent2);

      assert.fieldEquals("User", CUSTODY_ADDRESS_1, "fname", NULL_FNAME);
    });
    test("should set expiration timestamp", () => {
      const expectedExpiration = transferEvent.block.timestamp
        .plus(BigInt.fromString(REGISTRATION_PERIOD))
        .toString();

      log.info("Expected expiry timestamp {}", [expectedExpiration]);

      assert.fieldEquals("FName", FNAME_ID, "expiryTs", expectedExpiration);
    });
    test("new fname should increment totalFNames", () => {
      assert.fieldEquals("Count", FNAME_COUNTER_ID, "count", "1");

      let transferEvent2 = createTransferEventWithContstants(
        CUSTODY_ADDRESS_1,
        CUSTODY_ADDRESS_2
      );

      handleTransfer(transferEvent2);

      assert.fieldEquals("Count", FNAME_COUNTER_ID, "count", "1");

      let transferEvent3 = createTransferEventWithContstants(
        CUSTODY_ADDRESS_2,
        CUSTODY_ADDRESS_1,
        FNAME_ID_2
      );

      mockGetTokenExpiryTs(
        FNAME_ID_2,
        Address.fromString(NAME_REGISTRY_ADDR),
        REGISTRATION_PERIOD
      );

      handleTransfer(transferEvent3);

      assert.fieldEquals("Count", FNAME_COUNTER_ID, "count", "2");
    });
  });
  describe("Renew Event", () => {
    afterEach(() => {
      clearStore();
    });
    test("should update expiration timestamp", () => {
      let transferEvent = createTransferEventWithContstants();
      handleTransfer(transferEvent);

      transferEvent.block.timestamp = BigInt.fromString("1610000000");

      const newExpiryTs = transferEvent.block.timestamp.plus(
        BigInt.fromString(REGISTRATION_PERIOD)
      );

      let renewEvent = createRenewEvent(
        FNAME_ID,
        newExpiryTs.toString(),
        Address.fromString(NAME_REGISTRY_ADDR)
      );

      handleRenew(renewEvent);

      assert.fieldEquals("FName", FNAME_ID, "expiryTs", newExpiryTs.toString());
    });
  });
});
