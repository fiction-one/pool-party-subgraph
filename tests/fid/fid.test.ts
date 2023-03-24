import {
  describe,
  test,
  assert,
  clearStore,
  afterEach,
  beforeAll,
} from "matchstick-as/assembly/index";

import { createRegisterEvent, createTransferEvent } from "./utils";
import { handleRegister, handleTransfer } from "../../src/id-registry";
import { Register as RegisterEvent } from "../../generated/IdRegistry/IdRegistry";

const custodyAddr1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
const custodyAddr2 = "0x39ff405821ece5c94e976f3d6ac676f125976305";
const recoveryAddr = "0x39ff405821ece5c94e976f3d6ac676f125976304";
const fid1 = "1";
const testUrl = "test";

let registerEventGlobal: RegisterEvent;

describe("Farcaster IDs", () => {
  describe("Register Event", () => {
    afterEach(() => {
      clearStore();
    });
    test("should register new fid", () => {
      const registerEvent = createRegisterEvent(
        custodyAddr1,
        fid1,
        recoveryAddr,
        testUrl
      );
      handleRegister(registerEvent);

      assert.fieldEquals("FID", fid1, "custodyAddr", custodyAddr1);
      assert.fieldEquals("FID", fid1, "createdAtBlock", "1");
      assert.fieldEquals("FID", fid1, "createdAtTs", "1");
    });
    test("should update user", () => {
      const registerEvent = createRegisterEvent(
        custodyAddr1,
        fid1,
        recoveryAddr,
        testUrl
      );
      handleRegister(registerEvent);

      assert.fieldEquals("User", custodyAddr1, "id", custodyAddr1);
      assert.fieldEquals("User", custodyAddr1, "fid", fid1);
    });
  });
  describe("Transfer Event", () => {
    beforeAll(() => {
      registerEventGlobal = createRegisterEvent(
        custodyAddr1,
        fid1,
        recoveryAddr,
        testUrl
      );
    });
    afterEach(() => {
      clearStore();
    });
    test("should handle fid transfer", () => {
      handleRegister(registerEventGlobal);
      const transferEvent = createTransferEvent(
        custodyAddr1,
        custodyAddr2,
        fid1
      );
      handleTransfer(transferEvent);

      assert.fieldEquals("FID", fid1, "custodyAddr", custodyAddr2);
      assert.fieldEquals("FID", fid1, "createdAtBlock", "1");
      assert.fieldEquals("FID", fid1, "createdAtTs", "1");
    });
    test("should update user", () => {
      handleRegister(registerEventGlobal);
      const transferEvent = createTransferEvent(
        custodyAddr1,
        custodyAddr2,
        fid1
      );
      handleTransfer(transferEvent);

      assert.fieldEquals("User", custodyAddr2, "id", custodyAddr2);
      assert.fieldEquals("User", custodyAddr2, "fid", fid1);
      assert.fieldEquals("User", custodyAddr1, "id", custodyAddr1);
      assert.fieldEquals("User", custodyAddr1, "fid", "null");
    });
  });
});
