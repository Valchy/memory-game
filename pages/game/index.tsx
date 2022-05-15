import type { GetStaticProps } from 'next';
import { memo, useCallback, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import memoryGameMachine from 'src/machines/memoryGameMachine';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import type { TileType } from '@mytypes';

const gameMode = {
	label: 'beginner freindly',
	level: 'easy',
	tiles: 16,
	columns: 4,
	id: 1,
};

const Game = () => {
	const [game, send] = useMachine(memoryGameMachine);

	useEffect(() => {
		(() =>
			send({
				type: 'START_GAME',
				tiles: [
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
					{ guessed: false, active: false },
				],
			}))();
	}, [send]);

	const toggleTile = useCallback((index: number) => send({ type: 'TOGGLE_TILE', index }), []);

	return (
		<Layout key="game">
			<motion.h1 exit={{ opacity: 0 }}>Game mode: {gameMode.level}</motion.h1>

			<span>Game Time: {game.context.game_time}</span>

			<div className="grid grid-cols-4">
				{game.context.tiles.map((tile, index) => (
					<Tile tile={tile} toggleTile={toggleTile} index={index} key={`memory-game-tile-${index}`} />
				))}
			</div>
		</Layout>
	);
};

interface TileProps {
	index: number;
	tile: TileType;
	toggleTile: (index: number) => void;
}

const Tile = memo(({ index, tile, toggleTile }: TileProps) => {
	console.log('rendered: ', index, tile.active);

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
			className="m-2 flex h-24 w-24 cursor-pointer select-none items-center justify-center rounded bg-[#181818] p-6 text-6xl font-bold text-[#404040]"
		>
			<AnimatePresence>
				{tile.active && (
					<motion.div variants={animations} animate="show" exit="hide">
						{index}
					</motion.div>
				)}
				{tile.active || (
					<motion.div variants={animations} animate="show" exit="hide">
						?
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
});

export const getStaticProps: GetStaticProps = async (context) => {
	const { data } = await client.query({
		query: gql`
			query {
				gameModes {
					id
					label
					level
					tiles
				}
			}
		`,
	});

	return {
		props: {
			gameModes: data.gameModes,
		},
	};
};

export default Game;
