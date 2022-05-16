import type { GetStaticProps } from 'next';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import Buttons from '@components/Buttons';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import type { GameMode } from '@mytypes';

interface GameMenuProps {
	gameModes: GameMode[];
}

const GameMenu = ({ gameModes }: GameMenuProps) => {
	return (
		<Layout>
			<motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-4">
				Please choose a game mode
			</motion.h2>
			<Buttons arr={gameModes.map(({ difficulty, label }) => ({ href: `/game/${difficulty}`, text: label }))} />

			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
				<h2 className="my-4 text-center text-xl">Share with your friends</h2>
				<QRCode value="https://memory-game.valchy.com" />
			</motion.div>
		</Layout>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { data } = await client.query({
		query: gql`
			query {
				gameModes(orderBy: columns_ASC) {
					label
					difficulty
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

export default GameMenu;
