import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import type { NextApiRequest, NextApiResponse } from 'next';
import { gql, ApolloServer } from 'apollo-server-micro';
import gameModes from './game_modes';

const typeDefs = gql`
	type GameMode {
		level: String
		label: String
		tiles: Int
		id: ID
	}

	type Query {
		gameModes: [GameMode]
		gameMode(id: ID!): GameMode
	}

	type GameStats {
		gamesPlayed: Int
	}

	type Subscription {
		gameStats: GameStats
	}
`;

const resolvers = {
	Query: {
		gameModes: () => {
			return gameModes;
		},
		gameMode: (chosenId: number) => {
			console.log(chosenId);
			return gameModes.find(({ id }) => id === chosenId);
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
