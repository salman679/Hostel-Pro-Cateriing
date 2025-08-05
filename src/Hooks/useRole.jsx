import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useAuth } from "../contexts/AuthContext";

const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data: role = [], isLoading } = useQuery({
    queryKey: [user?.email, "role"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/role/${user?.email}`);

      return data?.role;
    },
  });

  return [role, isLoading];
};

export default useRole;
