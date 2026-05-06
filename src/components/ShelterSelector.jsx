import { BASE_SHELTER_CAPS, MAX_SHELTER_LEVEL, MIN_SHELTER_LEVEL } from "../lib/constants";

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
}

function describeArc(centerX, centerY, radius, startAngle, endAngle) {
	const start = polarToCartesian(centerX, centerY, radius, endAngle);
	const end = polarToCartesian(centerX, centerY, radius, startAngle);
	const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
	return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function ShelterSelector({ shelterLevel, onChange }) {
	const currentShelterLevel = Math.max(
		MIN_SHELTER_LEVEL,
		Math.min(MAX_SHELTER_LEVEL, shelterLevel),
	);
	const nextLevel =
		currentShelterLevel >= MAX_SHELTER_LEVEL ? MIN_SHELTER_LEVEL : currentShelterLevel + 1;
	const segments = Array.from({ length: MAX_SHELTER_LEVEL }, (_, index) => {
		const start = index * 72 + 4;
		const end = (index + 1) * 72 - 4;
		const filled = index < currentShelterLevel;
		return (
			<path
				key={index}
				d={describeArc(50, 50, 43, start, end)}
				fill="none"
				stroke={filled ? "#a7fff6" : "#17202b"}
				strokeWidth="7"
				strokeLinecap="round"
				className={filled ? "drop-shadow-[0_0_5px_rgba(167,255,246,0.85)]" : ""}
			/>
		);
	});

	return (
		<div className="flex items-center gap-3 rounded border border-cyan-200/20 bg-black/30 px-3 py-2">
			<button
				type="button"
				onClick={() => onChange(nextLevel)}
				className="group relative h-20 w-20 shrink-0 rounded-full bg-black shadow-[0_0_24px_rgba(34,211,238,0.2)] ring-1 ring-cyan-200/20 transition hover:ring-cyan-100/70 focus:outline-none focus:ring-2 focus:ring-cyan-100"
				aria-label={`Shelter License level ${currentShelterLevel}. Click to set level ${nextLevel}.`}
				title={`Shelter License Lv ${currentShelterLevel}`}
			>
				<svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
					<circle cx="50" cy="50" r="36" fill="#020807" stroke="#050b0d" strokeWidth="4" />
					{segments}
					<path
						d="M28 37 C31 25 45 25 48 38"
						fill="none"
						stroke="#c9fff4"
						strokeWidth="8"
						strokeLinecap="round"
						className="drop-shadow-[0_0_5px_rgba(167,255,246,0.9)]"
					/>
					<path
						d="M58 38 C61 26 75 26 78 39"
						fill="none"
						stroke="#c9fff4"
						strokeWidth="8"
						strokeLinecap="round"
						className="drop-shadow-[0_0_5px_rgba(167,255,246,0.9)]"
					/>
					<path
						d="M31 62 C41 73 61 76 75 62"
						fill="none"
						stroke="#c9fff4"
						strokeWidth="9"
						strokeLinecap="round"
						className="drop-shadow-[0_0_5px_rgba(167,255,246,0.9)]"
					/>
				</svg>
			</button>
			<div className="min-w-0">
				<div className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100">
					Shelter
				</div>
				<div className="mt-1 text-3xl font-black tabular-nums text-slate-50">
					Lv {currentShelterLevel}
				</div>
				<div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
					cap{" "}
					{currentShelterLevel === MAX_SHELTER_LEVEL
						? "max"
						: BASE_SHELTER_CAPS[currentShelterLevel]}
				</div>
			</div>
		</div>
	);
}
