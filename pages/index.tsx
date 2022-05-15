import type { NextPage } from 'next';
import Layout from '../src/components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';

const gameModes = [
	{
		label: 'beginner freindly',
		level: 'easy',
		tiles: 16,
	},
	{
		label: 'a good challenge',
		level: 'medium',
		titles: 25,
	},
	{
		label: 'experts only',
		level: 'hard',
		tiles: 36,
	},
];

const Home: NextPage = () => {
	return (
		<Layout key="menu">
			<motion.h1 exit={{ opacity: 0 }}>Please choose a game mode</motion.h1>

			{gameModes.map(({ label, level }) => (
				<Link href={`/game/${level}`}>{label}</Link>
			))}
		</Layout>
	);
};

export default Home;
