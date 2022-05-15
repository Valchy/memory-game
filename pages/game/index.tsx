import type { NextPage } from 'next';
import Layout from '../../src/components/Layout';
import { motion } from 'framer-motion';

const Game: NextPage = () => {
	return (
		<Layout key="game">
			<motion.h1 exit={{ opacity: 0 }}>Game</motion.h1>
		</Layout>
	);
};

export default Game;
