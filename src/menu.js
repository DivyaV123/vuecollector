import {
  mdiBank,
  mdiCashMultiple,
  mdiAccountCash,
  mdiFormSelect,
  mdiReceipt,
  mdiViewList,
  mdiAccountSearch,
  mdiFileChart,
  mdiCheckboxMarkedCircle,
  mdiCloseBox,

    mdiLock,
    mdiSquareEditOutline,
    mdiTable,
    mdiThemeLightDark,
    mdiCreditCard,
  } from '@mdi/js'
  
  export default [
    'Fee Collector',
  [
    {
      label: 'Search & Pay',
      to: '/searchpay',
      icon: mdiAccountSearch,
    },
    {
      label: 'Bank',
      icon: mdiBank,
      menu: [
        {
          label: 'Bank Deposit Form',
          to: '/depositform',
          icon: mdiFormSelect,
        },
        {
          label: 'Bank Deposit List',
          to: '/depositlist',
          icon: mdiTable,
        }
      ]
    },
    {
      label: 'Settlement',
      icon: mdiCashMultiple,
      menu: [
        {
          label: 'Settlement Form',
          to: '/devicesettlementform',
          icon: mdiFormSelect,
        },
        {
          label: 'Settlement List',
          to: '/settlementlist',
          icon: mdiTable,
        },
      ]
    },
    // {
    //   label: 'Merchant Copy List',
    //   icon: mdiReceipt,
    //   menu:[
    //     {
    //       label: 'Unmapped Merchant Copy List',
    //       to: '/merchantcopylist',
    //       icon: mdiCloseBox,
    //     },
    //     {
    //       label: 'Mapped Merchant Copy List ',
    //       to: '/mmcopylist',
    //       icon: mdiCheckboxMarkedCircle,
    //     }
    //   ]
    // },
    

    {
      label: 'Daywise Payment',
      icon: mdiAccountCash,
      menu: [
        {
          label: 'Daywise Cash Payment',
          to: '/daywisepayment',
          icon: mdiAccountCash,
        },
        {
          label: 'Daywise Card Payment',
          to: '/carddaywisepayment',
          icon: mdiCreditCard,
        },
        {
          label: 'Cancelled Receipt List ',
          to: '/wrongupdate',
          icon: mdiTable,
        },
        {
          label: 'Approve Wrong Updates ',
          to: '/approve_update',
          icon: mdiCheckboxMarkedCircle,
        }
      ]
    },

    {
      label: 'Reg Code List',
      to: '/regcode',
      icon: mdiViewList,
    },

    {
      label: 'Payment Summary',
      to: '/summary',
      icon: mdiFileChart,
    },



  ]
]