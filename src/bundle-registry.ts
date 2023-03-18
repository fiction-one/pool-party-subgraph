import {
  BundleRegistryChangeTrustedCaller as BundleRegistryChangeTrustedCallerEvent,
  BundleRegistryOwnershipTransferred as BundleRegistryOwnershipTransferredEvent
} from "../generated/BundleRegistry/BundleRegistry"
import {
  BundleRegistryChangeTrustedCaller,
  BundleRegistryOwnershipTransferred
} from "../generated/schema"

export function handleBundleRegistryChangeTrustedCaller(
  event: BundleRegistryChangeTrustedCallerEvent
): void {
  let entity = new BundleRegistryChangeTrustedCaller(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.trustedCaller = event.params.trustedCaller
  entity.owner = event.params.owner
  entity.save()
}

export function handleBundleRegistryOwnershipTransferred(
  event: BundleRegistryOwnershipTransferredEvent
): void {
  let entity = new BundleRegistryOwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
