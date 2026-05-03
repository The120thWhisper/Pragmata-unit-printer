import { useMemo, useState } from "react";
import { motion } from "framer-motion";

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
};

const ORANGE_COMPLETE = "bg-gradient-to-r from-yellow-300 to-orange-500";
const OWNED_BAR = "bg-slate-100";
const EMPTY_BAR = "bg-slate-400/40";
const NEXT_BAR = "bg-red-600";
const assetBase = import.meta.url.includes("/dist/assets/")
	? `${import.meta.env.BASE_URL}dist/`
	: import.meta.env.BASE_URL;
const publicAsset = (path) => `${assetBase}${path.replace(/^\/+/, "")}`;
const weaponImage = (name) => publicAsset(`images/weapon/${name}.png`);

const weapons = [
	{
	name: "Shockwave Gun",
	type: "Attack",
	phase: "main",
	imageUrl: weaponImage("Shockwave Gun"),
	levels: [
			{ level: 1, lim: 100, lunum: 0 },
			{ level: 2, lim: 350, lunum: 0 },
			{ level: 3, lim: 900, lunum: 0 },
			{ level: 4, lim: 1300, lunum: 1 },
			{ level: 5, lim: 1600, lunum: 1 },
			{ level: 6, lim: 2000, lunum: 1 },
			{ level: 7, lim: 3000, lunum: 1 },
			{ level: 8, lim: 4000, lunum: 2 },
		],
	},
	{
		name: "Charge Piercer",
		type: "Attack",
		phase: "main",
		imageUrl: weaponImage("Charge Piercer"),
		levels: [
			{ level: 1, lim: 100, lunum: 0 },
			{ level: 2, lim: 500, lunum: 0 },
			{ level: 3, lim: 1000, lunum: 0 },
			{ level: 4, lim: 1300, lunum: 1 },
			{ level: 5, lim: 1600, lunum: 1 },
			{ level: 6, lim: 2000, lunum: 1 },
			{ level: 7, lim: 3000, lunum: 1 },
			{ level: 8, lim: 4000, lunum: 2 },
		],
	},
	{
		name: "Photon Laser",
		type: "Attack",
		phase: "main",
		imageUrl: weaponImage("Photon Laser"),
		levels: [
			{ level: 1, lim: 100, lunum: 0 },
			{ level: 2, lim: 400, lunum: 0 },
			{ level: 3, lim: 900, lunum: 0 },
			{ level: 4, lim: 1100, lunum: 1 },
			{ level: 5, lim: 1500, lunum: 1 },
			{ level: 6, lim: 2000, lunum: 1 },
			{ level: 7, lim: 3000, lunum: 1 },
			{ level: 8, lim: 4000, lunum: 2 },
		],
	},
	{
		name: "Homing Missiles",
		type: "Attack",
		phase: "main",
		imageUrl: weaponImage("Homing Missiles"),
		levels: [
			{ level: 1, lim: 100, lunum: 0 },
			{ level: 2, lim: 400, lunum: 0 },
			{ level: 3, lim: 900, lunum: 0 },
			{ level: 4, lim: 1100, lunum: 1 },
			{ level: 5, lim: 1500, lunum: 1 },
			{ level: 6, lim: 2000, lunum: 1 },
			{ level: 7, lim: 3000, lunum: 1 },
			{ level: 8, lim: 4000, lunum: 2 },
		],
	},
	{
		name: "Stasis Net",
		type: "Tactical",
		phase: "main",
		imageUrl: weaponImage("Stasis Net"),
		levels: [
			{ level: 1, lim: 100, lunum: 0 },
			{ level: 2, lim: 300, lunum: 0 },
			{ level: 3, lim: 700, lunum: 0 },
			{ level: 4, lim: 1000, lunum: 0 },
			{ level: 5, lim: 1400, lunum: 0 },
			{ level: 6, lim: 1800, lunum: 0 },
			{ level: 7, lim: 2500, lunum: 1 },
			{ level: 8, lim: 3000, lunum: 1 },
		],
	},
	{
		name: "Riot Blaster",
		type: "Tactical",
		phase: "main",
		imageUrl: weaponImage("Riot Blaster"),
		levels: [
			{ level: 1, lim: 200, lunum: 0 },
			{ level: 2, lim: 400, lunum: 0 },
			{ level: 3, lim: 800, lunum: 0 },
			{ level: 4, lim: 1000, lunum: 0 },
			{ level: 5, lim: 1400, lunum: 0 },
			{ level: 6, lim: 1800, lunum: 0 },
			{ level: 7, lim: 2500, lunum: 1 },
			{ level: 8, lim: 3000, lunum: 1 },
		],
	},
	{
		name: "Sticky Bombs",
		type: "Tactical",
		phase: "main",
		imageUrl: weaponImage("Sticky Bombs"),
		levels: [
			{ level: 1, lim: 100, lunum: 0 },
			{ level: 2, lim: 300, lunum: 0 },
			{ level: 3, lim: 600, lunum: 0 },
			{ level: 4, lim: 800, lunum: 0 },
			{ level: 5, lim: 1200, lunum: 0 },
			{ level: 6, lim: 1500, lunum: 0 },
			{ level: 7, lim: 2000, lunum: 1 },
			{ level: 8, lim: 2500, lunum: 1 },
		],
	},
	{
		name: "Code Generator",
		type: "Tactical",
		phase: "main",
		unlockNote: "Level 1 unlocks from Cabin Specialist Board",
		imageUrl: weaponImage("Code Generator"),
		levels: [
			{ level: 1, lim: 0, lunum: 0, note: "Board unlock" },
			{ level: 2, lim: 400, lunum: 0 },
			{ level: 3, lim: 800, lunum: 0 },
			{ level: 4, lim: 1200, lunum: 0 },
			{ level: 5, lim: 1500, lunum: 0 },
			{ level: 6, lim: 2000, lunum: 0 },
			{ level: 7, lim: 3000, lunum: 1 },
			{ level: 8, lim: 3500, lunum: 1 },
		],
	},
	{
		name: "Hacking Mines",
		type: "Tactical",
		phase: "main",
		unlockNote: "Level 1 unlocks from Cabin Director Board",
		imageUrl: weaponImage("Hacking Mines"),
		levels: [
			{ level: 1, lim: 0, lunum: 0, note: "Board unlock" },
			{ level: 2, lim: 400, lunum: 0 },
			{ level: 3, lim: 800, lunum: 0 },
			{ level: 4, lim: 1000, lunum: 0 },
			{ level: 5, lim: 1400, lunum: 0 },
			{ level: 6, lim: 1800, lunum: 0 },
			{ level: 7, lim: 2500, lunum: 1 },
			{ level: 8, lim: 3000, lunum: 1 },
		],
	},
	{
		name: "Decoy Gen.",
		fullName: "Decoy Generator",
		type: "Defensive",
		phase: "main",
		imageUrl: weaponImage("Decoy Generator"),
		levels: [
			{ level: 1, lim: 300, lunum: 0 },
			{ level: 2, lim: 900, lunum: 0 },
			{ level: 3, lim: 1500, lunum: 1 },
		],
	},
	{
		name: "Impact Barrier",
		type: "Defensive",
		phase: "main",
		imageUrl: weaponImage("Impact Barrier"),
		levels: [
			{ level: 1, lim: 300, lunum: 0 },
			{ level: 2, lim: 900, lunum: 0 },
			{ level: 3, lim: 1500, lunum: 1 },
		],
	},
	{
		name: "Drone Hive",
		type: "Defensive",
		phase: "main",
		unlockNote: "Level 1 unlocks from Cabin Associate Board",
		imageUrl: weaponImage("Drone Hive"),
		levels: [
			{ level: 1, lim: 0, lunum: 0, note: "Board unlock" },
			{ level: 2, lim: 900, lunum: 0 },
			{ level: 3, lim: 1500, lunum: 1 },
		],
	},
	{
		name: "Jackhammer",
		type: "Attack",
		phase: "post",
		unlockNote: "Complete-story unlock",
		imageUrl: weaponImage("Jackhammer"),
		levels: [
			{ level: 1, lim: 500, lunum: 0 },
			{ level: 2, lim: 900, lunum: 0 },
			{ level: 3, lim: 1500, lunum: 0 },
			{ level: 4, lim: 2000, lunum: 1 },
			{ level: 5, lim: 3000, lunum: 1 },
			{ level: 6, lim: 5000, lunum: 1 },
			{ level: 7, lim: 6000, lunum: 1 },
			{ level: 8, lim: 10000, lunum: 2 },
		],
	},
	{
		name: "Lim Cannon",
		type: "Attack",
		phase: "post",
		unlockNote: "Complete Unknown Signal missions unlock",
		imageUrl: weaponImage("Lim Cannon"),
		levels: [
			{ level: 1, lim: 500, lunum: 0 },
			{ level: 2, lim: 900, lunum: 0 },
			{ level: 3, lim: 1500, lunum: 0 },
			{ level: 4, lim: 2000, lunum: 1 },
			{ level: 5, lim: 3000, lunum: 1 },
			{ level: 6, lim: 5000, lunum: 1 },
			{ level: 7, lim: 6000, lunum: 1 },
			{ level: 8, lim: 10000, lunum: 2 },
		],
	},
];

function formatNumber(value) {
	return Number(value).toLocaleString();
}

function getMaxLevel(weapon) {
	return Math.max(...weapon.levels.map((entry) => entry.level));
}

function getRemainingForWeapon(weapon, currentLevel) {
	return weapon.levels
	.filter((entry) => entry.level > currentLevel)
	.reduce(
		(sum, entry) => ({ lim: sum.lim + entry.lim, lunum: sum.lunum + entry.lunum }),
		{ lim: 0, lunum: 0 }
	);
}

function getTotalCost(weapon) {
	return weapon.levels.reduce(
		(sum, entry) => (
			{ lim: sum.lim + entry.lim, lunum: sum.lunum + entry.lunum }
		),
		{ lim: 0, lunum: 0 }
	);
}

function getRemainingForWeapons(weaponList, levelMap) {
	return weaponList.reduce(
		(sum, weapon) => {
			const remaining = getRemainingForWeapon(weapon, levelMap[weapon.name] ?? 0);
			return { lim: sum.lim + remaining.lim, lunum: sum.lunum + remaining.lunum };
		},
		{ lim: 0, lunum: 0 }
	);
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

function LevelBars({ weapon, currentLevel, onChange }) {
	const maxLevel = getMaxLevel(weapon);
	const isComplete = currentLevel >= maxLevel;

	return (
		<div className="flex items-center gap-1.5" aria-label={`Set ${weapon.name} level`}>
			{
				weapon.levels.map(
					(entry) => {
						const filled = entry.level <= currentLevel;
						const isNext = !isComplete && entry.level === currentLevel + 1;
						const title = `Set ${weapon.name} to level ${entry.level}`;
						const className = isComplete ? ORANGE_COMPLETE : filled ? OWNED_BAR : isNext ? NEXT_BAR : EMPTY_BAR;
						return (
							<button
								key={entry.level}
								type="button"
								title={title}
								aria-label={title}
								onClick={() => onChange(weapon.name, entry.level)}
								className={`h-5 w-3.5 -skew-x-[22deg] border border-black/50 ${className} shadow-sm transition hover:scale-110 hover:border-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-200`}
							/>
						);
					}
				)
			}
		</div>
	);
}

function WeaponCard({ weapon, currentLevel, onChange }) {
	const maxLevel = getMaxLevel(weapon);
	const remaining = getRemainingForWeapon(weapon, currentLevel);
	const total = getTotalCost(weapon);
	const complete = currentLevel >= maxLevel;
	const colors = TYPE_COLORS[weapon.type];

	return (
		<motion.article
			layout
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			className={`group relative min-h-[245px] overflow-hidden rounded-sm border ${colors.border} bg-slate-950/80 shadow-xl ${colors.glow}`}
		>
			<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
			<div className={`absolute left-0 top-0 h-1.5 w-24 ${colors.bar}`} />
			<div className={`absolute left-0 top-0 h-8 w-8 ${colors.bar} opacity-90 [clip-path:polygon(0_0,100%_0,0_100%)]`} />
			<div className="absolute right-2 top-2 rounded border border-slate-600/70 bg-black/50 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-slate-300">Lv {currentLevel}/{maxLevel}</div>

			<div className="relative flex h-full flex-col p-3">
				<header className="min-h-[44px] pr-12">
					<h3 className="truncate text-lg font-black leading-tight tracking-wide text-slate-50 drop-shadow">{weapon.name}</h3>
					<p className={`mt-0.5 text-[10px] uppercase tracking-[0.2em] ${colors.text}`}>{weapon.type}{weapon.phase === "post" ? " · Post-game" : ""}</p>
				</header>

				<div className="mt-2 flex justify-center">
					<LevelBars weapon={weapon} currentLevel={currentLevel} onChange={onChange} />
				</div>

				<button
					type="button"
					onClick={() => onChange(weapon.name, currentLevel >= maxLevel ? 0 : Math.min(currentLevel + 1, maxLevel))}
					className="relative mt-3 flex h-24 items-center justify-center overflow-hidden rounded-sm border border-slate-700/80 bg-black/40 transition hover:border-cyan-200/60"
					title={currentLevel >= maxLevel ? `Reset ${weapon.name} to level 0` : `Advance ${weapon.name} one level`}
				>
					<div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-cyan-400/10" />
					<img
						src={weapon.imageUrl}
						alt=""
						className="relative z-10 max-h-[88px] max-w-[90%] object-contain drop-shadow-[0_0_14px_rgba(255,255,255,0.28)] transition duration-200 group-hover:scale-105"
						onError={
							(event) => {
								event.currentTarget.style.display = "none";
							}
						}
					/>
					<span className="absolute bottom-1 right-2 text-[9px] uppercase tracking-widest text-slate-600">click +1</span>
				</button>

				<div className="mt-auto pt-3">
					{complete ? 
						(
							<div className="border-y border-orange-400/30 bg-black/40 py-1 text-center text-lg font-black uppercase tracking-wider text-orange-300">Complete</div>
						) : (
							<div className="flex min-h-[32px] items-center justify-center gap-3 border-y border-slate-700/80 bg-black/40 py-1 text-xl font-black tabular-nums text-red-500">
								{remaining.lunum > 0 && <span className="inline-flex items-center gap-1 text-sky-100"><ResourceIcon type="lunum" />{formatNumber(remaining.lunum)}</span>}
								{remaining.lim > 0 && <span className="inline-flex items-center gap-1"><ResourceIcon type="lim" />{formatNumber(remaining.lim)}</span>}
							</div>
						)
					}
					{weapon.unlockNote && <p className="mt-2 line-clamp-2 text-[10px] leading-tight text-slate-400">{weapon.unlockNote}</p>}
					<p className="mt-1 text-[10px] text-slate-500">Total max cost: {formatNumber(total.lim)} Lim / {formatNumber(total.lunum)} Lunum</p>
				</div>
			</div>
		</motion.article>
	);
}

function Section({ title, subtitle, weaponList, levels, setLevel, defaultOpen = true }) {
	const [open, setOpen] = useState(defaultOpen);
	const totals = useMemo(() => getRemainingForWeapons(weaponList, levels), [weaponList, levels]);

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
						{weaponList.map((weapon) => <WeaponCard key={weapon.name} weapon={weapon} currentLevel={levels[weapon.name] ?? 0} onChange={setLevel} />)}
					</div>
				)
			}
		</section>
	);
}

export default function PragmataUnitPrinterCalculator() {
	const defaultLevels = useMemo(() => Object.fromEntries(weapons.map((weapon) => [weapon.name, 0])), []);
	const [levels, setLevels] = useState(defaultLevels);
	const [activeType, setActiveType] = useState("All");
	const [includePostGame, setIncludePostGame] = useState(false);

	const setLevel = (weaponName, level) => setLevels((current) => ({ ...current, [weaponName]: level }));

	const mainWeapons = useMemo(() => weapons.filter((weapon) => weapon.phase === "main"), []);
	const postWeapons = useMemo(() => weapons.filter((weapon) => weapon.phase === "post"), []);
	const visibleMainWeapons = useMemo(() => activeType === "All" ? mainWeapons : mainWeapons.filter((weapon) => weapon.type === activeType), [activeType, mainWeapons]);
	const countedWeapons = includePostGame ? weapons : mainWeapons;
	const grandTotal = useMemo(() => getRemainingForWeapons(countedWeapons, levels), [countedWeapons, levels]);
	const mainTotal = useMemo(() => getRemainingForWeapons(mainWeapons, levels), [mainWeapons, levels]);
	const postTotal = useMemo(() => getRemainingForWeapons(postWeapons, levels), [postWeapons, levels]);

	const typeTotals = useMemo(() => {
		return ["Attack", "Tactical", "Defensive"].map(
			(type) => (
				{
					type,
					totals: getRemainingForWeapons(mainWeapons.filter((weapon) => weapon.type === type), levels),
				}
			)
		);
		}, [levels, mainWeapons]
	);

	const maxMain = () => setLevels((current) => ({ ...current, ...Object.fromEntries(mainWeapons.map((weapon) => [weapon.name, getMaxLevel(weapon)])) }));
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
								<span className="rounded bg-cyan-400/15 px-2 py-1 ring-1 ring-cyan-300/30">Weapons</span>
								<span className="text-slate-500">Hacking</span>
								<span className="text-slate-500">Abilities</span>
								<span className="text-slate-500">Attachments</span>
							</div>
							<h1 className="text-3xl font-black uppercase tracking-[0.12em] text-slate-50 sm:text-5xl">Unit Printer</h1>
							<p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">Click the slanted level bars to set the weapon level. Empty means unbought, white goes up to the current level, red marks the next upgrade, and orange means upgrades are complete. This will calculate the total cost to full upgrade your weapons.</p>
							<p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">NOTE: Numbers sourced online, but not confirmed independently (yet). Values may be inaccurate.More tabs and details to come.</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<button type="button" onClick={maxMain} className="rounded border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm font-bold uppercase tracking-wide text-cyan-50 hover:bg-cyan-400/20">
								<Icon className="mr-1 inline h-4 w-4" />
								Max main
							</button>
							<button type="button" onClick={resetAll} className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-bold uppercase tracking-wide text-slate-100 hover:bg-slate-800">
								<Icon name="reset" className="mr-1 inline h-4 w-4" />
								Reset
							</button>
						</div>
					</div>
				</header>

				<section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
					<StatPill label="Grand remaining" lim={grandTotal.lim} lunum={grandTotal.lunum} />
					<StatPill label="Main remaining" lim={mainTotal.lim} lunum={mainTotal.lunum} />
					{
						typeTotals.map(
							({ type, totals }) => (
								<div key={type} className={`rounded-xl border px-3 py-2 ${TYPE_COLORS[type].border} ${TYPE_COLORS[type].soft}`}>
									<div className={`text-[10px] uppercase tracking-[0.2em] ${TYPE_COLORS[type].text}`}>{type}</div>
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
							["All", "Attack", "Tactical", "Defensive"].map(
								(type) => {
									const active = activeType === type;
									const color = type === "All" ? "border-slate-500 bg-slate-800 text-slate-50" : `${TYPE_COLORS[type].border} ${TYPE_COLORS[type].soft} ${TYPE_COLORS[type].text}`;
									return <button key={type} type="button" onClick={() => setActiveType(type)} className={`rounded px-3 py-2 text-xs font-black uppercase tracking-widest transition ${color} ${active ? "ring-2 ring-white/40" : "opacity-70 hover:opacity-100"}`}>{type}</button>;
								}
							)
						}
					</div>
					<button
						type="button"
						onClick={() => setIncludePostGame((value) => !value)}
						className={`rounded border px-3 py-2 text-xs font-black uppercase tracking-widest ${includePostGame ? "border-amber-200 bg-amber-300 text-slate-950" : "border-amber-300/30 bg-amber-400/10 text-amber-100"}`}
					>
						Post-game in grand total: {includePostGame ? "On" : "Off"}
					</button>
				</section>

				<div className="grid gap-5">
					<Section title={activeType === "All" ? "Main Weapons" : `${activeType} Weapons`} subtitle="Main game Unit Printer inventory" weaponList={visibleMainWeapons} levels={levels} setLevel={setLevel} />
					<Section title="Post-game Attack" subtitle={`Extra remaining: ${formatNumber(postTotal.lim)} Lim / ${formatNumber(postTotal.lunum)} Lunum`} weaponList={postWeapons} levels={levels} setLevel={setLevel} />
				</div>

				<footer className="mt-6 rounded border border-slate-700/80 bg-slate-950/70 p-4 text-xs leading-relaxed text-slate-400 shadow-xl shadow-black/20 backdrop-blur">
					Level 0 means not printed/unlocked yet, so all listed costs are included. Board-unlocked Level 1 weapons use 0 Lim / 0 Lunum at Level 1 because their first level is listed as a board unlock rather than a direct Unit Printer purchase. Weapon images are served from local app assets and silently disappear if an asset fails to load.
				</footer>
			</div>
		</main>
	);
}
