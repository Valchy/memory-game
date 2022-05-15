import type { NextPage, GetStaticProps } from 'next';
import { gql } from '@apollo/client';
import client from '@utils/graphql/client';
import Layout from '@components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Home: NextPage = ({ gameModes }) => {
	return (
		<Layout key="menu">
			<motion.h1 exit={{ opacity: 0 }}>Please choose a game mode</motion.h1>

			{gameModes.map(({ label, level, id }) => (
				<Link href={`/game`} key={id}>
					<a className="mb-2">{label}</a>
				</Link>
			))}
		</Layout>
	);
};

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

export default Home;
