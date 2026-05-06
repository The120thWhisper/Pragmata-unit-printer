import {
	BASE_SHELTER_CAPS,
	COLLECTION_META,
	MAX_SHELTER_LEVEL,
	TYPE_COLORS,
	publicAsset,
} from "./constants";

export function getTypeColors(type) {
	return TYPE_COLORS[type] ?? TYPE_COLORS.Default;
}

export function getItemKey(item) {
	return item.id ?? item.name;
}

export function formatNumber(value) {
	return Number(value).toLocaleString();
}

function costValue(value) {
	const number = Number(value);
	return Number.isFinite(number) ? number : 0;
}

function getItemMaxLevel(item) {
	if (!item.levels?.length) return 0;
	return Math.max(...item.levels.map((entry) => entry.level));
}

function createShelterLevels(unlockShelterLevel = 0, maxLevel = 8) {
	return Array.from({ length: MAX_SHELTER_LEVEL + 1 }, (_, shelterLevel) => {
		if (shelterLevel < unlockShelterLevel) return 0;
		const cap = BASE_SHELTER_CAPS[shelterLevel] ?? maxLevel;
		return Math.min(maxLevel, cap);
	});
}

function withShelterLevels(item) {
	return {
		...item,
		shelterLevels:
			item.shelterLevels ??
			createShelterLevels(item.unlockShelterLevel ?? 0, getItemMaxLevel(item)),
	};
}

function preferWebP(path) {
	return path.replace(/\.png$/i, ".webp");
}

export function mapUpgradeItems(data, collectionKey) {
	const meta = COLLECTION_META[collectionKey];
	return data.items.map((item) => {
		const sourcePath = item.imagePath ?? `${meta.imageFolder}/${item.fullName ?? item.name}.png`;
		return withShelterLevels({
			...item,
			imageUrl: publicAsset(preferWebP(sourcePath)),
		});
	});
}

export function getShelterMaxLevel(item, shelterLevel = MAX_SHELTER_LEVEL) {
	return item.shelterLevels?.[shelterLevel] ?? getItemMaxLevel(item);
}

export function getRemainingForWeapon(weapon, currentLevel, shelterLevel = MAX_SHELTER_LEVEL) {
	const shelterMaxLevel = getShelterMaxLevel(weapon, shelterLevel);
	return weapon.levels
		.filter((entry) => entry.level > currentLevel && entry.level <= shelterMaxLevel)
		.reduce(
			(sum, entry) => ({
				lim: sum.lim + costValue(entry.lim),
				lunum: sum.lunum + costValue(entry.lunum),
			}),
			{ lim: 0, lunum: 0 },
		);
}

export function getTotalCost(weapon, shelterLevel = MAX_SHELTER_LEVEL) {
	const shelterMaxLevel = getShelterMaxLevel(weapon, shelterLevel);
	return weapon.levels
		.filter((entry) => entry.level <= shelterMaxLevel)
		.reduce(
			(sum, entry) => ({
				lim: sum.lim + costValue(entry.lim),
				lunum: sum.lunum + costValue(entry.lunum),
			}),
			{ lim: 0, lunum: 0 },
		);
}

export function getRemainingForWeapons(weaponList, levelMap, shelterLevel = MAX_SHELTER_LEVEL) {
	return weaponList.reduce(
		(sum, weapon) => {
			const remaining = getRemainingForWeapon(
				weapon,
				levelMap[getItemKey(weapon)] ?? 0,
				shelterLevel,
			);
			return { lim: sum.lim + remaining.lim, lunum: sum.lunum + remaining.lunum };
		},
		{ lim: 0, lunum: 0 },
	);
}

// Single-pass version of typeTotals: groups items by type and reduces each
// item's remaining cost in one walk, instead of filter+reduce per type.
export function getGroupedTypeTotals(items, levelMap, shelterLevel = MAX_SHELTER_LEVEL) {
	const grouped = new Map();
	for (const item of items) {
		const type = item.type ?? "Default";
		const remaining = getRemainingForWeapon(item, levelMap[getItemKey(item)] ?? 0, shelterLevel);
		const existing = grouped.get(type) ?? { lim: 0, lunum: 0 };
		grouped.set(type, {
			lim: existing.lim + remaining.lim,
			lunum: existing.lunum + remaining.lunum,
		});
	}
	return grouped;
}

export function hasUnknownCosts(item, shelterLevel = MAX_SHELTER_LEVEL) {
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	return item.levels.some(
		(entry) => entry.level <= shelterMaxLevel && (entry.lim === null || entry.lunum === null),
	);
}
