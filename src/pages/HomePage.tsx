import { useCurrentUser } from "../features/auth/hooks/use-current-user";
import { useLogout } from "../features/auth/hooks/use-logout";
import { useNavigate } from "react-router";
import { HomePage as HomePageFeature } from "../features/home/HomePage";

export function HomePage() {
  const { data } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  }

  return <HomePageFeature />;
}
