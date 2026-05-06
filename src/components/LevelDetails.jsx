import { getShelterMaxLevel } from "../lib/calculations";
import { CostInline } from "./CostInline";

export function LevelDetails({ item, shelterLevel }) {
	const shelterMaxLevel = getShelterMaxLevel(item, shelterLevel);
	const visibleLevels = item.levels.filter((entry) => entry.level <= shelterMaxLevel);
	if (
		!visibleLevels.some(
			(entry) => entry.effect || entry.note || entry.lim === null || entry.lunum === null,
		)
	)
		return null;

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
