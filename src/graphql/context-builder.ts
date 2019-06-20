import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { verify } from 'jsonwebtoken';
import { DBControllers } from '@db/db.types';

export const buildContext = (controllers: DBControllers) => async ({ req, connection }) => {
  let user: any;
  try {
    let token: string;
    if (connection) {
      token = connection.context.authorization;
    } else {
      token = req.headers.authorization;
    }
    const { userId }: any = verify(token, 'Secure4me');
    user = await controllers.userController.findbyId(userId);
  } catch (err) {
    user = null;
  }

  return { user, controllers };
};