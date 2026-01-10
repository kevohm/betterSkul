import { Route } from "../routes/__root";

const useAuth = () => {
  const data = Route.useLoaderData();
  const { userId, role, full_name } = data;

  return { userId, role, full_name };
};

export default useAuth;
