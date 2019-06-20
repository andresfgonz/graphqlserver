import 'reflect-metadata';
import 'module-alias/register';
import { buildAppSchema } from '@schema/schema-builder';
import { GraphqlServer } from './graphql/graphql.server';
import { DbConnection } from './db/db.connection';
import { dbConfig } from './db/db.config';
import { buildContext } from './graphql/context-builder';

async function bootstrap() {
  const db = new DbConnection(dbConfig);

  await db.connect();

  console.log('Database connected');

  const context = buildContext(db.controllers);
  const schema = await buildAppSchema();
  const server = new GraphqlServer(schema, context);

  await server.startServer();

  console.log(`Server started on http://localhost:${server.port}`);
}


bootstrap();