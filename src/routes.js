
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
    {
        meta: {
          title: 'Home'
        },
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
    {
        meta: {
          title: 'Student Course List'
        },
        path: '/scourselist',
        name: 'Student Course List',
        component: () => import('@/views/scourselist.vue')
      },
      {
        meta: {
          title: 'Deposit Form'
        },
        path: '/depositform',
        name: 'Deposit Form',
        component: () => import('@/views/depositform.vue')
      },
      {
        meta: {
          title: 'Deposit List'
        },
        path: '/depositlist',
        name: 'Deposit List',
        component: () => import('@/views/depositlist.vue')
      },
      {
        meta: {
          title: 'Reg Code List'
        },
        path: '/regcode',
        name: 'Reg Code List',
        component: () => import('@/views/regcode.vue')
      },
      {
        meta: {
          title: 'Daywise Cash Payment List'
        },
        path: '/daywisepayment',
        name: 'Daywise Cash Payment List',
        component: () => import('@/views/daywisepayment.vue')
      },
      {
        meta: {
          title: 'Wrong Update List'
        },
        path: '/wrongupdate',
        name: 'Wrong Update List',
        component: () => import('@/views/wrongupdate.vue')
      },
      {
        meta: {
          title: 'Search & Pay'
        },
        path: '/searchpay',
        name: 'Search & Pay',
        component: () => import('@/views/searchpay.vue')
      },
      {
        meta: {
          title: 'Bank Device Settlement'
        },
        path: '/devicesettlementform',
        name: 'Bank Device Settlement',
        component: () => import('@/views/devicesettlementform.vue')
      },
      {
        meta: {
          title: 'Settlement Statement List'
        },
        path: '/settlementlist',
        name: 'Settlement Statement List',
        component: () => import('@/views/settlementlist.vue')
      },
      {
        meta: {
          title: 'Payment Summary'
        },
        path: '/summary',
        name: 'Payment Summary',
        component: () => import('@/views/summary.vue')
      },
      {
        meta: {
          title: 'Student Receipt'
        },
        path: '/invoice/:paymentid',
        name: 'Student Receipt',
        component: () => import('@/views/invoice.vue')
      },
      {
        meta: {
          title: 'Daywise Card Payment List'
        },
        path: '/carddaywisepayment',
        name: 'Daywise Card Payment List',
        component: () => import('@/views/CardDaywise.vue')
      },
      {
        path: '/approve_update',
        meta: { title: 'Approve Wrong Updates' },
        component: () => import('@/views/ApproveUpdate.vue'),
      },
      {
        path: '/card_payments',
        meta: { title: 'Card Payment Students' },
        component: () => import('@/views/CardstudentList.vue'),
      },
      {
        path: '/unsettled_payments',
        meta: { title: 'Unsettle Payments List' },
        component: () => import('@/views/UnsettlestudentList.vue'),
      },
      {
        path: '/addenquiry',
        meta: { title: 'Add Enquiry' },
        component: () => import('@/views/AddEnquiry.vue'),
      },
      {
        path: '/invoice_list',
        meta: { title: 'Invoice List' },
        component: () => import('@/views/InvoiceNumbers.vue'),
      },
      {
        path: '/concessionlist',
        meta: { title: 'Concession List' },
        component: () => import('@/views/ConcessionList.vue'),
      },
      {
        path: '/concession',
        meta: { title: 'Concession' },
        component: () => import('@/views/ConcessionForm.vue'),
      },
      // {
      //   path: '/forgot_password',
      //   meta: { title: 'ForgotPassword' },
      //   component: () => import('@/views/ForgotPassword.vue'),
      // },
    {
        meta: {
            title: 'Login',
            formScreen: true
        },
        path: '/login',
        name: 'login',
        component: Login
    },
    { path: '/:path(.*)', component: NotFound },
]