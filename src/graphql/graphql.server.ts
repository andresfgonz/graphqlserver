import { ApolloServer } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { Context } from 'vm';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { ContextFunction } from 'apollo-server-core';

export class GraphqlServer {
  public port: string | number;
  public withPlayground: boolean;

  constructor(private schema: GraphQLSchema,
              private context?: ContextFunction<ExpressContext, Context> | Context) {
    this.port = 3000;
    this.withPlayground = true;
  }

  startServer() {
    const server = new ApolloServer({
      schema: this.schema,
      playground: this.withPlayground,
      context: this.context,
      subscriptions:{
        path: '/subscriptions'
      }
    });

    return server.listen(this.port)
  }
}