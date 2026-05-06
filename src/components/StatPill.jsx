import { formatNumber } from "../lib/calculations";
import { ResourceIcon } from "./ResourceIcon";

export function StatPill({ label, lim, lunum, color = "cyan" }) {
	const colorClass =
		color === "amber"
			? "border-amber-300/30 bg-amber-400/10 text-amber-50"
			: "border-cyan-300/30 bg-cyan-400/10 text-cyan-50";
	return (
		<div className={`rounded-xl border px-3 py-2 ${colorClass}`}>
			<div className="text-[10px] uppercase tracking-[0.2em] opacity-70">{label}</div>
			<div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-lg font-black tabular-nums">
				<span className="inline-flex items-center gap-1">
					<ResourceIcon type="lim" />
					{formatNumber(lim)}
				</span>
				<span className="inline-flex items-center gap-1">
					<ResourceIcon type="lunum" />
					{formatNumber(lunum)}
				</span>
			</div>
		</div>
	);
}
