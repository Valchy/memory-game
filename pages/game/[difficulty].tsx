import type { GetStaticPaths, GetStaticProps } from 'next';
import { memo, useCallback, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import memoryGameMachine from 'src/machines/memoryGameMachine';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import type { TileType } from '@mytypes';
import Buttons from '@components/Buttons';

const gameMode = {
	label: 'beginner freindly',
	difficulty: 'easy',
	tiles: 36,
	columns: 6,
	id: 1,
};

const Game = () => {
	const [game, send] = useMachine(memoryGameMachine);

	useEffect(() => {
		(() => {
			let tiles: TileType[] = Array.from({ length: gameMode.tiles }, (elm, index) => ({
				number: Math.floor(index / 2),
				guessed: false,
				active: false,
			})).sort(() => Math.random() - 0.5);

			send({ type: 'START_GAME', tiles });
		})();
	}, [send]);

	const toggleTile = useCallback((index: number) => {
		send({ type: 'TOGGLE_TILE', index });
		send({ type: 'GUESS', index });
	}, []);

	return (
		<Layout key="game">
			<motion.h2 animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: game.matches('game_over') ? 48 : 16 }}>
				mode: {gameMode.difficulty}, guesses: {game.context.guesses}, time: {game.context.game_time}
			</motion.h2>

			{game.matches('game_over') ? (
				<Buttons
					arr={[
						{ href: '/', text: 'Change difficulty' },
						{ href: '#', text: 'Play again' },
					]}
				/>
			) : (
				<div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${gameMode.columns}, minmax(0, 1fr)` }}>
					{game.context.tiles.map((tile, index) => (
						<Tile tile={tile} index={index} toggleTile={toggleTile} key={`memory-game-tile-${index}`} />
					))}
				</div>
			)}
		</Layout>
	);
};

interface TileProps {
	tile: TileType;
	index: number;
	toggleTile: (index: number) => void;
}

const Tile = memo(({ tile, index, toggleTile }: TileProps) => {
	console.log('rendered: ', tile.active);

	const animations = {
		spin: {
			rotate: 360,
		},
		close: {
			rotate: 0,
		},
		show: { opacity: 1 },
		hide: { opacity: 0 },
	};

	return (
		<motion.div
			variants={animations}
			animate={tile.active ? 'spin' : 'close'}
			transition={{ duration: 0.5 }}
			onClick={() => toggleTile(index)}
			className="m-2 flex h-16 w-16 cursor-pointer select-none items-center justify-center rounded bg-[#181818] p-4 text-3xl font-bold text-[#404040]"
		>
			<AnimatePresence>
				{tile.active && (
					<motion.div variants={animations} animate="show" exit="hide">
						{tile.number}
					</motion.div>
				)}
				{tile.active || (
					<motion.div className="text-4xl" variants={animations} animate="show" exit="hide">
						?
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
});

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: ['easy', 'medium', 'hard'].map((difficulty) => ({ params: { difficulty } })),
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async () => {
	// const { data } = await client.query({
	// 	query: gql`
	// 		query {
	// 			gameModes {
	// 				id
	// 				label
	// 				difficulty
	// 				tiles
	// 			}
	// 		}
	// 	`,
	// });

	return {
		props: {
			gameModes: ['easy', 'medium', 'hard'],
		},
	};
};

export default Game;
