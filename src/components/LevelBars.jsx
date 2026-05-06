import { getItemKey, getShelterMaxLevel } from "../lib/calculations";
import { EMPTY_BAR, LOCKED_BAR, NEXT_BAR, ORANGE_COMPLETE, OWNED_BAR } from "../lib/constants";

export function LevelBars({ item, currentLevel, shelterLevel, onChange }) {
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	const isComplete = shelterMaxLevel > 0 && currentLevel >= shelterMaxLevel;

	return (
		<div className="flex items-center gap-1.5" aria-label={`Set ${item.name} level`}>
			{item.levels.map((entry) => {
				const locked = entry.level > shelterMaxLevel;
				const filled = entry.level <= currentLevel;
				const isNext = !isComplete && entry.level === currentLevel + 1;
				const title = locked
					? `${item.name} level ${entry.level} locked at Shelter Lv ${shelterLevel}`
					: `Set ${item.name} to level ${entry.level}`;
				const className = locked
					? LOCKED_BAR
					: isComplete
						? ORANGE_COMPLETE
						: filled
							? OWNED_BAR
							: isNext
								? NEXT_BAR
								: EMPTY_BAR;
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
			})}
		</div>
	);
}
