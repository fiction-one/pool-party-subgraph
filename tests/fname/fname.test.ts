import {
  test,
  describe,
  assert,
  beforeAll,
  clearStore,
  afterEach,
} from "matchstick-as/assembly/index";

import { createTransferEvent } from "./utils";
import { handleTransfer } from "../../src/name-registry";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

let custodyAddr1: string;
let custodyAddr2: string;
let emptyFName = "";
let nullFName = "null";

let fnameExample = "forgiven";
let tokenIdExample =
  "46332820166748109116313618006930084042246649282465195123424451738721335640064";
let fnameHexExample =
  "0x666f72676976656e000000000000000000000000000000000000000000000000";

describe("NameRegistry", () => {
  describe("Transfer Event", () => {
    beforeAll(() => {
      custodyAddr1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
      custodyAddr2 = "0x39ff405821ece5c94e976f3d6ac676f125976304";
    });
    afterEach(() => {
      clearStore();
    });
    test("if fname doesn't exist should create a new fname ", () => {
      const from = ZERO_ADDRESS;

      let transferEvent = createTransferEvent(
        from,
        custodyAddr1,
        tokenIdExample
      );

      handleTransfer(transferEvent);

      assert.fieldEquals("FName", tokenIdExample, "custodyAddr", custodyAddr1);
      assert.fieldEquals("FName", tokenIdExample, "fname", fnameExample);
      assert.fieldEquals("FName", tokenIdExample, "createdAtBlock", "1");
      assert.fieldEquals("FName", tokenIdExample, "createdAtTimestamp", "1");
    });
    test("if fname exists, it should update this fname", () => {
      let transferEvent1 = createTransferEvent(
        ZERO_ADDRESS,
        custodyAddr1,
        tokenIdExample
      );

      handleTransfer(transferEvent1);

      let transferEvent2 = createTransferEvent(
        custodyAddr1,
        custodyAddr2,
        tokenIdExample
      );

      handleTransfer(transferEvent2);

      assert.fieldEquals("FName", tokenIdExample, "custodyAddr", custodyAddr2);
      assert.fieldEquals("FName", tokenIdExample, "fname", fnameExample);
      assert.fieldEquals("FName", tokenIdExample, "createdAtBlock", "1");
      assert.fieldEquals("FName", tokenIdExample, "createdAtTimestamp", "1");
    });
    test("should update new owner's fname", () => {
      const from = ZERO_ADDRESS;

      let transferEvent = createTransferEvent(
        from,
        custodyAddr1,
        tokenIdExample
      );

      handleTransfer(transferEvent);

      assert.fieldEquals("User", custodyAddr1, "fname", tokenIdExample);
    });
    test("should update old owner's fname", () => {
      let transferEvent1 = createTransferEvent(
        ZERO_ADDRESS,
        custodyAddr1,
        tokenIdExample
      );

      handleTransfer(transferEvent1);

      let transferEvent2 = createTransferEvent(
        custodyAddr1,
        custodyAddr2,
        tokenIdExample
      );

      handleTransfer(transferEvent2);

      assert.fieldEquals("User", custodyAddr1, "fname", nullFName);
    });
  });
});
