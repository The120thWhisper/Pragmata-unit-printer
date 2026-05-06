import { Component } from "react";

export class ErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		console.error("[PRAGMATA] render error", error, info);
	}

	render() {
		if (this.state.error) {
			return (
				<div className="rounded border border-red-400/50 bg-red-950/40 p-6 text-sm text-red-100 shadow-2xl shadow-black/30">
					<h2 className="text-base font-black uppercase tracking-widest">Something went wrong</h2>
					<p className="mt-2 text-red-200/80">
						{String(this.state.error?.message ?? this.state.error)}
					</p>
					<p className="mt-3 text-xs text-red-200/60">
						Try reloading the page. If this persists, check the browser console for details.
					</p>
				</div>
			);
		}
		return this.props.children;
	}
}
