import {
  BundleRegistryChangeTrustedCaller as BundleRegistryChangeTrustedCallerEvent,
  BundleRegistryOwnershipTransferred as BundleRegistryOwnershipTransferredEvent,
} from "../generated/BundleRegistry/BundleRegistry";

export function handleBundleRegistryChangeTrustedCaller(
  event: BundleRegistryChangeTrustedCallerEvent
): void {}

export function handleBundleRegistryOwnershipTransferred(
  event: BundleRegistryOwnershipTransferredEvent
): void {}
