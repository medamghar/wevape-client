import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { WebSocketLink } from '@apollo/client/link/ws';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getCollectionById: {
          keyArgs: ["id"],
          merge(existing, incoming) {
            if (!existing) return incoming;
            return {
              ...incoming,
              collection: {
                ...incoming.collection,
                products: [...existing.collection.products, ...incoming.collection.products],
              },
              nextCursor: incoming.nextCursor,
            };
          },
        },
      },
    },
  },
});

// Get the authentication token from secure storage
const token = async () => await AsyncStorage.getItem('@auth_token');

// Create the HTTP link
const httpLink = createHttpLink({
  uri: 'http://192.168.1.58:3000/graphql',
});
const authLink = setContext(async (_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: await token() ? `Bearer ${await token()}` : '',
    }
  };
});
// Create the WebSocket link
const wsLink = new WebSocketLink({
  uri: 'ws://192.168.1.58:3000/graphql',
  options: {
    reconnect: true,
    connectionParams: async () => {
      const authToken = await token();
      return {
        headers: {
          authorization: authToken ? `Bearer ${authToken}` : '',
        },
      };
    },
  },
});
// Create the auth link


// Combine the auth link with the http link
const link = authLink.concat(httpLink);

// Split the link based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  link,
);

// Create the Apollo Client instance
const client = new ApolloClient({
  link: splitLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default client;
