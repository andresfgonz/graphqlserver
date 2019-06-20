import { AuthChecker } from 'type-graphql/dist';

export const authChecker: AuthChecker<{ as: string }> = (
  { root, args, context, info },
  roles,
) => {
  return true;
};