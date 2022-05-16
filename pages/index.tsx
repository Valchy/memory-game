import type { GetStaticProps } from 'next';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import Buttons from '@components/Buttons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { GameMode } from '@mytypes';

interface GameMenuProps {
	gameModes: GameMode[];
}

const GameMenu = () => {
	return (
		<Layout key="menu">
			<motion.h2 exit={{ opacity: 0 }} className="mb-4">
				Please choose a game mode
			</motion.h2>
			<Buttons
				arr={[
					{ href: '/game/easy', text: 'Beginner Freindly' },
					{ href: '/game/medium', text: 'A good challenge' },
					{ href: '/game/hard', text: 'Experts only' },
				]}
			/>
		</Layout>
	);
};

// export const getStaticProps: GetStaticProps = async (context) => {
// 	const { data } = await client.query({
// 		query: gql`
// 			query {
// 				gameModes {
// 					id
// 					label
// 					difficulty
// 					tiles
// 				}
// 			}
// 		`,
// 	});

// 	return {
// 		props: {
// 			gameModes: data.gameModes,
// 		},
// 	};
// };

export default GameMenu;
