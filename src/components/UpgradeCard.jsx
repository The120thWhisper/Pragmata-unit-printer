import { motion } from "framer-motion";
import {
	formatNumber,
	getDisplayName,
	getItemKey,
	getRemainingForWeapon,
	getShelterMaxLevel,
	getTypeColors,
} from "../lib/calculations";
import { LevelBars } from "./LevelBars";
import { LevelDetails } from "./LevelDetails";
import { ResourceIcon } from "./ResourceIcon";

function getNextUpgrade(item, currentLevel, shelterMaxLevel) {
	return item.levels.find((entry) => entry.level > currentLevel && entry.level <= shelterMaxLevel);
}

function hasUnknownCost(entry) {
	return entry?.lim === null || entry?.lunum === null;
}

function CostAmount({ lim, lunum, unknown = false }) {
	return (
		<span className="inline-flex flex-wrap justify-end gap-x-2 gap-y-0.5 tabular-nums">
			<span className="inline-flex items-center gap-1">
				<ResourceIcon type="lim" />
				{formatNumber(lim ?? 0)}
			</span>
			<span className="inline-flex items-center gap-1 text-sky-100">
				<ResourceIcon type="lunum" />
				{formatNumber(lunum ?? 0)}
			</span>
			{unknown && <span className="text-xs uppercase tracking-wide text-slate-400">+ unknown</span>}
		</span>
	);
}

function CostBar({ label, tone = "total", children }) {
	const toneClass =
		tone === "next"
			? "border-red-500/40 bg-red-950/20 text-red-300"
			: "border-cyan-300/25 bg-cyan-400/10 text-cyan-50";
	return (
		<div
			className={`flex min-h-[30px] items-center justify-between gap-3 border-y px-2 py-1 ${toneClass}`}
		>
			<span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
				{label}
			</span>
			<span className="min-w-0 text-right text-base font-black">{children}</span>
		</div>
	);
}

export function UpgradeCard({ item, currentLevel, shelterLevel, onChange }) {
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	const remaining = getRemainingForWeapon(item, currentLevel, shelterLevel);
	const locked = shelterMaxLevel === 0;
	const complete = !locked && currentLevel >= shelterMaxLevel;
	const displayName = getDisplayName(item, currentLevel);
	const nextUpgrade = getNextUpgrade(item, currentLevel, shelterMaxLevel);
	const nextUnknownCosts = hasUnknownCost(nextUpgrade);
	const remainingUnknownCosts = item.levels.some(
		(entry) =>
			entry.level > currentLevel && entry.level <= shelterMaxLevel && hasUnknownCost(entry),
	);
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
			<div
				className={`absolute left-0 top-0 h-8 w-8 ${locked ? "bg-slate-800" : colors.bar} opacity-90 [clip-path:polygon(0_0,100%_0,0_100%)]`}
			/>
			<div className="absolute right-2 top-2 rounded border border-slate-600/70 bg-black/50 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-slate-300">
				{locked ? "Locked" : `Lv ${currentLevel}/${shelterMaxLevel}`}
			</div>

			<div className="relative flex h-full flex-col p-3">
				<header className="min-h-[44px] pr-12">
					<h3 className="truncate text-lg font-black leading-tight tracking-wide text-slate-50 drop-shadow">
						{displayName}
					</h3>
					<p
						className={`mt-0.5 text-[10px] uppercase tracking-[0.2em] ${locked ? "text-slate-500" : colors.text}`}
					>
						{item.type}
						{item.phase === "post" ? " · Post-game" : ""}
					</p>
				</header>

				<div className="mt-2 flex justify-center">
					<LevelBars
						item={item}
						currentLevel={currentLevel}
						shelterLevel={shelterLevel}
						onChange={onChange}
					/>
				</div>

				<button
					type="button"
					disabled={locked}
					onClick={() =>
						onChange(
							getItemKey(item),
							currentLevel >= shelterMaxLevel ? 0 : Math.min(currentLevel + 1, shelterMaxLevel),
						)
					}
					className="relative mt-3 flex h-24 items-center justify-center overflow-hidden rounded-sm border border-slate-700/80 bg-black/40 transition hover:border-cyan-200/60 disabled:cursor-not-allowed disabled:hover:border-slate-700/80"
					title={
						locked
							? `${displayName} is locked at Shelter Lv ${shelterLevel}`
							: currentLevel >= shelterMaxLevel
								? `Reset ${displayName} to level 0`
								: `Advance ${displayName} one level`
					}
				>
					<div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-cyan-400/10" />
					<img
						src={item.imageUrl}
						alt=""
						width="185"
						height="185"
						loading="lazy"
						decoding="async"
						className={`relative z-10 max-h-[88px] max-w-[90%] object-contain drop-shadow-[0_0_14px_rgba(255,255,255,0.28)] transition duration-200 ${locked ? "grayscale opacity-25" : "group-hover:scale-105"}`}
						onError={(event) => {
							event.currentTarget.style.display = "none";
						}}
					/>
					<span className="absolute bottom-1 right-2 text-[9px] uppercase tracking-widest text-slate-600">
						{locked ? `Shelter Lv ${item.unlockShelterLevel ?? "?"}` : "click +1"}
					</span>
				</button>

				<div className="mt-auto pt-3">
					{locked ? (
						<div className="border-y border-slate-700/80 bg-black/40 py-1 text-center text-lg font-black uppercase tracking-wider text-slate-500">
							Locked
						</div>
					) : (
						<div className="space-y-1.5">
							<CostBar label={nextUpgrade ? `Next Lv. ${nextUpgrade.level}` : "Next"} tone="next">
								{nextUpgrade ? (
									nextUnknownCosts ? (
										<span className="text-sm uppercase tracking-wide text-slate-400">Cost unknown</span>
									) : (
										<CostAmount lim={nextUpgrade.lim} lunum={nextUpgrade.lunum} />
									)
								) : (
									<span className="uppercase tracking-wider text-orange-300">Complete</span>
								)}
							</CostBar>
							<CostBar label="Total" tone="total">
								<CostAmount
									lim={remaining.lim}
									lunum={remaining.lunum}
									unknown={remainingUnknownCosts}
								/>
							</CostBar>
						</div>
					)}
					{item.unlockNote && (
						<p className="mt-2 line-clamp-2 text-[10px] leading-tight text-slate-400">
							{item.unlockNote}
						</p>
					)}
					<LevelDetails item={item} currentLevel={currentLevel} shelterLevel={shelterLevel} />
				</div>
			</div>
		</motion.article>
	);
}
