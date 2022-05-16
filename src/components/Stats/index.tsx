import type { Context } from '@mytypes';

interface StatsProps {
	context: Context;
	tiles: number;
}

export default function Stats({ context, tiles }: StatsProps) {
	return (
		<div className="mt-8 text-center lg:text-left">
			<div className="top-3 left-3 flex flex-col lg:fixed">
				<h2 className="mb-3 text-xl">Global game stats:</h2>
				<span>Total played: 0</span>
			</div>

			<div className="top-3 right-4 flex flex-col text-center lg:fixed lg:text-right">
				<h2 className="mb-3 mt-6 text-xl lg:mt-0">Your stats:</h2>
				<span>
					Pairs Left: {context.pairs_left} / {tiles / 2}
				</span>
				<span>Time played: {context.game_time}</span>
				<span>Guesses: {context.guesses}</span>
			</div>
		</div>
	);
}
