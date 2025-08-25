// useRouter.ts
// 路由相关的 ViewModel 逻辑

import { useNavigate, useLocation, useParams } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return { navigate, location, params };
}
