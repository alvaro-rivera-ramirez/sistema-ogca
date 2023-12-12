import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import RequireAuth from './RequireAuth';
import { ROLE } from 'src/constants';
import { SurveyListContextProvider } from 'src/context/ListSurveyContext';
import { SurveyContextProvider } from 'src/context/SurveyProvider';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const SurveyListPage = lazy(() => import('src/pages/survey-list'));
export const IndicatorPage = lazy(() => import('src/pages/indicator'));
export const SurveyPage = lazy(() => import('src/pages/survey'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Page401 = lazy(() => import('src/pages/page-forbidden'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <RequireAuth allowedRoles={[ROLE.ADMINISTRADOR]}>
        </RequireAuth>
      ),
      children: [
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'indicadores', element: <IndicatorPage /> },
        {
          path: 'lista-fichas',
          element: (
            <SurveyListContextProvider>
              <SurveyListPage />
            </SurveyListContextProvider>
          ),
        },
      ],
    },
    {
      element: (
        <RequireAuth allowedRoles={[ROLE.ADMINISTRADOR, ROLE.USUARIO]}>
        </RequireAuth>
      ),
      children: [
        { element: 
          <SurveyListContextProvider>
            <IndexPage />
          </SurveyListContextProvider>
        , index: true },
        { path: 'blog', element: <BlogPage /> },
        {
          path: 'ficha',
          element: (
            <SurveyContextProvider>
              <SurveyPage />
            </SurveyContextProvider>
          ),
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '401',
      element: <Page401 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
