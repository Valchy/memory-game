import type { GetStaticProps } from 'next';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { GameMode } from '@mytypes';

interface GameMenuProps {
	gameModes: GameMode[];
}

const GameMenu = ({
	gameModes = [
		{
			label: 'Beginner Freindly',
			difficulty: 'easy',
			tiles: 16,
			id: '1',
		},
		{
			label: 'A good challenge',
			difficulty: 'medium',
			tiles: 36,
			id: '2',
		},
		{
			label: 'Experts only',
			difficulty: 'hard',
			tiles: 64,
			id: '3',
		},
	],
}: GameMenuProps) => {
	return (
		<Layout key="menu">
			<motion.h1 exit={{ opacity: 0 }} className="mb-4">
				Please choose a game mode
			</motion.h1>
			<motion.div transition={{ when: 'beforeChildren' }} className="flex cursor-pointer flex-col md:flex-row">
				{gameModes.map(({ label, difficulty, id }, index) => (
					<Link href={`/game/${difficulty}`} key={id}>
						<motion.a
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							whileTap={{ scale: 0.95 }}
							exit={{ scale: 1 }}
							transition={{ delay: index * 0.1 + 0.2 }}
							className="m-2 rounded bg-[#181818] p-6 hover:scale-[1.05]"
						>
							{label}
						</motion.a>
					</Link>
				))}
			</motion.div>
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
