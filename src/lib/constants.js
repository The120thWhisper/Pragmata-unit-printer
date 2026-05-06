export const TYPE_COLORS = {
	Attack: {
		bar: "bg-red-500",
		border: "border-red-400/50",
		glow: "shadow-red-950/30",
		text: "text-red-100",
		soft: "bg-red-500/10",
	},
	Tactical: {
		bar: "bg-emerald-400",
		border: "border-emerald-300/50",
		glow: "shadow-emerald-950/30",
		text: "text-emerald-100",
		soft: "bg-emerald-400/10",
	},
	Defensive: {
		bar: "bg-cyan-400",
		border: "border-cyan-300/50",
		glow: "shadow-cyan-950/30",
		text: "text-cyan-100",
		soft: "bg-cyan-400/10",
	},
	Node: {
		bar: "bg-yellow-300",
		border: "border-yellow-200/50",
		glow: "shadow-yellow-950/30",
		text: "text-yellow-100",
		soft: "bg-yellow-300/10",
	},
	Mode: {
		bar: "bg-blue-400",
		border: "border-blue-300/50",
		glow: "shadow-blue-950/30",
		text: "text-blue-100",
		soft: "bg-blue-400/10",
	},
	Ability: {
		bar: "bg-violet-300",
		border: "border-violet-200/50",
		glow: "shadow-violet-950/30",
		text: "text-violet-100",
		soft: "bg-violet-300/10",
	},
	Attachment: {
		bar: "bg-lime-300",
		border: "border-lime-200/50",
		glow: "shadow-lime-950/30",
		text: "text-lime-100",
		soft: "bg-lime-300/10",
	},
	Default: {
		bar: "bg-slate-300",
		border: "border-slate-400/50",
		glow: "shadow-slate-950/30",
		text: "text-slate-100",
		soft: "bg-slate-400/10",
	},
};

export const COLLECTION_META = {
	weapon: {
		label: "Weapons",
		itemLabel: "weapon",
		imageFolder: "images/weapon",
		empty: "Add weapons in the local config panel to populate this tab.",
	},
	hacking: {
		label: "Hacking",
		itemLabel: "hack",
		imageFolder: "images/hacking",
		empty: "Add hacking nodes and modes in the local config panel to populate this tab.",
	},
	ability: {
		label: "Abilities",
		itemLabel: "ability",
		imageFolder: "images/ability",
		empty: "Add abilities in the local config panel to populate this tab.",
	},
	attachment: {
		label: "Attachments",
		itemLabel: "attachment",
		imageFolder: "images/attachment",
		empty: "Add attachments in the local config panel to populate this tab.",
	},
};

export const ORANGE_COMPLETE = "bg-gradient-to-r from-yellow-300 to-orange-500";
export const OWNED_BAR = "bg-slate-100";
export const EMPTY_BAR = "bg-slate-400/40";
export const NEXT_BAR = "bg-red-600";
export const LOCKED_BAR = "bg-slate-950";

export const MIN_SHELTER_LEVEL = 1;
export const MAX_SHELTER_LEVEL = 5;
export const BASE_SHELTER_CAPS = [1, 3, 5, 6, 7, 8];

export const STORAGE_KEY = "pragmata-unit-printer:state:v1";

export const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
