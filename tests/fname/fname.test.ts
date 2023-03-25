import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  test,
  describe,
  assert,
  beforeAll,
  clearStore,
  afterEach,
  log,
} from "matchstick-as/assembly/index";

import { createTransferEvent } from "./utils";
import { handleTransfer } from "../../src/fname/name-registry";
import { mockGetTokenExpiryTs } from "./utils";
import { Transfer } from "../../generated/NameRegistry/NameRegistry";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const CUSTODY_ADDRESS_1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
const CUSTODY_ADDRESS_2 = "0x39ff405821ece5c94e976f3d6ac676f125976304";
const NAME_REGISTRY_ADDR = "0x39ff405821ece5c94e976f3d6ac676f125976303";

const NULL_FNAME = "null";
let FNAME = "forgiven";
let FNAME_ID =
  "46332820166748109116313618006930084042246649282465195123424451738721335640064";
const REGISTRATION_PERIOD = "31536000";

const createTransferEventWithContstants = (
  from: string = ZERO_ADDRESS,
  to: string = CUSTODY_ADDRESS_1,
  tokenId: string = FNAME_ID,
  nameRegistry: Address = Address.fromString(NAME_REGISTRY_ADDR)
): Transfer => {
  return createTransferEvent(from, to, tokenId, nameRegistry);
};

describe("NameRegistry", () => {
  describe("Transfer Event", () => {
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
      let transferEvent = createTransferEventWithContstants();

      handleTransfer(transferEvent);

      assert.fieldEquals("FName", FNAME_ID, "custodyAddr", CUSTODY_ADDRESS_1);
      assert.fieldEquals("FName", FNAME_ID, "fname", FNAME);
      assert.fieldEquals("FName", FNAME_ID, "createdAtBlock", "1");
      assert.fieldEquals("FName", FNAME_ID, "createdAtTs", "1");
    });
    test("if fname exists, it should update this fname", () => {
      let transferEvent1 = createTransferEventWithContstants();

      handleTransfer(transferEvent1);

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
      let transferEvent = createTransferEventWithContstants();

      handleTransfer(transferEvent);

      assert.fieldEquals("User", CUSTODY_ADDRESS_1, "fname", FNAME_ID);
    });
    test("should update old owner's fname", () => {
      let transferEvent1 = createTransferEventWithContstants();

      handleTransfer(transferEvent1);

      let transferEvent2 = createTransferEventWithContstants(
        CUSTODY_ADDRESS_1,
        CUSTODY_ADDRESS_2
      );

      handleTransfer(transferEvent2);

      assert.fieldEquals("User", CUSTODY_ADDRESS_1, "fname", NULL_FNAME);
    });
    test("should set expiration timestamp", () => {
      let transferEvent = createTransferEventWithContstants();

      handleTransfer(transferEvent);

      const expectedExpiration = transferEvent.block.timestamp
        .plus(BigInt.fromString(REGISTRATION_PERIOD))
        .toString();

      log.info("Expected expiry timestamp {}", [expectedExpiration]);

      assert.fieldEquals("FName", FNAME_ID, "expiryTs", expectedExpiration);
    });
  });
});
