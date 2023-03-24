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
import { handleTransfer } from "../../src/name-registry";
import { mockGetTokenExpirationTimestamp } from "./utils";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

let custodyAddr1: string;
let custodyAddr2: string;
let emptyFName = "";
let nullFName = "null";

let FNAME = "forgiven";
let FNAME_ID =
  "46332820166748109116313618006930084042246649282465195123424451738721335640064";
const REGISTRATION_PERIOD = "31536000";
const NAME_REGISTRY_ADDR = Address.fromString(
  "0x39ff405821ece5c94e976f3d6ac676f125976303"
);

describe("NameRegistry", () => {
  describe("Transfer Event", () => {
    beforeAll(() => {
      custodyAddr1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
      custodyAddr2 = "0x39ff405821ece5c94e976f3d6ac676f125976304";
      mockGetTokenExpirationTimestamp(
        FNAME_ID,
        NAME_REGISTRY_ADDR,
        REGISTRATION_PERIOD
      );
    });
    afterEach(() => {
      clearStore();
    });
    test("if fname doesn't exist should create a new fname ", () => {
      const from = ZERO_ADDRESS;

      let transferEvent = createTransferEvent(
        from,
        custodyAddr1,
        FNAME_ID,
        NAME_REGISTRY_ADDR
      );

      handleTransfer(transferEvent);

      assert.fieldEquals("FName", FNAME_ID, "custodyAddr", custodyAddr1);
      assert.fieldEquals("FName", FNAME_ID, "fname", FNAME);
      assert.fieldEquals("FName", FNAME_ID, "createdAtBlock", "1");
      assert.fieldEquals("FName", FNAME_ID, "createdAtTs", "1");
    });
    test("if fname exists, it should update this fname", () => {
      let transferEvent1 = createTransferEvent(
        ZERO_ADDRESS,
        custodyAddr1,
        FNAME_ID,
        NAME_REGISTRY_ADDR
      );

      handleTransfer(transferEvent1);

      let transferEvent2 = createTransferEvent(
        custodyAddr1,
        custodyAddr2,
        FNAME_ID,
        NAME_REGISTRY_ADDR
      );

      handleTransfer(transferEvent2);

      assert.fieldEquals("FName", FNAME_ID, "custodyAddr", custodyAddr2);
      assert.fieldEquals("FName", FNAME_ID, "fname", FNAME);
      assert.fieldEquals("FName", FNAME_ID, "createdAtBlock", "1");
      assert.fieldEquals("FName", FNAME_ID, "createdAtTs", "1");
    });
    test("should update new owner's fname", () => {
      const from = ZERO_ADDRESS;

      let transferEvent = createTransferEvent(
        from,
        custodyAddr1,
        FNAME_ID,
        NAME_REGISTRY_ADDR
      );

      handleTransfer(transferEvent);

      assert.fieldEquals("User", custodyAddr1, "fname", FNAME_ID);
    });
    test("should update old owner's fname", () => {
      let transferEvent1 = createTransferEvent(
        ZERO_ADDRESS,
        custodyAddr1,
        FNAME_ID,
        NAME_REGISTRY_ADDR
      );

      handleTransfer(transferEvent1);

      let transferEvent2 = createTransferEvent(
        custodyAddr1,
        custodyAddr2,
        FNAME_ID,
        NAME_REGISTRY_ADDR
      );

      handleTransfer(transferEvent2);

      assert.fieldEquals("User", custodyAddr1, "fname", nullFName);
    });
    test("should set expiration timestamp", () => {
      const from = ZERO_ADDRESS;

      let transferEvent = createTransferEvent(
        from,
        custodyAddr1,
        FNAME_ID,
        NAME_REGISTRY_ADDR
      );

      handleTransfer(transferEvent);

      const expectedExpiration = transferEvent.block.timestamp
        .plus(BigInt.fromString(REGISTRATION_PERIOD))
        .toString();

      log.info(expectedExpiration, []);

      assert.fieldEquals(
        "FName",
        FNAME_ID,
        "expirationTimestamp",
        expectedExpiration
      );
    });
  });
});
