import type { GetStaticProps } from 'next';
import { memo, useCallback, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import memoryGameMachine from 'src/machines/memoryGameMachine';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import { motion } from 'framer-motion';
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
		// (() => send('START_GAME'))();
	}, [send]);

	let tempTiles: TileType[] = [];
	for (let i = 1; i <= gameMode.tiles; i++) {
		tempTiles.push({ guessed: false, active: false, index: 1 });
	}

	const [tiles, setTiles] = useState<TileType[]>(tempTiles);

	const toggleTile = useCallback((index: number): void => {
		tiles[index] = { ...tiles[index], active: !tiles[index].active };
		setTiles([...tiles]);
	}, []);

	return (
		<Layout key="game">
			<motion.h1 exit={{ opacity: 0 }}>Game mode: {gameMode.level}</motion.h1>

			<span>Game Time: {game.context.game_time}</span>

			<div className="grid grid-cols-4">
				{tiles.map((elm, index) => (
					<Tile tile={tiles[index]} toggleTile={toggleTile} index={index} key={`memory-game-tile-${index}`} />
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
	};

	return (
		<motion.div
			variants={animations}
			animate={tile.active ? 'spin' : 'close'}
			transition={{ duration: 0.5 }}
			onClick={() => toggleTile(index)}
			className="m-2 flex h-24 w-24 cursor-pointer select-none items-center justify-center rounded bg-[#181818] p-6 text-6xl font-bold text-[#404040]"
		>
			?
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
