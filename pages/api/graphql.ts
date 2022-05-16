import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import type { NextApiRequest, NextApiResponse } from 'next';
import { gql, ApolloServer } from 'apollo-server-micro';

const typeDefs = gql`
	type GameStats {
		gamesPlayed: Int
	}

	type Query {
		gameStats: GameStats
	}
`;

const resolvers = {
	Query: {
		gameStats: () => {
			return 1;
		},
	},
};

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await startServer;
	await apolloServer.createHandler({
		path: '/api/graphql',
	})(req, res);
}

export const config = {
	api: {
		bodyParser: false,
	},
};
