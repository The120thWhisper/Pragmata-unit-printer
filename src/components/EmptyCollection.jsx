export function EmptyCollection({ collection }) {
	return (
		<section className="rounded border border-slate-700/80 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
			<h2 className="text-2xl font-black uppercase tracking-widest text-slate-50">
				{collection.label}
			</h2>
			<p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
				{collection.empty}
			</p>
			<p className="mt-3 text-xs uppercase tracking-[0.2em] text-cyan-100">Run npm run config</p>
		</section>
	);
}
