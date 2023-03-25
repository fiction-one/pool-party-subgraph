import {
  describe,
  test,
  assert,
  clearStore,
  afterEach,
  beforeEach,
} from "matchstick-as/assembly/index";

import { createRegisterEvent, createTransferEvent } from "./utils";
import {
  FID_COUNT_ID,
  handleRegister,
  handleTransfer,
} from "../../src/fid/handlers";
import {
  Register as RegisterEvent,
  Transfer as TransferEvent,
} from "../../generated/IdRegistry/IdRegistry";

const CUSTODY_ADDR_1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
const CUSTODY_ADDR_2 = "0x39ff405821ece5c94e976f3d6ac676f125976305";
const RECOVERY_ADDR_1 = "0x39ff405821ece5c94e976f3d6ac676f125976304";
const FID_1 = "1";
const TEST_URL = "test";
const NULL_FID = "null";

const createRegisterEventWithConstants = (
  custodyAddr: string = CUSTODY_ADDR_1,
  fid: string = FID_1,
  recoveryAddr: string = RECOVERY_ADDR_1,
  url: string = TEST_URL
): RegisterEvent => {
  return createRegisterEvent(custodyAddr, fid, recoveryAddr, url);
};

const createTransferEventWithConstants = (
  from: string = CUSTODY_ADDR_1,
  to: string = CUSTODY_ADDR_2,
  fid: string = FID_1
): TransferEvent => {
  return createTransferEvent(from, to, fid);
};

describe("Farcaster IDs", () => {
  describe("Register Event", () => {
    beforeEach(() => {
      const registerEvent = createRegisterEventWithConstants();
      handleRegister(registerEvent);
    });
    afterEach(() => {
      clearStore();
    });
    test("should register new fid", () => {
      assert.fieldEquals("FID", FID_1, "custodyAddr", CUSTODY_ADDR_1);
      assert.fieldEquals("FID", FID_1, "createdAtBlock", "1");
      assert.fieldEquals("FID", FID_1, "createdAtTs", "1");
    });
    test("should update user", () => {
      assert.fieldEquals("User", CUSTODY_ADDR_1, "id", CUSTODY_ADDR_1);
      assert.fieldEquals("User", CUSTODY_ADDR_1, "fid", FID_1);
    });
    test("should increment fid counter", () => {
      assert.fieldEquals("Count", FID_COUNT_ID, "count", "1");

      const registerEvent = createRegisterEventWithConstants(
        CUSTODY_ADDR_2,
        "2"
      );

      handleRegister(registerEvent);

      assert.fieldEquals("Count", FID_COUNT_ID, "count", "2");
    });
  });
  describe("Transfer Event", () => {
    beforeEach(() => {
      const registerEvent = createRegisterEventWithConstants();
      handleRegister(registerEvent);

      const transferEvent = createTransferEventWithConstants();
      handleTransfer(transferEvent);
    });
    afterEach(() => {
      clearStore();
    });
    test("should handle fid transfer", () => {
      assert.fieldEquals("FID", FID_1, "custodyAddr", CUSTODY_ADDR_2);
      assert.fieldEquals("FID", FID_1, "createdAtBlock", "1");
      assert.fieldEquals("FID", FID_1, "createdAtTs", "1");
    });
    test("should update user", () => {
      assert.fieldEquals("User", CUSTODY_ADDR_2, "id", CUSTODY_ADDR_2);
      assert.fieldEquals("User", CUSTODY_ADDR_2, "fid", FID_1);
      assert.fieldEquals("User", CUSTODY_ADDR_1, "id", CUSTODY_ADDR_1);
      assert.fieldEquals("User", CUSTODY_ADDR_1, "fid", NULL_FID);
    });
  });
});
