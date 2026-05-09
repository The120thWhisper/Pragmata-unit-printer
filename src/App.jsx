import { useEffect, useMemo, useState } from "react";
import { EmptyCollection } from "./components/EmptyCollection";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Icon } from "./components/Icon";
import { ResourceIcon } from "./components/ResourceIcon";
import { Section } from "./components/Section";
import { ShelterSelector } from "./components/ShelterSelector";
import { StatPill } from "./components/StatPill";
import {
	formatNumber,
	getGroupedTypeTotals,
	getItemKey,
	getRemainingForWeapons,
	getShelterMaxLevel,
	getTypeColors,
} from "./lib/calculations";
import { MAX_SHELTER_LEVEL, MIN_SHELTER_LEVEL } from "./lib/constants";
import { readStoredState, writeStoredState } from "./lib/storage";
import { allUpgradeItems, upgradeCollections } from "./lib/upgradeCollections";
import { readUrlState, writeUrlState } from "./lib/url";

export default function PragmataUnitPrinterCalculator() {
	const defaultLevels = useMemo(
		() => Object.fromEntries(allUpgradeItems.map((item) => [getItemKey(item), 0])),
		[],
	);
	const [levels, setLevels] = useState(() => {
		const stored = readStoredState();
		if (!stored?.levels || typeof stored.levels !== "object") return defaultLevels;
		const result = { ...defaultLevels };
		for (const key of Object.keys(defaultLevels)) {
			const value = Number(stored.levels[key]);
			if (Number.isFinite(value) && value >= 0) {
				result[key] = Math.floor(value);
			}
		}
		return result;
	});
	const [shelterLevel, setShelterLevel] = useState(() => {
		const url = readUrlState();
		if (url.shelter != null) return url.shelter;
		const stored = readStoredState();
		const value = Number(stored?.shelterLevel);
		if (Number.isFinite(value) && value >= MIN_SHELTER_LEVEL && value <= MAX_SHELTER_LEVEL) {
			return value;
		}
		return MIN_SHELTER_LEVEL;
	});
	const [activeCollectionKey, setActiveCollectionKey] = useState(() => {
		return readUrlState().tab ?? "weapon";
	});
	const [activeType, setActiveType] = useState("All");

	useEffect(() => {
		writeStoredState({ levels, shelterLevel });
	}, [levels, shelterLevel]);

	useEffect(() => {
		writeUrlState({ tab: activeCollectionKey, shelter: shelterLevel });
	}, [activeCollectionKey, shelterLevel]);

	const setLevel = (itemId, level) => setLevels((current) => ({ ...current, [itemId]: level }));

	const activeCollection = upgradeCollections[activeCollectionKey];
	const activeItems = activeCollection.items;
	const availableItems = useMemo(
		() => activeItems.filter((item) => getShelterMaxLevel(item, shelterLevel) > 0),
		[activeItems, shelterLevel],
	);
	const activeTypes = useMemo(
		() => Array.from(new Set(availableItems.map((item) => item.type).filter(Boolean))),
		[availableItems],
	);
	const selectedType =
		activeType === "All" || activeTypes.includes(activeType) ? activeType : "All";
	const visibleItems = useMemo(
		() =>
			selectedType === "All"
				? availableItems
				: availableItems.filter((item) => item.type === selectedType),
		[availableItems, selectedType],
	);
	const grandTotal = useMemo(
		() => getRemainingForWeapons(availableItems, levels, shelterLevel),
		[availableItems, levels, shelterLevel],
	);
	const visibleTotal = useMemo(
		() => getRemainingForWeapons(visibleItems, levels, shelterLevel),
		[visibleItems, levels, shelterLevel],
	);

	const typeTotals = useMemo(() => {
		const grouped = getGroupedTypeTotals(availableItems, levels, shelterLevel);
		return activeTypes.map((type) => ({
			type,
			totals: grouped.get(type) ?? { lim: 0, lunum: 0 },
		}));
	}, [activeTypes, availableItems, levels, shelterLevel]);

	const selectCollection = (collectionKey) => {
		setActiveCollectionKey(collectionKey);
		setActiveType("All");
	};
	const maxCurrent = () =>
		setLevels((current) => ({
			...current,
			...Object.fromEntries(
				visibleItems.map((item) => [getItemKey(item), getShelterMaxLevel(item, shelterLevel)]),
			),
		}));
	const resetAll = () => setLevels(defaultLevels);

	return (
		<main className="min-h-screen overflow-hidden bg-[#071017] p-4 text-slate-50 sm:p-6 lg:p-8">
			<div className="pointer-events-none fixed inset-0 opacity-80">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(239,68,68,0.12),transparent_28%),radial-gradient(circle_at_60%_100%,rgba(16,185,129,0.14),transparent_35%)]" />
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
			</div>

			<div className="relative mx-auto max-w-[94rem]">
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
							<h1 className="text-3xl font-black uppercase tracking-[0.12em] text-slate-50 sm:text-5xl">
								Unit Printer
							</h1>
							<p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
								Click the slanted level bars to set the current level. Empty means unbought, white
								goes up to the current level, red marks the next upgrade, thin outlines mark
								unbought or Shelter-locked upgrades, and orange means upgrades are complete for
								the selected Shelter License.
							</p>
							<p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
								NOTE: Numbers sourced online, but not confirmed independently (yet). Values may be
								inaccurate. Use the local config panel to add and verify new Unit Printer tabs
								before pushing.
							</p>
						</div>
						<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:items-end">
							<ShelterSelector shelterLevel={shelterLevel} onChange={setShelterLevel} />
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									onClick={maxCurrent}
									className="rounded border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-sm font-bold uppercase tracking-wide text-cyan-50 hover:bg-cyan-400/20"
								>
									<Icon className="mr-1 inline h-4 w-4" />
									Max current
								</button>
								<button
									type="button"
									onClick={resetAll}
									className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-bold uppercase tracking-wide text-slate-100 hover:bg-slate-800"
								>
									<Icon name="reset" className="mr-1 inline h-4 w-4" />
									Reset
								</button>
							</div>
						</div>
					</div>
				</header>

				<section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
					<StatPill
						label={`${activeCollection.label} remaining`}
						lim={grandTotal.lim}
						lunum={grandTotal.lunum}
					/>
					<StatPill label="Shown remaining" lim={visibleTotal.lim} lunum={visibleTotal.lunum} />
					{typeTotals.map(({ type, totals }) => (
						<div
							key={type}
							className={`rounded-xl border px-3 py-2 ${getTypeColors(type).border} ${getTypeColors(type).soft}`}
						>
							<div className={`text-[10px] uppercase tracking-[0.2em] ${getTypeColors(type).text}`}>
								{type}
							</div>
							<div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-lg font-black tabular-nums text-slate-50">
								<span className="inline-flex items-center gap-1">
									<ResourceIcon type="lim" />
									{formatNumber(totals.lim)}
								</span>
								<span className="inline-flex items-center gap-1">
									<ResourceIcon type="lunum" />
									{formatNumber(totals.lunum)}
								</span>
							</div>
						</div>
					))}
				</section>

				<section className="mb-5 flex flex-col gap-3 rounded border border-slate-700/80 bg-slate-950/70 p-3 shadow-xl shadow-black/20 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-wrap gap-2">
						{["All", ...activeTypes].map((type) => {
							const active = selectedType === type;
							const colors = getTypeColors(type);
							const color =
								type === "All"
									? "border-slate-500 bg-slate-800 text-slate-50"
									: `${colors.border} ${colors.soft} ${colors.text}`;
							return (
								<button
									key={type}
									type="button"
									onClick={() => setActiveType(type)}
									className={`rounded px-3 py-2 text-xs font-black uppercase tracking-widest transition ${color} ${active ? "ring-2 ring-white/40" : "opacity-70 hover:opacity-100"}`}
								>
									{type}
								</button>
							);
						})}
					</div>
				</section>

				<div className="grid gap-5">
					<ErrorBoundary>
						{activeItems.length === 0 ? (
							<EmptyCollection collection={activeCollection} />
						) : (
							<Section
								title={
									selectedType === "All"
										? activeCollection.label
										: `${selectedType} ${activeCollection.label}`
								}
								subtitle={`Unit Printer ${activeCollection.itemLabel} inventory · Shelter Lv ${shelterLevel}`}
								itemList={visibleItems}
								levels={levels}
								shelterLevel={shelterLevel}
								setLevel={setLevel}
							/>
						)}
					</ErrorBoundary>
				</div>

				<footer className="mt-6 rounded border border-slate-700/80 bg-slate-950/70 p-4 text-xs leading-relaxed text-slate-400 shadow-xl shadow-black/20 backdrop-blur">
					Level 0 means not printed/unlocked yet. Shelter License controls which items and upgrade
					levels are visible and counted: base items follow [1, 3, 5, 6, 7, 8], while later unlocks
					stay hidden until their unlock Shelter level. Board-unlocked Level 1 weapons use 0 Lim / 0
					Lunum at Level 1 because their first level is listed as a board unlock rather than a
					direct Unit Printer purchase. Weapon images are served from local app assets and silently
					disappear if an asset fails to load.
				</footer>
			</div>
		</main>
	);
}
