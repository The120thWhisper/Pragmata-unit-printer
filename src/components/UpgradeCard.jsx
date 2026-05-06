import { motion } from "framer-motion";
import {
	formatNumber,
	getItemKey,
	getRemainingForWeapon,
	getShelterMaxLevel,
	getTotalCost,
	getTypeColors,
	hasUnknownCosts,
} from "../lib/calculations";
import { LevelBars } from "./LevelBars";
import { LevelDetails } from "./LevelDetails";
import { ResourceIcon } from "./ResourceIcon";

export function UpgradeCard({ item, currentLevel, shelterLevel, onChange }) {
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
			<div
				className={`absolute left-0 top-0 h-8 w-8 ${locked ? "bg-slate-800" : colors.bar} opacity-90 [clip-path:polygon(0_0,100%_0,0_100%)]`}
			/>
			<div className="absolute right-2 top-2 rounded border border-slate-600/70 bg-black/50 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-slate-300">
				{locked ? "Locked" : `Lv ${currentLevel}/${shelterMaxLevel}`}
			</div>

			<div className="relative flex h-full flex-col p-3">
				<header className="min-h-[44px] pr-12">
					<h3 className="truncate text-lg font-black leading-tight tracking-wide text-slate-50 drop-shadow">
						{item.name}
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
							? `${item.name} is locked at Shelter Lv ${shelterLevel}`
							: currentLevel >= shelterMaxLevel
								? `Reset ${item.name} to level 0`
								: `Advance ${item.name} one level`
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
					) : complete ? (
						<div className="border-y border-orange-400/30 bg-black/40 py-1 text-center text-lg font-black uppercase tracking-wider text-orange-300">
							Complete
						</div>
					) : (
						<div className="flex min-h-[32px] items-center justify-center gap-3 border-y border-slate-700/80 bg-black/40 py-1 text-xl font-black tabular-nums text-red-500">
							{remaining.lunum > 0 && (
								<span className="inline-flex items-center gap-1 text-sky-100">
									<ResourceIcon type="lunum" />
									{formatNumber(remaining.lunum)}
								</span>
							)}
							{remaining.lim > 0 && (
								<span className="inline-flex items-center gap-1">
									<ResourceIcon type="lim" />
									{formatNumber(remaining.lim)}
								</span>
							)}
						</div>
					)}
					{item.unlockNote && (
						<p className="mt-2 line-clamp-2 text-[10px] leading-tight text-slate-400">
							{item.unlockNote}
						</p>
					)}
					<LevelDetails item={item} shelterLevel={shelterLevel} />
					<p className="mt-1 text-[10px] text-slate-500">
						Shelter cap cost: {formatNumber(shelterTotal.lim)} Lim /{" "}
						{formatNumber(shelterTotal.lunum)} Lunum{unknownCosts ? " + unknown" : ""}
					</p>
					<p className="mt-1 text-[10px] text-slate-600">
						Full max cost: {formatNumber(total.lim)} Lim / {formatNumber(total.lunum)} Lunum
					</p>
				</div>
			</div>
		</motion.article>
	);
}
