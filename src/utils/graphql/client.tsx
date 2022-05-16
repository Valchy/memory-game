import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
	uri: 'https://api-eu-central-1.graphcms.com/v2/cl390pv7d0lv701z2ahd5e39d/master',
	cache: new InMemoryCache(),
});

export default client;
