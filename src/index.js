import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const wsLink = new WebSocketLink({
    uri: 'wss://subscriptions.graph.cool/v1/cjcs1zksp3wo80153fcgk94q3',
    options: {
        reconnect: true
    }
});

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjcs1zksp3wo80153fcgk94q3' });

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});

const withApolloProvider = Comp => (
    <ApolloProvider client={client}>{Comp}</ApolloProvider>
);

ReactDOM.render(
    withApolloProvider(<App />),
    document.getElementById('root')
);
registerServiceWorker();
