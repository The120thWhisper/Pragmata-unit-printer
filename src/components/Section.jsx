import { useMemo, useState } from "react";
import { getItemKey, getRemainingForWeapons } from "../lib/calculations";
import { StatPill } from "./StatPill";
import { UpgradeCard } from "./UpgradeCard";

export function Section({
	title,
	subtitle,
	itemList,
	levels,
	shelterLevel,
	setLevel,
	defaultOpen = true,
}) {
	const [open, setOpen] = useState(defaultOpen);
	const totals = useMemo(
		() => getRemainingForWeapons(itemList, levels, shelterLevel),
		[itemList, levels, shelterLevel],
	);

	return (
		<section className="rounded border border-slate-700/80 bg-slate-900/70 p-3 shadow-2xl shadow-black/30 backdrop-blur">
			<button
				className="flex w-full items-center justify-between gap-3 text-left"
				type="button"
				onClick={() => setOpen((value) => !value)}
			>
				<div>
					<h2 className="text-2xl font-black uppercase tracking-widest text-slate-50">
						{open ? "▾" : "▸"} {title}
					</h2>
					{subtitle && (
						<p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">{subtitle}</p>
					)}
				</div>
				<StatPill label="Remaining" lim={totals.lim} lunum={totals.lunum} />
			</button>
			{open && (
				<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{itemList.length > 0 ? (
						itemList.map((item) => (
							<UpgradeCard
								key={getItemKey(item)}
								item={item}
								currentLevel={levels[getItemKey(item)] ?? 0}
								shelterLevel={shelterLevel}
								onChange={setLevel}
							/>
						))
					) : (
						<div className="rounded border border-slate-800 bg-black/30 p-6 text-sm text-slate-400 sm:col-span-2 lg:col-span-3 xl:col-span-4">
							No {title.toLowerCase()} entries are unlocked at Shelter Lv {shelterLevel}.
						</div>
					)}
				</div>
			)}
		</section>
	);
}
