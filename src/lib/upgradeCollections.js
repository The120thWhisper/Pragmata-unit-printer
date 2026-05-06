import abilityUpgradeData from "../data/abilityUpgrades.json";
import attachmentUpgradeData from "../data/attachmentUpgrades.json";
import hackingUpgradeData from "../data/hackingUpgrades.json";
import weaponUpgradeData from "../data/weaponUpgrades.json";
import { COLLECTION_META } from "./constants";
import { mapUpgradeItems } from "./calculations";

export const upgradeCollections = {
	weapon: { ...COLLECTION_META.weapon, items: mapUpgradeItems(weaponUpgradeData, "weapon") },
	hacking: { ...COLLECTION_META.hacking, items: mapUpgradeItems(hackingUpgradeData, "hacking") },
	ability: { ...COLLECTION_META.ability, items: mapUpgradeItems(abilityUpgradeData, "ability") },
	attachment: {
		...COLLECTION_META.attachment,
		items: mapUpgradeItems(attachmentUpgradeData, "attachment"),
	},
};

export const weapons = upgradeCollections.weapon.items;
export const allUpgradeItems = Object.values(upgradeCollections).flatMap(
	(collection) => collection.items,
);
