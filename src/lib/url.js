import { COLLECTION_META, MAX_SHELTER_LEVEL, MIN_SHELTER_LEVEL } from "./constants";

const KNOWN_TABS = new Set(Object.keys(COLLECTION_META));

export function readUrlState() {
	if (typeof window === "undefined") return {};
	const params = new URLSearchParams(window.location.search);
	const tabParam = params.get("tab");
	const shelterParam = Number(params.get("shelter"));
	return {
		tab: tabParam && KNOWN_TABS.has(tabParam) ? tabParam : null,
		shelter:
			Number.isFinite(shelterParam) &&
			shelterParam >= MIN_SHELTER_LEVEL &&
			shelterParam <= MAX_SHELTER_LEVEL
				? shelterParam
				: null,
	};
}

export function writeUrlState({ tab, shelter }) {
	if (typeof window === "undefined") return;
	const params = new URLSearchParams(window.location.search);
	params.set("tab", tab);
	params.set("shelter", String(shelter));
	const newUrl = `${window.location.pathname}?${params}${window.location.hash}`;
	window.history.replaceState(null, "", newUrl);
}
