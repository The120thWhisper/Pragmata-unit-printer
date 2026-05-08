import { useLayoutEffect, useRef } from "react";
import { getShelterMaxLevel } from "../lib/calculations";
import { EMPTY_BAR, LOCKED_BAR, NEXT_BAR, ORANGE_COMPLETE, OWNED_BAR } from "../lib/constants";

function getLevelMarkerClass({ entry, currentLevel, shelterMaxLevel, isComplete }) {
	const locked = entry.level > shelterMaxLevel;
	const filled = entry.level <= currentLevel;
	const isNext = !isComplete && entry.level === currentLevel + 1;
	return locked
		? LOCKED_BAR
		: isComplete
			? ORANGE_COMPLETE
			: filled
				? OWNED_BAR
				: isNext
					? NEXT_BAR
					: EMPTY_BAR;
}

function getLevelDescription(entry) {
	return entry.effect ? String(entry.effect) : "";
}

function getScrollTargetLevel(currentLevel, shelterMaxLevel) {
	if (currentLevel <= 1 || shelterMaxLevel <= 0) return 1;
	return Math.max(1, Math.min(currentLevel, shelterMaxLevel));
}

export function LevelDetails({ item, currentLevel, shelterLevel }) {
	const scrollerRef = useRef(null);
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	const isComplete = shelterMaxLevel > 0 && currentLevel >= shelterMaxLevel;
	const scrollTargetLevel = getScrollTargetLevel(currentLevel, shelterMaxLevel);

	useLayoutEffect(() => {
		const scroller = scrollerRef.current;
		const target = scroller?.querySelector(`[data-level-row="${scrollTargetLevel}"]`);
		if (!scroller || !target) return;

		const scrollerTop = scroller.getBoundingClientRect().top;
		const targetTop = target.getBoundingClientRect().top;
		scroller.scrollTop += targetTop - scrollerTop;
	}, [item.id, scrollTargetLevel]);

	return (
		<div ref={scrollerRef} className="mt-2 max-h-28 space-y-1 overflow-auto overflow-x-hidden border-t border-slate-800/80 px-2 pt-2 text-[10px] leading-tight text-slate-400">
			{item.levels.map((entry) => {
				const locked = entry.level > shelterMaxLevel;
				const filled = entry.level <= currentLevel;
				const isNext = !isComplete && entry.level === currentLevel + 1;
				const outlined = locked || (!isComplete && !filled && !isNext);
				const markerClass = getLevelMarkerClass({ entry, currentLevel, shelterMaxLevel, isComplete });
				const description = getLevelDescription(entry);
				return (
					<div
						key={entry.level}
						data-level-row={entry.level}
						className={`grid h-5 grid-cols-[12px_38px_minmax(0,1fr)] items-center gap-1.5 overflow-hidden ${locked ? "text-slate-600" : "text-slate-400"}`}
					>
						<span
							className={`ml-0.5 h-4 w-2.5 -skew-x-[22deg] border ${outlined ? "border-slate-500/70" : "border-black/50"} ${locked ? "opacity-45" : ""} ${markerClass}`}
							aria-hidden="true"
						/>
						<span className={`font-black uppercase leading-none tabular-nums ${locked ? "text-slate-600" : "text-slate-500"}`}>
							Lv. {entry.level}
						</span>
						<span
							className={`min-w-0 truncate leading-none ${locked ? "text-slate-600" : "text-slate-300"}`}
							title={description}
						>
							{description}
						</span>
					</div>
				);
			})}
		</div>
	);
}
