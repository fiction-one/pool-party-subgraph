import {
  test,
  describe,
  assert,
  beforeAll,
  logStore,
  afterAll,
} from "matchstick-as/assembly/index";

import { createTransferEvent, createRegisterCall } from "./utils";
import { handleTransfer, handleRegister } from "../../src/name-registry";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

let tokenId1 = "";
let custodyAddr1 = "";
let fname1 = "";
let recoveryAddr = "";

describe("NameRegistry", () => {
  afterAll(() => {
    logStore();
  });
  describe("Transfer Event", () => {
    beforeAll(() => {
      tokenId1 =
        "21923710825338253839304839389520952719014825665598212984806875314222184529920";

      custodyAddr1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
    });
    test("should handle transfer event", () => {
      const from = ZERO_ADDRESS;

      let transferEvent = createTransferEvent(from, custodyAddr1, tokenId1);

      handleTransfer(transferEvent);

      assert.fieldEquals("FName", tokenId1, "custodyAddr", custodyAddr1);
    });
  });
  describe("Register Call", () => {
    beforeAll(() => {
      tokenId1 = "1";
      fname1 = "test1";
      custodyAddr1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
      recoveryAddr = "0x39ff405821ece5c94e976f3d6ac676f125976306";
    });
    test("should handle register call", () => {
      const registerCall = createRegisterCall(
        fname1,
        custodyAddr1,
        "secret",
        recoveryAddr
      );

      handleRegister(registerCall);

      assert.fieldEquals("FName", tokenId1, "fname", fname1);
    });
  });
});
