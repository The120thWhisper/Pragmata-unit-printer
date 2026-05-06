export function Icon({ name, className = "h-5 w-5" }) {
	if (name === "reset") {
		return (
			<svg
				className={className}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M3 12a9 9 0 1 0 3-6.7" />
				<path d="M3 4v6h6" />
			</svg>
		);
	}
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
		</svg>
	);
}
