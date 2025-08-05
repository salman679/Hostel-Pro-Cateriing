import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useAxiosPublic } from "./useAxiosPublic";

export default function useUserData() {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: userData = {}, isLoading } = useQuery({
    queryKey: ["user"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data;
    },
  });
  return { userData, isLoading };
}
