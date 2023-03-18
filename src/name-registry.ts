import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  Upgraded as UpgradedEvent,
} from "../generated/NameRegistry/NameRegistry";

export function handleAdminChanged(event: AdminChangedEvent): void {}

export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {}

export function handleUpgraded(event: UpgradedEvent): void {}
