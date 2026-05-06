import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import abilityUpgradeData from "./data/abilityUpgrades.json";
import attachmentUpgradeData from "./data/attachmentUpgrades.json";
import hackingUpgradeData from "./data/hackingUpgrades.json";
import weaponUpgradeData from "./data/weaponUpgrades.json";

const TYPE_COLORS = {
	Attack: {
		bar: "bg-red-500",
		border: "border-red-400/50",
		glow: "shadow-red-950/30",
		text: "text-red-100",
		soft: "bg-red-500/10",
	},
	Tactical: {
		bar: "bg-emerald-400",
		border: "border-emerald-300/50",
		glow: "shadow-emerald-950/30",
		text: "text-emerald-100",
		soft: "bg-emerald-400/10",
	},
	Defensive: {
		bar: "bg-cyan-400",
		border: "border-cyan-300/50",
		glow: "shadow-cyan-950/30",
		text: "text-cyan-100",
		soft: "bg-cyan-400/10",
	},
	Node: {
		bar: "bg-yellow-300",
		border: "border-yellow-200/50",
		glow: "shadow-yellow-950/30",
		text: "text-yellow-100",
		soft: "bg-yellow-300/10",
	},
	Mode: {
		bar: "bg-blue-400",
		border: "border-blue-300/50",
		glow: "shadow-blue-950/30",
		text: "text-blue-100",
		soft: "bg-blue-400/10",
	},
	Ability: {
		bar: "bg-violet-300",
		border: "border-violet-200/50",
		glow: "shadow-violet-950/30",
		text: "text-violet-100",
		soft: "bg-violet-300/10",
	},
	Attachment: {
		bar: "bg-lime-300",
		border: "border-lime-200/50",
		glow: "shadow-lime-950/30",
		text: "text-lime-100",
		soft: "bg-lime-300/10",
	},
	Default: {
		bar: "bg-slate-300",
		border: "border-slate-400/50",
		glow: "shadow-slate-950/30",
		text: "text-slate-100",
		soft: "bg-slate-400/10",
	},
};

const COLLECTION_META = {
	weapon: {
		label: "Weapons",
		itemLabel: "weapon",
		imageFolder: "images/weapon",
		empty: "Add weapons in the local config panel to populate this tab.",
	},
	hacking: {
		label: "Hacking",
		itemLabel: "hack",
		imageFolder: "images/hacking",
		empty: "Add hacking nodes and modes in the local config panel to populate this tab.",
	},
	ability: {
		label: "Abilities",
		itemLabel: "ability",
		imageFolder: "images/ability",
		empty: "Add abilities in the local config panel to populate this tab.",
	},
	attachment: {
		label: "Attachments",
		itemLabel: "attachment",
		imageFolder: "images/attachment",
		empty: "Add attachments in the local config panel to populate this tab.",
	},
};

const ORANGE_COMPLETE = "bg-gradient-to-r from-yellow-300 to-orange-500";
const OWNED_BAR = "bg-slate-100";
const EMPTY_BAR = "bg-slate-400/40";
const NEXT_BAR = "bg-red-600";
const LOCKED_BAR = "bg-slate-950";
const MIN_SHELTER_LEVEL = 1;
const MAX_SHELTER_LEVEL = 5;
const BASE_SHELTER_CAPS = [1, 3, 5, 6, 7, 8];
const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

function getTypeColors(type) {
	return TYPE_COLORS[type] ?? TYPE_COLORS.Default;
}

function getItemMaxLevel(item) {
	if (!item.levels?.length) return 0;
	return Math.max(...item.levels.map((entry) => entry.level));
}

function createShelterLevels(unlockShelterLevel = 0, maxLevel = 8) {
	return Array.from(
		{ length: MAX_SHELTER_LEVEL + 1 },
		(_, shelterLevel) => {
			if (shelterLevel < unlockShelterLevel) return 0;
			const cap = BASE_SHELTER_CAPS[shelterLevel] ?? maxLevel;
			return Math.min(maxLevel, cap);
		}
	);
}

function withShelterLevels(item) {
	return {
		...item,
		shelterLevels: item.shelterLevels ?? createShelterLevels(item.unlockShelterLevel ?? 0, getItemMaxLevel(item)),
	};
}

function mapUpgradeItems(data, collectionKey) {
	const meta = COLLECTION_META[collectionKey];
	return data.items.map((item) => withShelterLevels({
		...item,
		imageUrl: publicAsset(item.imagePath ?? `${meta.imageFolder}/${item.fullName ?? item.name}.png`),
	}));
}

const upgradeCollections = {
	weapon: {
		...COLLECTION_META.weapon,
		items: mapUpgradeItems(weaponUpgradeData, "weapon"),
	},
	hacking: {
		...COLLECTION_META.hacking,
		items: mapUpgradeItems(hackingUpgradeData, "hacking"),
	},
	ability: {
		...COLLECTION_META.ability,
		items: mapUpgradeItems(abilityUpgradeData, "ability"),
	},
	attachment: {
		...COLLECTION_META.attachment,
		items: mapUpgradeItems(attachmentUpgradeData, "attachment"),
	},
};
const weapons = upgradeCollections.weapon.items;
const allUpgradeItems = Object.values(upgradeCollections).flatMap((collection) => collection.items);

function formatNumber(value) {
	return Number(value).toLocaleString();
}

function costValue(value) {
	const number = Number(value);
	return Number.isFinite(number) ? number : 0;
}

function getItemKey(item) {
	return item.id ?? item.name;
}

function getMaxLevel(weapon) {
	return getItemMaxLevel(weapon);
}

function getShelterMaxLevel(item, shelterLevel = MAX_SHELTER_LEVEL) {
	return item.shelterLevels?.[shelterLevel] ?? getMaxLevel(item);
}

function getRemainingForWeapon(weapon, currentLevel, shelterLevel = MAX_SHELTER_LEVEL) {
	const shelterMaxLevel = getShelterMaxLevel(weapon, shelterLevel);
	return weapon.levels
	.filter((entry) => entry.level > currentLevel && entry.level <= shelterMaxLevel)
	.reduce(
		(sum, entry) => ({ lim: sum.lim + costValue(entry.lim), lunum: sum.lunum + costValue(entry.lunum) }),
		{ lim: 0, lunum: 0 }
	);
}

function getTotalCost(weapon, shelterLevel = MAX_SHELTER_LEVEL) {
	const shelterMaxLevel = getShelterMaxLevel(weapon, shelterLevel);
	return weapon.levels.filter((entry) => entry.level <= shelterMaxLevel).reduce(
		(sum, entry) => (
			{ lim: sum.lim + costValue(entry.lim), lunum: sum.lunum + costValue(entry.lunum) }
		),
		{ lim: 0, lunum: 0 }
	);
}

function getRemainingForWeapons(weaponList, levelMap, shelterLevel = MAX_SHELTER_LEVEL) {
	return weaponList.reduce(
		(sum, weapon) => {
			const remaining = getRemainingForWeapon(weapon, levelMap[getItemKey(weapon)] ?? 0, shelterLevel);
			return { lim: sum.lim + remaining.lim, lunum: sum.lunum + remaining.lunum };
		},
		{ lim: 0, lunum: 0 }
	);
}

function hasUnknownCosts(item, shelterLevel = MAX_SHELTER_LEVEL) {
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	return item.levels.some((entry) => entry.level <= shelterMaxLevel && (entry.lim === null || entry.lunum === null));
}

function runCalculationSelfTests() {
	const byName = Object.fromEntries(weapons.map((weapon) => [weapon.name, weapon]));
	const tests = [
		{
			name: "Shockwave Gun total from level 0", 
			actual: getRemainingForWeapon(byName["Shockwave Gun"], 0), 
			expected: { lim: 13250, lunum: 6 }
		},
		{
			name: "Shockwave Gun remaining from level 4", 
			actual: getRemainingForWeapon(byName["Shockwave Gun"], 4), 
			expected: { lim: 10600, lunum: 5 }
		},
		{
			name: "Drone Hive board unlock uses 0-cost level 1", 
			actual: getRemainingForWeapon(byName["Drone Hive"], 0), 
			expected: { lim: 2400, lunum: 1 }
		},
		{
			name: "Jackhammer total from level 0", 
			actual: getRemainingForWeapon(byName["Jackhammer"], 0), 
			expected: { lim: 28900, lunum: 6 }
		},
		{
			name: "Maxed weapon costs nothing remaining", 
			actual: getRemainingForWeapon(byName["Lim Cannon"], 8), 
			expected: { lim: 0, lunum: 0 }
		},
		{
			name: "Attack main-game category excludes post-game", 
			actual: getRemainingForWeapons(weapons.filter((weapon) => weapon.type === "Attack" && weapon.phase === "main"), {}), 
			expected: { lim: 52750, lunum: 24 }
		},
		{
			name: "Defensive category total", 
			actual: getRemainingForWeapons(weapons.filter((weapon) => weapon.type === "Defensive" && weapon.phase === "main"), {}), 
			expected: { lim: 7800, lunum: 3 }
		},
		{
			name: "Shelter level 0 only counts Shockwave Gun level 1",
			actual: getRemainingForWeapon(byName["Shockwave Gun"], 0, 0),
			expected: { lim: 100, lunum: 0 }
		},
		{
			name: "Shelter level 0 hides Charge Piercer until license level 1",
			actual: getRemainingForWeapon(byName["Charge Piercer"], 0, 0),
			expected: { lim: 0, lunum: 0 }
		},
		{
			name: "Shelter level 5 unlocks post-game weapon cap",
			actual: getRemainingForWeapon(byName["Jackhammer"], 0, 5),
			expected: { lim: 28900, lunum: 6 }
		},
	];

	tests.forEach((test) => {
		const passed = test.actual.lim === test.expected.lim && test.actual.lunum === test.expected.lunum;
		if (!passed) console.error(`[PRAGMATA calculator self-test failed] ${test.name}`, test);
	});
}

runCalculationSelfTests();

function Icon({ name, className = "h-5 w-5" }) {
	if (name === "reset") {
		return (
			<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M3 12a9 9 0 1 0 3-6.7" />
				<path d="M3 4v6h6" />
			</svg>
		);
	}
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
		</svg>
	);
}

function ResourceIcon({ type }) {
	if (type === "lim") {
		return <img src={publicAsset("images/Lim.png")} alt="Lim" className="inline-block h-4 w-4 object-contain align-[-2px]" />;
	}
	return <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-lime-100 bg-gradient-to-br from-lime-200 via-yellow-200 to-emerald-300 text-[9px] font-black text-slate-900">✣</span>;
}

function StatPill({ label, lim, lunum, color = "cyan" }) {
	const colorClass = color === "amber" ? "border-amber-300/30 bg-amber-400/10 text-amber-50" : "border-cyan-300/30 bg-cyan-400/10 text-cyan-50";
	return (
		<div className={`rounded-xl border px-3 py-2 ${colorClass}`}>
			<div className="text-[10px] uppercase tracking-[0.2em] opacity-70">{label}</div>
			<div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-lg font-black tabular-nums">
				<span className="inline-flex items-center gap-1"><ResourceIcon type="lim" />{formatNumber(lim)}</span>
				<span className="inline-flex items-center gap-1"><ResourceIcon type="lunum" />{formatNumber(lunum)}</span>
			</div>
		</div>
	);
}

function CostInline({ lim, lunum }) {
	if (lim === null || lunum === null) {
		return <span className="text-slate-500">Cost unknown</span>;
	}

	return (
		<span className="inline-flex flex-wrap gap-x-2 gap-y-0.5">
			<span className="inline-flex items-center gap-1"><ResourceIcon type="lim" />{formatNumber(lim)}</span>
			<span className="inline-flex items-center gap-1"><ResourceIcon type="lunum" />{formatNumber(lunum)}</span>
		</span>
	);
}

function LevelDetails({ item, shelterLevel }) {
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	const visibleLevels = item.levels.filter((entry) => entry.level <= shelterMaxLevel);
	if (!visibleLevels.some((entry) => entry.effect || entry.note || entry.lim === null || entry.lunum === null)) return null;

	return (
		<div className="mt-2 max-h-24 space-y-1 overflow-auto border-t border-slate-800/80 pt-2 pr-1 text-[10px] leading-tight text-slate-400">
			{visibleLevels.map((entry) => (
				<div key={entry.level} className="grid grid-cols-[36px_minmax(0,1fr)] gap-2">
					<span className="font-black uppercase text-slate-500">Lv {entry.level}</span>
					<span>
						<CostInline lim={entry.lim} lunum={entry.lunum} />
						{entry.effect && <span className="ml-2 text-slate-300">{entry.effect}</span>}
						{entry.note && <span className="ml-2 text-slate-500">{entry.note}</span>}
					</span>
				</div>
			))}
		</div>
	);
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians)),
	};
}

function describeArc(centerX, centerY, radius, startAngle, endAngle) {
	const start = polarToCartesian(centerX, centerY, radius, endAngle);
	const end = polarToCartesian(centerX, centerY, radius, startAngle);
	const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
	return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function ShelterSelector({ shelterLevel, onChange }) {
	const currentShelterLevel = Math.max(MIN_SHELTER_LEVEL, Math.min(MAX_SHELTER_LEVEL, shelterLevel));
	const nextLevel = currentShelterLevel >= MAX_SHELTER_LEVEL ? MIN_SHELTER_LEVEL : currentShelterLevel + 1;
	const segments = Array.from({ length: MAX_SHELTER_LEVEL }, (_, index) => {
		const start = index * 72 + 4;
		const end = (index + 1) * 72 - 4;
		const filled = index < currentShelterLevel;
		return (
			<path
				key={index}
				d={describeArc(50, 50, 43, start, end)}
				fill="none"
				stroke={filled ? "#a7fff6" : "#17202b"}
				strokeWidth="7"
				strokeLinecap="round"
				className={filled ? "drop-shadow-[0_0_5px_rgba(167,255,246,0.85)]" : ""}
			/>
		);
	});

	return (
		<div className="flex items-center gap-3 rounded border border-cyan-200/20 bg-black/30 px-3 py-2">
			<button
				type="button"
				onClick={() => onChange(nextLevel)}
				className="group relative h-20 w-20 shrink-0 rounded-full bg-black shadow-[0_0_24px_rgba(34,211,238,0.2)] ring-1 ring-cyan-200/20 transition hover:ring-cyan-100/70 focus:outline-none focus:ring-2 focus:ring-cyan-100"
				aria-label={`Shelter License level ${currentShelterLevel}. Click to set level ${nextLevel}.`}
				title={`Shelter License Lv ${currentShelterLevel}`}
			>
				<svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
					<circle cx="50" cy="50" r="36" fill="#020807" stroke="#050b0d" strokeWidth="4" />
					{segments}
					<path d="M28 37 C31 25 45 25 48 38" fill="none" stroke="#c9fff4" strokeWidth="8" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(167,255,246,0.9)]" />
					<path d="M58 38 C61 26 75 26 78 39" fill="none" stroke="#c9fff4" strokeWidth="8" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(167,255,246,0.9)]" />
					<path d="M31 62 C41 73 61 76 75 62" fill="none" stroke="#c9fff4" strokeWidth="9" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(167,255,246,0.9)]" />
				</svg>
			</button>
			<div className="min-w-0">
				<div className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100">Shelter</div>
				<div className="mt-1 text-3xl font-black tabular-nums text-slate-50">Lv {currentShelterLevel}</div>
				<div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">cap {currentShelterLevel === MAX_SHELTER_LEVEL ? "max" : BASE_SHELTER_CAPS[currentShelterLevel]}</div>
			</div>
		</div>
	);
}

function LevelBars({ item, currentLevel, shelterLevel, onChange }) {
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	const isComplete = shelterMaxLevel > 0 && currentLevel >= shelterMaxLevel;

	return (
		<div className="flex items-center gap-1.5" aria-label={`Set ${item.name} level`}>
			{
				item.levels.map(
					(entry) => {
						const locked = entry.level > shelterMaxLevel;
						const filled = entry.level <= currentLevel;
						const isNext = !isComplete && entry.level === currentLevel + 1;
						const title = locked ? `${item.name} level ${entry.level} locked at Shelter Lv ${shelterLevel}` : `Set ${item.name} to level ${entry.level}`;
						const className = locked ? LOCKED_BAR : isComplete ? ORANGE_COMPLETE : filled ? OWNED_BAR : isNext ? NEXT_BAR : EMPTY_BAR;
						return (
							<button
								key={entry.level}
								type="button"
								title={title}
								aria-label={title}
								disabled={locked}
								onClick={() => onChange(getItemKey(item), entry.level)}
								className={`h-5 w-3.5 -skew-x-[22deg] border ${locked ? "border-slate-700 opacity-45" : "border-black/50 shadow-sm hover:scale-110 hover:border-white/70 focus:ring-2 focus:ring-cyan-200"} ${className} transition focus:outline-none disabled:cursor-not-allowed`}
							/>
						);
					}
				)
			}
		</div>
	);
}

function UpgradeCard({ item, currentLevel, shelterLevel, onChange }) {
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	const remaining = getRemainingForWeapon(item, currentLevel, shelterLevel);
	const shelterTotal = getTotalCost(item, shelterLevel);
	const total = getTotalCost(item);
	const locked = shelterMaxLevel === 0;
	const complete = !locked && currentLevel >= shelterMaxLevel;
	const unknownCosts = hasUnknownCosts(item, shelterLevel);
	const colors = getTypeColors(item.type);

	return (
		<motion.article
			layout
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			className={`group relative min-h-[245px] overflow-hidden rounded-sm border ${locked ? "border-slate-800 opacity-70" : colors.border} bg-slate-950/80 shadow-xl ${locked ? "shadow-black/30" : colors.glow}`}
		>
			<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
			<div className={`absolute left-0 top-0 h-1.5 w-24 ${locked ? "bg-slate-800" : colors.bar}`} />
			<div className={`absolute left-0 top-0 h-8 w-8 ${locked ? "bg-slate-800" : colors.bar} opacity-90 [clip-path:polygon(0_0,100%_0,0_100%)]`} />
			<div className="absolute right-2 top-2 rounded border border-slate-600/70 bg-black/50 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-slate-300">{locked ? "Locked" : `Lv ${currentLevel}/${shelterMaxLevel}`}</div>

			<div className="relative flex h-full flex-col p-3">
				<header className="min-h-[44px] pr-12">
					<h3 className="truncate text-lg font-black leading-tight tracking-wide text-slate-50 drop-shadow">{item.name}</h3>
					<p className={`mt-0.5 text-[10px] uppercase tracking-[0.2em] ${locked ? "text-slate-500" : colors.text}`}>{item.type}{item.phase === "post" ? " · Post-game" : ""}</p>
				</header>

				<div className="mt-2 flex justify-center">
					<LevelBars item={item} currentLevel={currentLevel} shelterLevel={shelterLevel} onChange={onChange} />
				</div>

				<button
					type="button"
					disabled={locked}
					onClick={() => onChange(getItemKey(item), currentLevel >= shelterMaxLevel ? 0 : Math.min(currentLevel + 1, shelterMaxLevel))}
					className="relative mt-3 flex h-24 items-center justify-center overflow-hidden rounded-sm border border-slate-700/80 bg-black/40 transition hover:border-cyan-200/60 disabled:cursor-not-allowed disabled:hover:border-slate-700/80"
					title={locked ? `${item.name} is locked at Shelter Lv ${shelterLevel}` : currentLevel >= shelterMaxLevel ? `Reset ${item.name} to level 0` : `Advance ${item.name} one level`}
				>
					<div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-cyan-400/10" />
					<img
						src={item.imageUrl}
						alt=""
						className={`relative z-10 max-h-[88px] max-w-[90%] object-contain drop-shadow-[0_0_14px_rgba(255,255,255,0.28)] transition duration-200 ${locked ? "grayscale opacity-25" : "group-hover:scale-105"}`}
						onError={
							(event) => {
								event.currentTarget.style.display = "none";
							}
						}
					/>
					<span className="absolute bottom-1 right-2 text-[9px] uppercase tracking-widest text-slate-600">{locked ? `Shelter Lv ${item.unlockShelterLevel ?? "?"}` : "click +1"}</span>
				</button>

				<div className="mt-auto pt-3">
					{locked ? (
						<div className="border-y border-slate-700/80 bg-black/40 py-1 text-center text-lg font-black uppercase tracking-wider text-slate-500">Locked</div>
					) : complete ?
						(
							<div className="border-y border-orange-400/30 bg-black/40 py-1 text-center text-lg font-black uppercase tracking-wider text-orange-300">Complete</div>
						) : (
							<div className="flex min-h-[32px] items-center justify-center gap-3 border-y border-slate-700/80 bg-black/40 py-1 text-xl font-black tabular-nums text-red-500">
								{remaining.lunum > 0 && <span className="inline-flex items-center gap-1 text-sky-100"><ResourceIcon type="lunum" />{formatNumber(remaining.lunum)}</span>}
								{remaining.lim > 0 && <span className="inline-flex items-center gap-1"><ResourceIcon type="lim" />{formatNumber(remaining.lim)}</span>}
							</div>
						)
					}
					{item.unlockNote && <p className="mt-2 line-clamp-2 text-[10px] leading-tight text-slate-400">{item.unlockNote}</p>}
					<LevelDetails item={item} shelterLevel={shelterLevel} />
					<p className="mt-1 text-[10px] text-slate-500">Shelter cap cost: {formatNumber(shelterTotal.lim)} Lim / {formatNumber(shelterTotal.lunum)} Lunum{unknownCosts ? " + unknown" : ""}</p>
					<p className="mt-1 text-[10px] text-slate-600">Full max cost: {formatNumber(total.lim)} Lim / {formatNumber(total.lunum)} Lunum</p>
				</div>
			</div>
		</motion.article>
	);
}

function EmptyCollection({ collection }) {
	return (
		<section className="rounded border border-slate-700/80 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
			<h2 className="text-2xl font-black uppercase tracking-widest text-slate-50">{collection.label}</h2>
			<p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">{collection.empty}</p>
			<p className="mt-3 text-xs uppercase tracking-[0.2em] text-cyan-100">Run npm run config</p>
		</section>
	);
}

function Section({ title, subtitle, itemList, levels, shelterLevel, setLevel, defaultOpen = true }) {
	const [open, setOpen] = useState(defaultOpen);
	const totals = useMemo(() => getRemainingForWeapons(itemList, levels, shelterLevel), [itemList, levels, shelterLevel]);

	return (
		<section className="rounded border border-slate-700/80 bg-slate-900/70 p-3 shadow-2xl shadow-black/30 backdrop-blur">
			<button className="flex w-full items-center justify-between gap-3 text-left" type="button" onClick={() => setOpen((value) => !value)}>
				<div>
					<h2 className="text-2xl font-black uppercase tracking-widest text-slate-50">{open ? "▾" : "▸"} {title}</h2>
					{subtitle && <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">{subtitle}</p>}
				</div>
				<StatPill label="Remaining" lim={totals.lim} lunum={totals.lunum} />
			</button>
			{ open &&
				(
					<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{itemList.length > 0 ? itemList.map((item) => <UpgradeCard key={getItemKey(item)} item={item} currentLevel={levels[getItemKey(item)] ?? 0} shelterLevel={shelterLevel} onChange={setLevel} />) : (
							<div className="rounded border border-slate-800 bg-black/30 p-6 text-sm text-slate-400 sm:col-span-2 lg:col-span-3 xl:col-span-4">
								No {title.toLowerCase()} entries are unlocked at Shelter Lv {shelterLevel}.
							</div>
						)}
					</div>
				)
			}
		</section>
	);
}

export default function PragmataUnitPrinterCalculator() {
	const defaultLevels = useMemo(() => Object.fromEntries(allUpgradeItems.map((item) => [getItemKey(item), 0])), []);
	const [levels, setLevels] = useState(defaultLevels);
	const [shelterLevel, setShelterLevel] = useState(MIN_SHELTER_LEVEL);
	const [activeCollectionKey, setActiveCollectionKey] = useState("weapon");
	const [activeType, setActiveType] = useState("All");

	const setLevel = (itemId, level) => setLevels((current) => ({ ...current, [itemId]: level }));

	const activeCollection = upgradeCollections[activeCollectionKey];
	const activeItems = activeCollection.items;
	const availableItems = useMemo(() => activeItems.filter((item) => getShelterMaxLevel(item, shelterLevel) > 0), [activeItems, shelterLevel]);
	const activeTypes = useMemo(() => Array.from(new Set(availableItems.map((item) => item.type).filter(Boolean))), [availableItems]);
	const selectedType = activeType === "All" || activeTypes.includes(activeType) ? activeType : "All";
	const visibleItems = useMemo(() => selectedType === "All" ? availableItems : availableItems.filter((item) => item.type === selectedType), [availableItems, selectedType]);
	const grandTotal = useMemo(() => getRemainingForWeapons(availableItems, levels, shelterLevel), [availableItems, levels, shelterLevel]);
	const visibleTotal = useMemo(() => getRemainingForWeapons(visibleItems, levels, shelterLevel), [visibleItems, levels, shelterLevel]);

	const typeTotals = useMemo(() => {
		return activeTypes.map(
			(type) => (
				{
					type,
					totals: getRemainingForWeapons(availableItems.filter((item) => item.type === type), levels, shelterLevel),
				}
			)
		);
		}, [activeTypes, availableItems, levels, shelterLevel]
	);

	const selectCollection = (collectionKey) => {
		setActiveCollectionKey(collectionKey);
		setActiveType("All");
	};
	const maxCurrent = () => setLevels((current) => ({ ...current, ...Object.fromEntries(visibleItems.map((item) => [getItemKey(item), getShelterMaxLevel(item, shelterLevel)])) }));
	const resetAll = () => setLevels(defaultLevels);

	return (
		<main className="min-h-screen overflow-hidden bg-[#071017] p-4 text-slate-50 sm:p-6 lg:p-8">
			<div className="pointer-events-none fixed inset-0 opacity-80">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(239,68,68,0.12),transparent_28%),radial-gradient(circle_at_60%_100%,rgba(16,185,129,0.14),transparent_35%)]" />
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
			</div>

			<div className="relative mx-auto max-w-7xl">
				<header className="mb-5 rounded border border-slate-700/80 bg-slate-950/70 p-4 shadow-2xl shadow-black/30 backdrop-blur">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
								{Object.entries(upgradeCollections).map(([collectionKey, collection]) => {
									const active = activeCollectionKey === collectionKey;
									return (
										<button
											key={collectionKey}
											type="button"
											onClick={() => selectCollection(collectionKey)}
											className={`rounded px-2 py-1 transition ${active ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/30" : "text-slate-500 hover:bg-slate-800/70 hover:text-slate-200"}`}
										>
											{collection.label}
										</button>
									);
								})}
							</div>
							<h1 className="text-3xl font-black uppercase tracking-[0.12em] text-slate-50 sm:text-5xl">Unit Printer</h1>
							<p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">Click the slanted level bars to set the current level. Empty means unbought, white goes up to the current level, red marks the next upgrade, black marks Shelter-locked upgrades, and orange means upgrades are complete for the selected Shelter License.</p>
							<p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">NOTE: Numbers sourced online, but not confirmed independently (yet). Values may be inaccurate. Use the local config panel to add and verify new Unit Printer tabs before pushing.</p>
						</div>
						<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:items-end">
							<ShelterSelector shelterLevel={shelterLevel} onChange={setShelterLevel} />
							<div className="flex flex-wrap gap-2">
								<button type="button" onClick={maxCurrent} className="rounded border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm font-bold uppercase tracking-wide text-cyan-50 hover:bg-cyan-400/20">
									<Icon className="mr-1 inline h-4 w-4" />
									Max current
								</button>
								<button type="button" onClick={resetAll} className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-bold uppercase tracking-wide text-slate-100 hover:bg-slate-800">
									<Icon name="reset" className="mr-1 inline h-4 w-4" />
									Reset
								</button>
							</div>
						</div>
					</div>
				</header>

				<section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
					<StatPill label={`${activeCollection.label} remaining`} lim={grandTotal.lim} lunum={grandTotal.lunum} />
					<StatPill label="Shown remaining" lim={visibleTotal.lim} lunum={visibleTotal.lunum} />
					{
						typeTotals.map(
							({ type, totals }) => (
								<div key={type} className={`rounded-xl border px-3 py-2 ${getTypeColors(type).border} ${getTypeColors(type).soft}`}>
									<div className={`text-[10px] uppercase tracking-[0.2em] ${getTypeColors(type).text}`}>{type}</div>
									<div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-lg font-black tabular-nums text-slate-50">
										<span className="inline-flex items-center gap-1"><ResourceIcon type="lim" />{formatNumber(totals.lim)}</span>
										<span className="inline-flex items-center gap-1"><ResourceIcon type="lunum" />{formatNumber(totals.lunum)}</span>
									</div>
								</div>
							)
						)
					}
				</section>

				<section className="mb-5 flex flex-col gap-3 rounded border border-slate-700/80 bg-slate-950/70 p-3 shadow-xl shadow-black/20 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-wrap gap-2">
						{
							["All", ...activeTypes].map(
								(type) => {
									const active = selectedType === type;
									const colors = getTypeColors(type);
									const color = type === "All" ? "border-slate-500 bg-slate-800 text-slate-50" : `${colors.border} ${colors.soft} ${colors.text}`;
									return <button key={type} type="button" onClick={() => setActiveType(type)} className={`rounded px-3 py-2 text-xs font-black uppercase tracking-widest transition ${color} ${active ? "ring-2 ring-white/40" : "opacity-70 hover:opacity-100"}`}>{type}</button>;
								}
							)
						}
					</div>
				</section>

				<div className="grid gap-5">
					{activeItems.length === 0 ? (
						<EmptyCollection collection={activeCollection} />
					) : (
						<Section title={selectedType === "All" ? activeCollection.label : `${selectedType} ${activeCollection.label}`} subtitle={`Unit Printer ${activeCollection.itemLabel} inventory · Shelter Lv ${shelterLevel}`} itemList={visibleItems} levels={levels} shelterLevel={shelterLevel} setLevel={setLevel} />
					)}
				</div>

				<footer className="mt-6 rounded border border-slate-700/80 bg-slate-950/70 p-4 text-xs leading-relaxed text-slate-400 shadow-xl shadow-black/20 backdrop-blur">
					Level 0 means not printed/unlocked yet. Shelter License controls which items and upgrade levels are visible and counted: base items follow [1, 3, 5, 6, 7, 8], while later unlocks stay hidden until their unlock Shelter level. Board-unlocked Level 1 weapons use 0 Lim / 0 Lunum at Level 1 because their first level is listed as a board unlock rather than a direct Unit Printer purchase. Weapon images are served from local app assets and silently disappear if an asset fails to load.
				</footer>
			</div>
		</main>
	);
}
