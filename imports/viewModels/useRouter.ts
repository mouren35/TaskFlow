// useRouter.ts
// 路由相关的 ViewModel 逻辑

import { useHistory, useLocation, useParams } from "react-router-dom";

export function useRouter() {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  return { history, location, params };
}
