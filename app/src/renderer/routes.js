import LandingPageView from 'components/LandingPageView';

export default [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPageView
  },
  {
    path: '*',
    redirect: '/'
  }
];
