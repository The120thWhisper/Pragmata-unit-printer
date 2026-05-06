import { publicAsset } from "../lib/constants";

export function ResourceIcon({ type }) {
	if (type === "lim") {
		return (
			<img
				src={publicAsset("images/Lim.webp")}
				alt="Lim"
				width="64"
				height="64"
				loading="lazy"
				decoding="async"
				className="inline-block h-4 w-4 object-contain align-[-2px]"
			/>
		);
	}
	return (
		<span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-lime-100 bg-gradient-to-br from-lime-200 via-yellow-200 to-emerald-300 text-[9px] font-black text-slate-900">
			✣
		</span>
	);
}
