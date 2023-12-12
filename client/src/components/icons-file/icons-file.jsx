import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

export const navConfigAdmin = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'fichas',
    path: '/lista-fichas',
    icon: icon('ic_user'),
  },
  {
    title: 'indicadores',
    path: '/indicadores',
    icon: icon('ic_user'),
  },
];

export const navConfigUser = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },

];
