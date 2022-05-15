import type { GetStaticProps } from 'next';
import { memo } from 'react';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import { motion } from 'framer-motion';

const gameMode = {
	label: 'beginner freindly',
	level: 'easy',
	tiles: 16,
	columns: 4,
	id: 1,
};

const Game = () => {
	return (
		<Layout key="game">
			<motion.h1 exit={{ opacity: 0 }}>Game mode: {gameMode.level}</motion.h1>

			<div className="grid grid-cols-4">
				{Array.from({ length: gameMode.tiles }, () => (
					<GameBox />
				))}
			</div>
		</Layout>
	);
};

const GameBox = memo(() => {
	console.log('rendered: ');

	return <div className="m-1 flex cursor-pointer select-none items-center justify-center bg-[#181818] p-6 text-6xl text-[#404040]">?</div>;
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
