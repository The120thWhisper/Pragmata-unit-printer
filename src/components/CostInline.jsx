import { formatNumber } from "../lib/calculations";
import { ResourceIcon } from "./ResourceIcon";

export function CostInline({ lim, lunum }) {
	if (lim === null || lunum === null) {
		return <span className="text-slate-500">Cost unknown</span>;
	}
	return (
		<span className="inline-flex flex-wrap gap-x-2 gap-y-0.5">
			<span className="inline-flex items-center gap-1">
				<ResourceIcon type="lim" />
				{formatNumber(lim)}
			</span>
			<span className="inline-flex items-center gap-1">
				<ResourceIcon type="lunum" />
				{formatNumber(lunum)}
			</span>
		</span>
	);
}
