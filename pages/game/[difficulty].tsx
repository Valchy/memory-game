import type { GetStaticPaths, GetStaticProps } from 'next';
import { memo, useCallback, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import memoryGameMachine from 'src/machines/memoryGameMachine';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Buttons from '@components/Buttons';
import Stats from '@components/Stats';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import type { TileType, TileProps, GameMode } from '@mytypes';

interface GameProps {
	gameMode: GameMode;
}

const Game = ({ gameMode }: GameProps) => {
	const [game, send] = useMachine(memoryGameMachine);
	const { width, height } = useWindowSize();
	const [gameOver, setGameOver] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);

	// Game shuffle logic
	const shuffleGameTiles = (): TileType[] => {
		return Array.from({ length: gameMode?.tiles }, (elm, index) => ({
			value: Math.floor(index / 2),
			guessed: false,
			active: false,
		})).sort(() => Math.random() - 0.5);
	};

	useEffect(() => {
		if (game.value === 'game_over') {
			setShowConfetti(true);
			setTimeout(() => {
				setGameOver(true);
				setShowConfetti(false);
			}, 4000);
		}
	}, [game.value]);

	useEffect(() => {
		(() => {
			send({ type: 'START_GAME', tiles: shuffleGameTiles() });
		})();
	}, [send]);

	const toggleTile = useCallback((index: number): void => {
		send({ type: 'TOGGLE_TILE', index });
		setTimeout(() => send({ type: 'GUESS' }), 1500);
	}, []);

	return (
		<Layout>
			<AnimatePresence exitBeforeEnter>
				{showConfetti && (
					<motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<Confetti width={width - 25} height={height - 25} style={{ marginLeft: '12.5px' }} />
					</motion.div>
				)}
			</AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				style={{ marginBottom: gameOver ? 48 : 16 }}
				className="flex flex-col text-center"
			>
				<motion.span>mode: {gameMode?.difficulty}</motion.span>
			</motion.div>

			{game.matches('game_over') && gameOver ? (
				<Buttons
					arr={[
						{ href: '/', text: 'Change difficulty' },
						{
							href: '#',
							text: 'Play again',
							event: () => {
								setGameOver(false);
								send({ type: 'PLAY_AGAIN', tiles: shuffleGameTiles() });
							},
						},
					]}
				/>
			) : (
				<div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${gameMode?.columns}, minmax(0, 1fr)` }}>
					{game.context.tiles.map((tile, index) => (
						<Tile tile={tile} index={index} toggleTile={toggleTile} key={`memory-game-tile-${index}`} />
					))}
				</div>
			)}

			<Stats context={game.context} tiles={gameMode?.tiles} />
		</Layout>
	);
};

const Tile = memo(({ tile, index, toggleTile }: TileProps) => {
	const animations = {
		spin: {
			rotate: 360,
			border: '2px solid orange',
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
			animate={tile.active || tile.guessed ? 'spin' : 'close'}
			transition={{ duration: 0.5 }}
			onClick={() => toggleTile(index)}
			className="m-2 flex h-16 w-16 cursor-pointer select-none items-center justify-center rounded bg-[#181818] p-4 text-3xl font-bold text-[#404040]"
		>
			<AnimatePresence>
				{(tile.active || tile.guessed) && (
					<motion.div variants={animations} animate="show" exit="hide">
						{tile.value}
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
	const { data } = await client.query({
		query: gql`
			query {
				gameModes {
					difficulty
				}
			}
		`,
	});

	return {
		paths: data.gameModes.map(({ difficulty }: { difficulty: number }) => ({ params: { difficulty } })),
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { data } = await client.query({
		query: gql`
			query {
				gameModes(where: { difficulty: "${params?.difficulty}" }) {
					columns
					difficulty
					tiles
				}
			}
		`,
	});

	return {
		props: {
			gameMode: data.gameModes[0],
		},
	};
};

export default Game;
