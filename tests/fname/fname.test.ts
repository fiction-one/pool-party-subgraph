import {
  test,
  describe,
  assert,
  beforeAll,
  logStore,
} from "matchstick-as/assembly/index";

import { createTransferEvent } from "./utils";
import { handleTransfer } from "../../src/name-registry";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

let tokenId1 = "";
let tokenId2 = "";
let custodyAddr1 = "";
let custodyAddr2 = "";

describe("NameRegistry", () => {
  beforeAll(() => {
    tokenId1 =
      "21923710825338253839304839389520952719014825665598212984806875314222184529920";
    tokenId2 =
      "21923710825338253839304839389520952719014825665598212984806875314222184529921";

    custodyAddr1 = "0x39ff405821ece5c94e976f3d6ac676f125976303";
    custodyAddr2 = "0x39ff405821ece5c94e976f3d6ac676f125976304";
  });
  test("handleTransfer should work", () => {
    const from = ZERO_ADDRESS;

    let transferEvent = createTransferEvent(from, custodyAddr1, tokenId1);

    handleTransfer(transferEvent);

    assert.fieldEquals("FName", tokenId1, "custodyAddr", custodyAddr1);
    logStore();
  });
});
