import { test, describe, assert } from "matchstick-as/assembly/index";

import { createTransferEvent } from "./utils";
import { handleTransfer } from "../../src/name-registry";

describe("NameRegistry", () => {
  test("handleTransfer should work", () => {
    const from = "0x0000000000000000000000000000000000000000";
    const to = "0x39ff405821ece5c94e976f3d6ac676f125976403";
    const tokenId = "21923710825338253839304839389520962719014825665598212984806875314222184529920"

    let transferEvent = createTransferEvent(from, to, tokenId);

    handleTransfer(transferEvent);

    assert.fieldEquals("FName", tokenId, "custodyAddr", to);
  });
});
