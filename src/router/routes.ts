import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/todo',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/TodoPage.vue') }],
  },
  {
    path: '/print',
    children: [{ path: '', component: () => import('pages/ReceiptPage.vue') }],
  },
  {
    path: '/printlist',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PrintListPage.vue') }],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UserPage.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
