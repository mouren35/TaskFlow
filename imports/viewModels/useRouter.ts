import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';

export function useRouter() {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<Record<string, string>>();
  
  const router = useMemo(() => {
    return {
      // 当前路由信息
      pathname: location.pathname,
      query: new URLSearchParams(location.search),
      params,
      
      // 导航方法
      push: (path: string) => history.push(path),
      replace: (path: string) => history.replace(path),
      goBack: () => history.goBack(),
      
      // 应用特定路由
      goToHome: () => history.push('/plan'),
      goToSchedule: () => history.push('/schedule'),
      goToThink: () => history.push('/think'),
      goToMy: () => history.push('/my'),
      goToPending: () => history.push('/pending'),
      goToSearch: (query?: string) => {
        if (query) {
          history.push(`/search?q=${encodeURIComponent(query)}`);
        } else {
          history.push('/search');
        }
      },
      goToTaskDetail: (taskId: string) => history.push(`/task/${taskId}`),
    };
  }, [history, location, params]);
  
  return router;
}
