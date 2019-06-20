import { PubSub } from 'apollo-server';
import { buildSchema } from 'type-graphql/dist';
import { authChecker } from '@graphql/auth-checker';

export const buildAppSchema = () => buildSchema({
  authChecker,
  resolvers: [__dirname + '/**/*.schema-resolver.ts'],
  pubSub: new PubSub()
});