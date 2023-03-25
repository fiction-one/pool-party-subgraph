import { BigInt } from "@graphprotocol/graph-ts";
import { Count } from "../../generated/schema";

export function incrementCount(countId: string): void {
  const counter = loadOrCreateCount(countId);
  const count = counter.count;

  counter.count = count ? count.plus(BigInt.fromI32(1)) : BigInt.fromI32(1);

  counter.save();
}

function loadOrCreateCount(countId: string): Count {
  let counter = Count.load(countId);

  if (!counter) {
    counter = new Count(countId);
  }

  return counter;
}
