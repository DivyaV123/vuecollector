<script setup>
import { ref, reactive, computed, onBeforeMount, onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import { mdiCash, mdiAccount, mdiMail, mdiCashMultiple, mdiCashCheck, mdiCreditCard, mdiIdentifier, mdiCity,mdiMore ,mdiPhone,mdiEmail,mdiCheckCircle} from '@mdi/js'
import Multiselect from '@vueform/multiselect'
import { selectClasses } from '@/selectcss.js'
import ModalBox from '@/components/ModalBox.vue'
import TitleSubBar from "@/components/TitleSubBar.vue";
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import UserCard from '@/components/UserCard.vue'
import Icon from '@/components/Icon.vue'
import TitleBar from '@/components/TitleBar.vue'
import CardComponent from '@/components/CardComponent.vue'
import Controlled from '@/components/Controlled.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import PaymentPreview from '@/components/PaymentPreview.vue'
import PaidTodayModal from '@/components/PaidTodayModal.vue'
import RepeaterPaypreview from '@/components/RepeaterPaypreview.vue'
import SelectcourseModal from '@/components/SelectcourseModal.vue'
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector";
import { collector_Store } from "../stores/collector2";
import { themeStore } from "../stores/theme"
import dayjs from 'dayjs';

const theme = themeStore();
const user = sessionStore();
const collector = collectorStore();
const collector2 = collector_Store();
const route = useRoute();
const router = useRouter();
const props = defineProps({
 course: Array,
})

const pageLoading = ref(false)
const isModalPaymentActive = ref(false);
const isModalBatchActive = ref(false);

const refundtotal = (val) => {
      let sum=0
      for(let i=0;i<val.length;i++){
        if(val[i].type === 'refund'){
          sum+=val[i].amount
        }
      }
      return sum
};

const cleartype=(type)=>{
  if(type.toLowerCase()==='cash'){
    form.authid='',
    form.cardno=''
  }
}

//payment details pagination
const perPage = ref(3);
const currentPage = ref(0)
// const paymentsCount = computed(() => collector.paymentdetails)
const paymentsPaginated = computed(() =>
          collector.paymentdetails
  // paymentsCount.value.slice(
  //   perPage.value * currentPage.value,
  //   perPage.value * (currentPage.value + 1)
  // )
);

const batchesPaginated = computed(() =>
          collector.courses.student_batches
  // paymentsCount.value.slice(
  //   perPage.value * currentPage.value,
  //   perPage.value * (currentPage.value + 1)
  // )
);
const numPages = computed(() => Math.ceil(paymentsCount.value.length/ perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1 );
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const regcodemodal = ref(true)
const page_loading = ref(false);

const brancherror = ref(false)
const hasError1 = ref(false)
const hasError2 = ref(false)
const hasError3 = ref(false)
const hasError4 = ref(false)
const hasError5 = ref(false)
const hasError6 = ref(false)

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const isSaveOpen = ref(true)
const isPrintOpen = ref(false)
const isconfirmpayActive = ref(false)

const courselength = computed(() => collector.courselen)

onBeforeMount(async () => {
 pageLoading.value = true
 if(route.query.email){
 pageLoading.value = true
 await collector.getCourses({"email": route.query.email})
 }
 else if(route.query.contact){
 // collector.getCourses({"contact": '%2B'+route.query.contact.trim() }) 
 await collector.getCourses({"contact": route.query.contact }) 
 }
 else{
     await collector.getCourses({"id": route.query.id})
 }
 pageLoading.value = false
 const date = dayjs(new Date).format("YYYY-MM-DDTHH:mm");
 form.date = date
 await collector.getPaymentType()
 if(courselength && courselength.value ===0){
    await collector2.get_RegCodes()
 }
 pageLoading.value = false
});

const course_name = ref("");
let params = ref('');
const search = reactive({ 
 course: ref("")
})

// const searchParams = async() => {
// if(course_name.value !== ""){
// if (course_name.value) {
// search.course = course_name;
// }
// params = new URLSearchParams(search).toString();
// currentPage.value=1
// await collector.getCourses(currentPage.value,route.params,params);
// }
// else{
// await collector.getCourses(currentPage.value,route.params); 
// }
// }

// const clear = async() => {
// params ='';
// course_name.value ='';
// search.name = '',
// await collector.getCourses(currentPage.value,route.params); 
// }


const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)

const items = computed(() => collector.courses);

const itemsCount = computed(() => collector.coursecount)

const payment_types = computed(() => 
{
  if(collector.paytype){
   return collector.paytype.filter(val => val.name.toLowerCase().includes("cash")|| val.name.toLowerCase().includes("card")) ;
  }
  // collector.paytype
  // return collector.paytype.splice(2)
}
)


const coursedetails = computed(() => collector.coursedetails)

const isModalActive = ref(false)

const isPayActive = ref(false)

const isPayFormActive = ref(false)
const isrepeaterActive = ref(false)

// const currentPage = ref(1)
//
// const numPages = computed(() => Math.ceil(itemsCount.value / perPage));

// const currentPageHuman = computed(() => currentPage.value + 1)

// const pagesList = computed(() => {
// const numShown = ref(5)
// for (let i = 1; i <= numPages.value; i++) {
// const num = Math.min(numShown.value,numPages.value);
// let first = currentPage.value - Math.floor(num / 2);
// first = Math.max(first, 1);
// first = Math.min(first, numPages.value - num + 1);
// return [...Array(num)].map((k,i) => i + first) 
// }
// })

// const pageChange =(page) => {
// currentPage.value = page; 
// if(params){
// collector.getCourses(currentPage.value,route.params,params);
// }
// else{
// collector.getCourses(currentPage.value,route.params);
// } 
// }

// const paymodal = Array({
//  cid: null,
//  courses: '',
//  payments:null,
//  branch: null,
//  oneshot: '',
//  oneshot_balance: '',
//  partial: '',
//  partial_balance:'',
 
// });

const changecourse =reactive({
 cid:null,
 courses:'',
 branch:null,
 oneshot_amount : '',
 oneshot_amount_balance : '',
 partial_amount : '',
 partial_amount_balance : '',
 modalamount : '',
 disable_one_shot_pay:''
})

const onpay = (id, courses, payments, branch,oneshot, oneshot_balance, partial, partial_balance, disable_one_shot_pay) =>{
//  paymodal.cid = id,
//  paymodal.courses = courses,
//  paymodal.payments = payments,
//  paymodal.branch = branch,
//  paymodal.oneshot = oneshot,
//  paymodal.oneshot_balance = oneshot_balance,
//  paymodal.partial = partial,
//  paymodal.partial_balance = partial_balance,

 changecourse.cid = id,
 changecourse.courses = courses,
 changecourse.branch = branch,
 changecourse.oneshot_amount = oneshot,
 changecourse.oneshot_amount_balance = oneshot_balance,
 changecourse.partial_amount = partial,
 changecourse.partial_amount_balance = partial_balance,
 changecourse.disable_one_shot_pay = disable_one_shot_pay,
 form.amount='',
 form.camount='',
 form.paymenttype=null,
 form.authid='',
 form.cardno=''
 isrepeaterActive.value = false
 isPayFormActive.value = true
}

// const repeatermodal = Array({
//  subject: '',
//  trainer: '',
//  fees:null,
// });

const changespayment =reactive({
 subjectid:null,
 subject: '',
 trainerid:null,
 trainer: '',
 fees:null,
})

const repeaterpay = (subjectid,subject,trainerid,trainer,fees) =>{
//  repeatermodal.subjectid = subjectid,
//  repeatermodal.subject = subject,
//  repeatermodal.trainerid = trainerid,
//  repeatermodal.trainer = trainer,
//  repeatermodal.fees = fees,
 
 changespayment.subjectid = subjectid,
 changespayment.subject = subject,
 changespayment.trainerid = trainerid,
 changespayment.trainer = trainer,
 changespayment.fees = fees, 
 isrepeaterActive.value = true
 isPayFormActive.value = true
}

const form = reactive({
 paymenttype:null,
 amount:'',
 camount:'',
 authid: '',
 cardno: '',
 date:'',
 branch:null,
 bcourse:null,
 cid:null,
 coursename:'', 
 })

const receiptdata = ref([])

const payamount = computed(()=> {
 return collector.pay
})

//add regcode if student has already joined
const reg_codes = computed(() => { return collector2.regsearch})
// const fetchRegcodes = async (filters) => {
//   filters = "[\"name\",\"like\",\"" + filters +"\"]";
//   let reg_codes= await collector2.get_RegCodes(filters);
//   return reg_codes
// };
const student_course=ref([])
const student_id=Array({
 "id":null
 })


const formdata = reactive({
 regcode:''
})
const reg_error = ref(false)
const show_course = ref(false)
const submitregcode = async () => {
   if(formdata.regcode === "")
      {
      reg_error.value = true
      }
   else if(!formdata.regcode.replace(/\s/g, '').length){
      reg_error.value = true
      theme.pushMessage("Please add the registration code");
      }
   else{
      try{
      pageLoading.value = true
      await collector.add_regcode({ "regcode": formdata.regcode.replaceAll("-",''),"student":items.value.id});
      pageLoading.value = false
      if(collector.st_regcode)
         {
         // if(collector.st_regcode.message===null){
         //    theme.pushMessage("You have added invalid Reg code..please add valid Reg code");
         // }
         if(collector.st_regcode==="Batch-code has been added."){
            theme.pushMessage("You have successfully added Batch-code");
            if(route.query){
              if(route.query.email){
                collector.getCourses({"email": route.query.email})
              }
              else if(route.query.contact){
                collector.getCourses({"contact": route.query.contact})
              }
              else if(route.query.id){
                collector.getCourses({"id": route.query.id})
              }
            }
        }
        else if(collector.st_regcode ==="Registration days are done Cant add Batch-Code now."){
            theme.pushMessage(collector.st_regcode);
        }
      // else if(collector.st_regcode.message&&collector.st_regcode.message.length&&collector.st_regcode.message.length!=0){
        else if(collector.st_regcode&&collector.st_regcode.length&&collector.st_regcode.length>1){
            show_course.value=true
            student_course.value=collector.st_regcode
            student_id.id=items.value.id
            theme.pushMessage("You have successfully added Reg Code please select the course");
         }
      }
      else{
         theme.pushMessage(collector.$state.error);
         collector.$state.error=""
         }
      }
      catch(err){
         pageLoading.value = true
         theme.pushMessage(collector.$state.error);
         pageLoading.value = false
         collector.$state.error=""
      }
   } 
}

const isalreadypaidpopup = ref(false)
const isnewpopup = ref(false)
const isrepeaterpopup = ref(false)

//isrepeaterActive.value == false
const propValues = Array({
 "name":"",
 "course":"",
 "sid":null,
 "cid":null,
 "bcourse":null,
 "amount":null,
 "type":"",
 "location":"",
 "date":"",
 "authid":"",
 "cardno":"",
 })

 const alreadypaidValues = Array({
 "amount":null,
 "type":"",
 "course":""
 })

//repeaterpayment
const prop_repValues = Array({
   "name":"",
 "sid":null,
 "amount":null,
 "type":"",
 "authid":"",
 "cardno":"",
 "bcourse":null,
 "location":"",
 "date":"",
 "repeater":true,
 "subject":null,
 "trainer":null
 })

//payment form submit and receipt
const redirectToUserView = async (receiptdata) => { 
 var w = window.open( `/invoice/${receiptdata}`, "_blank" );
};

const submit = async () => {
  let valid = true
  if(form.amount === ""){
  hasError2.value = true
  theme.pushErrorMessage("Amount field is mandatory!!!");
  valid = false
  } 
  if((form.amount<0 || form.amount === 0)){
  hasError2.value = true
  theme.pushErrorMessage("Amount entered should be greater than zero!!!");
  valid = false
  } 
  if(form.camount=== ""){
  hasError3.value = true
  theme.pushErrorMessage("Confirm Amount field is mandatory!!!");
  valid = false
  }
  if((form.amount != form.camount) || (form.amount && form.camount && String(form.amount).length!== form.camount.length)){
  hasError2.value = true
  hasError3.value = true
  theme.pushErrorMessage("Amount and Confirm Amount values are not equal!!!");
  valid = false
  }
  // if(form.amount && form.camount && String(form.amount).length!== form.camount.length){
  // hasError2.value = true
  // hasError3.value = true
  // theme.pushErrorMessage("Amount and Confirm Amount values are not equal!!!");
  // valid = false
  // }
  if(form.paymenttype === null){
  hasError1.value = true
  theme.pushErrorMessage("Payment Mode field is Mandatory!!!!");
  valid = false
  } 
  if(form.paymenttype.toLowerCase() === 'card' && form.authid=== ""){
  hasError4.value = true
  theme.pushErrorMessage("Auth ID field is mandatory");
  valid = false
  }
  if(form.paymenttype.toLowerCase() === 'card' && form.authid && form.authid.indexOf(' ') >= 0){
  hasError4.value = true
  theme.pushErrorMessage("Valid Auth ID is mandatory");
  valid = false
  }
  // console.log("form.authid",form.authid);
  // if(form.paymenttype.toLowerCase() === 'card' && form.authid && form.authid=== 0){
  // hasError4.value = true
  // theme.pushErrorMessage("Auth ID should be greater than zero");
  // valid = false
  // }
  if(form.paymenttype.toLowerCase() === 'card' && form.cardno === ""){
  hasError5.value = true
  theme.pushErrorMessage("Card Number field is mandatory");
  valid = false
  }
  if(form.paymenttype.toLowerCase() === 'card' && form.cardno && form.cardno.indexOf(' ') >= 0){
  hasError5.value = true
  theme.pushErrorMessage("Valid Card Number is mandatory");
  valid = false
  }
  if( isrepeaterActive.value ==false ){
  if(courselength.value==1){
  form.cid = coursedetails.value[0].id
  form.coursename = coursedetails.value[0].name
  form.bcourse = coursedetails.value[0].branch.branchid
  }
  else if(courselength.value>1){
  form.cid = changecourse.cid
  form.coursename = changecourse.courses
  for (let i = 0; i < courselength.value; i++) {
  if(changecourse.branch.branchid === items.value.student_course[i].branch.branchid){
  form.bcourse = items.value.student_course[i].branch.branchid 
  } 
  }
  }
 }
 // else if(items.value.studentcourse.length ==1){ 
 // form.bcourse = items.value.studentcourse[0].branch.branchid
 // }
 // else if(items.value.studentcourse.length >1){
 // for (let i = 0; i < items.value.studentcourse.length; i++) {
 // if(paymodal.branch.branchid === items.value.studentcourse[i].branch.branchid){
 // form.bcourse = items.value.studentcourse[i].branch.branchid 
 // } 
 // }
 // }
 // }
 // else{
 // hasError1.value = false
 // hasError2.value = false
 // hasError3.value = false
 // hasError4.value = false
 // hasError5.value = false
 // hasError6.value = false
 // brancherror.value = false
 // }
 // if(!hasError1.value & !hasError2.value & !hasError3.value & !hasError4.value & !hasError5.value & !brancherror.value & !hasError6.value){
 if(valid===true){
  try{
  if (isrepeaterActive.value==false) {
        const date= dayjs(new Date).format("DD-MM-YYYY HH:mm")
        propValues.name = items.value.name
        propValues.course = form.coursename
        propValues.sid = items.value.id
        propValues.cid = form.cid
        propValues.bcourse = form.bcourse
        propValues.amount = form.amount
        propValues.type = form.paymenttype
        propValues.location = "same_location"
        propValues.date = date
        propValues.authid = form.authid
        propValues.cardno = String(form.cardno)
        if(paymentsPaginated && paymentsPaginated.value && paymentsPaginated.value.length>0 && paymentsPaginated.value[0].payment_details && paymentsPaginated.value[0].payment_details.date && dayjs(paymentsPaginated.value[0].payment_details.date).format("DD-MMM-YY") === dayjs(new Date()).format("DD-MMM-YY")){
            alreadypaidValues.amount = paymentsPaginated.value[0].payment_details.amount
            alreadypaidValues.type = paymentsPaginated.value[0].payment_details.type
            alreadypaidValues.course = paymentsPaginated.value[0].course
           isalreadypaidpopup.value = true
        }
        else{
            isnewpopup.value = true
        }
  }
  else{
      const date= dayjs(new Date).format("DD-MM-YYYY HH:mm")
      prop_repValues.name = items.value.name
      prop_repValues.sid = items.value.id
      prop_repValues.amount = form.amount
      prop_repValues.type = form.paymenttype
      prop_repValues.authid = form.authid
      prop_repValues.cardno = String(form.cardno)
      prop_repValues.bcourse = form.bcourse
      prop_repValues.location = "same_location"
      prop_repValues.date = date
    //  prop_repValues.repeater = true
      prop_repValues.subject = changespayment.subjectid
      prop_repValues.subjectname = changespayment.subject
      prop_repValues.trainer = changespayment.trainerid
      isrepeaterpopup.value = true
      // isnewpopup.value = true
      // to_repeaterpay(items.value.id,form.amount,form.paymenttype,form.authid,String(form.cardno),form.bcourse,"same_location",date,true,changespayment.subjectid,changespayment.trainerid)
  }
 // if (isrepeaterActive.value==false) {
 // const date= dayjs(new Date).format("DD-MM-YYYY HH:mm"); 
 // pageLoading.value = true
 // await collector.getPay({"sid":items.value.id,"cid":form.cid,"bcourse":form.bcourse,"amount":form.amount,"type":form.paymenttype,"location":"same_location","date":date,"authid":form.authid,"cardno":String(form.cardno)
 // }); 
 // pageLoading.value = false
 // }
 // else{
 // const date= dayjs(new Date).format("DD-MM-YYYY HH:mm"); 
 // pageLoading.value = true
 // await collector.getPay({"sid":items.value.id,"bcourse":form.bcourse,"amount":form.amount,"type":form.paymenttype,"location":"same_location","date":date,"authid":form.authid,"cardno":String(form.cardno),"repeater":true,"subject":changespayment.subjectid,"trainer":changespayment.trainerid
 // }); 
 // pageLoading.value = false
 // }
 // if (collector.$state.error){
 // theme.pushErrorMessage(collector.$state.error);
 // await collector.removeError()
 // }
 // else if(JSON.parse(JSON.stringify(collector.$state.pay)).length != 0){ 
 // console.log("id data",JSON.parse(JSON.stringify(collector.$state.pay))); 
 // receiptdata.value = collector.$state.pay
 // isSaveOpen.value = false
 // pageLoading.value = true

 // setTimeout(function(){
 // isPrintOpen.value = true
 // theme.pushMessage(collector.$state.pay.message);
 // redirectToUserView(receiptdata.value.invoice)
 // pageLoading.value = true
 // router.push("/")
 // }, 1000); 
 // }
 // else{
 // theme.pushErrorMessage("Somthimg went wrong,try again!!");
 // }


 }
 catch(error){
    console.log("vue error",error) 
 }
 }
}
</script>


<template>
<payment-preview :propValues="propValues" v-if="isnewpopup == true" v-model="isnewpopup" title="Confirm Payment" >
</payment-preview>

<paid-today-modal :propValues="propValues" :alreadypaidValues="alreadypaidValues" v-if="isalreadypaidpopup == true" v-model="isalreadypaidpopup" title="Alert!" >
</paid-today-modal>

<!-- <repeater-paypreview :prop_repValues="prop_repValues" v-if="isrepeaterpopup == true" v-model="isrepeaterpopup" title="Confirm Repeater Payment" >
</repeater-paypreview> -->

<div v-if="pageLoading" wire:loading
 class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
 <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
 <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
 <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
 </div>

<div v-if="items && (items.length !=0 && items.id !=0)"> 
 <div class="flex gap-3 flex-wrap items-stretch">
 <div class="bg-gray-900 xl:w-[28%] lg:w-1/4 w-full">
 <div class="md:flex md:pb-8 md:px-0 px-2 lg:px-0 xl:px-0 py-2 w-full block justify-evenly blocksize flex-wrap">
 <card-component class="items-center w-full lg:m-auto " flex-column>
 <!-- <level> -->
 <div>
 <div class="xl:flex-nowrap lg:flex-wrap flex gap_decrease border-2 border-gray-700 rounded-lg shadow-md ml-0 overflow-x p-4 w-full xl:gap-8 lg:gap-8 gap-12 md:gap-1 md:pb-5 gap-decrease" >
 <div class="w-[70%]" >
 <figure class="justify-start" >
 <img v-if="items.image" :src="`https://gotest.qspiders.com/thumbnails/${items.thumbnail}`" class = " h-32 rounded-lg mr-auto lg:w-full xl:w-full" /> 
 <img v-else src="" alt="Student has not added the image" class = " h-28 rounded-lg mr-auto lg:w-full xl:w-full" />
 </figure> 
 </div> 

 <div class="ml:0 w-full"> 
 <p class="text-white text-base font-normal tracking-wide mb-1">
    <span class="text-yellow-200">
      <jb-button
          :icon="mdiAccount"
          small
          color="info"
        > 
      </jb-button>
    </span> 
    <span class="text-teal-200 text-sm">{{items.name}} 
      <span v-if="items.refunded" class="bg-neutral-200 text-black px-1 border rounded-md font-semibold">Refunded</span>
    </span> 
 </p> 

  <p class="text-white text-base font-normal tracking-wide mb-1">
    <span class="text-yellow-200">
      <jb-button
          :icon="mdiIdentifier"
          small
          color="info"
        > 
      </jb-button>
    </span> 
    <span class="text-teal-200 ml-1 text-sm">{{items.id}} </span> 
    <span v-if="items.incubation" class="text-cyan-300 border border-cyan-500 rounded text-xs mt-2 w-24 ml-2 p-1">INCUBATION</span><br>
    <span v-if="items.campusconnect" class="text-yellow-400 border border-yellow-400 mt-2 text-xs rounded w-32 p-1 ml-2">CAMPUS CONNECT</span>
 </p> 

 <div class="flex flex-row">
 <div v-for="mail in items.email" :key="mail" class="mb-1">
 <a class="" :href="'mailto:' + mail.email "> 
 <jb-button
 color="info"
 :icon="mdiEmail"
 small
 class="mr-1"
 />
 <!-- <span class="text-teal-200 text-sm">{{mail.email}}</span> -->
 </a> 
 </div> 
 </div>
 <div v-for="num in items.contact" :key="num">
 <a class="" :href="'tel:' + num.code +num.number "> 
 <jb-button
 color="info"
 :icon="mdiPhone"
 small
 class="mr-1"
 />
 <span class="text-teal-200 text-sm">{{num.number}}</span>
 </a> 
 </div>
 </div>
 </div>
 <!-- </level> -->
 </div>
 </card-component> 
 </div>
 </div>

<div v-if="(isPayFormActive || courselength == 1) && items.student_course != null" class="lg:w-[72%] xl:w-[70%] bg-gray-900 w-full"> 
 <card-component
 card-class="w-15/12 md:w-5/12 lg:w-5/12 xl:w-5/12 shadow-2xl"
 card-rounded="rounded-lg"
 form
 @submit.prevent="submit" 
 >
 <p v-if="courselength>1"> <span class="text-yellow-500"> Course:</span>
 <span v-if="courselength>1">{{changecourse.courses}}</span> 
 </p>
 <!-- <div v-if="isrepeaterActive == false" class="grid md:grid-cols-3 sm:grid-cols-2 gap-1"> -->
 <div v-if="isrepeaterActive == false" class="flex flex-wrap 2xl:gap-9 md:gap-7 gap-2">
    <div v-if="changecourse.disable_one_shot_pay==false || coursedetails[0].booleans.disable_one_shot_pay==false">
      <p v-if="courselength>1 && changecourse.disable_one_shot_pay==false"> <span class="text-yellow-500"> One Shot Amount : </span>
      <span>{{changecourse.oneshot_amount}}</span> 
      </p>
      <p v-if="courselength==1 && coursedetails[0].booleans.disable_one_shot_pay==false"> <span class="text-yellow-500"> One Shot Amount : </span>
          <span v-for="(det) in coursedetails"
        :key="det.id" >
            {{det.oneshot}}
        </span>
      </p>

      <p v-if="courselength>1 && changecourse.disable_one_shot_pay==false"> <span class="text-yellow-500">One Shot Balance : </span>
      <span>{{changecourse.oneshot_amount_balance}}</span>
      </p>

      <p v-if="courselength==1 && coursedetails[0].booleans.disable_one_shot_pay==false"> <span class="text-yellow-500">One Shot Balance : 
      </span>
      <span v-for="(det) in coursedetails"
      :key="det.id" >{{det.oneshot_balance}}</span>
      </p>
      </div>
  <!-- <div v-else></div> -->

  <div>
    <p> <span class="text-yellow-500">Installment Amount : </span>
    <span v-if="courselength>1">{{changecourse.partial_amount}}</span>
    <span v-else><span v-for="(det) in coursedetails"
    :key="det.id" >{{det.partial}}</span></span>
    </p>

    <p> <span class="text-yellow-500">Installment Balance : </span>
    <span v-if="courselength>1">{{changecourse.partial_amount_balance}}</span>
    <span v-else><span v-for="(det) in coursedetails"
    :key="det.id" >{{det.partial_balance}}</span></span>
    </p>
  </div>
  <!-- </div> -->

<div v-if="paymentsPaginated && paymentsPaginated.length > 0">
 <p> <span class="text-yellow-500">Latest Payment Date : </span>
 <span>{{dayjs(paymentsPaginated[0].payment_details.date).format('DD-MMM-YY h:mm A')}}</span>
 </p>
 </div>
 </div>

 <div v-if="isrepeaterActive == true" class="grid md:grid-cols-4 sm:grid-cols-2 gap-1 mt-2">
 <p> <span class="text-yellow-500">Target fees: </span> {{changespayment.fees}} </p>
 <p> <span class="text-yellow-500">Subject: </span> {{changespayment.subject}} </p>
 </div> 

 <div class="grid lg:grid-cols-3 sm:grid-cols-2 gap-1 md:grid-cols-3">
 <small>
 <field
 label="Amount"
 :error="hasError2"
 help="Enter the Amount Paid"
 class=" box-border w-50 p-1 border-2 border-gray-600"
 >
 <control
 v-model="form.amount"
 :error="hasError2"
 :icon-left="mdiCashMultiple"
 name="amount"
 placeholder="eg.36000"
 type="number"
 small
 />
 </field>
 </small>

 <small>
 <field
 label="Confirm Amount"
 :error="hasError3"
 help="Confirm the Amount Paid"
 class=" box-border w-50 p-1 border-2 border-gray-600"
 >
 <control
 v-model="form.camount"
 :error="hasError3"
 onpaste="return false"
 :icon-left="mdiCashCheck"
 name="camount"
 placeholder="eg.36000"
 type="password"
 autocomplete="new-password"
 />
 </field>
 </small>

 <small>
 <field label="Payment Mode" :error="hasError1" class=" box-border w-50 p-1 border-2 border-gray-600" help="Select the Payment Mode">
 <Multiselect :error="hasError1"
 placeholder = "Select the Payment Mode"
 v-model="form.paymenttype"
 :options="payment_types"
 valueProp = "name"
 label="name"
 searchable
 track-by = "name"
 :classes="selectClasses"
 @select="cleartype(form.paymenttype)"
 />
 </field>
 </small>
 </div>

 <div v-if="form.paymenttype">
 <div
 v-if="form.paymenttype.toLowerCase() === 'card'"
 class="grid md:grid-cols-3 sm:grid-cols-2 gap-1"
 > 
 <small>
 <field label="Auth ID (Approval Code)" :error="hasError4" help="Enter the Auth ID" class="box-border w-50 p-1 border-2 border-gray-600">
 <control
 v-model="form.authid"
 :error="hasError4"
 :icon-left="mdiIdentifier"
 name="authid"
 placeholder="Enter the Auth ID"
 />
 </field>
 </small>

 <small>
 <field
 label="Card Number from Merchant Copy"
 class="box-border w-50 p-1 border-2 border-gray-600"
 :error="hasError5"
 help="Enter the Card Number from Merchant Copy" 
 > 
 <control
 v-model="form.cardno"
 :error="hasError5"
 :icon-left="mdiCreditCard"
 name="cardno"
 placeholder="Card Number from Merchant Copy "
 /> 
 </field>
 </small>
 </div> 
 
 </div>
 <jb-buttons>
 <jb-button
 label="Collect"
 type="submit"
 color="info"
 small
 v-if="isSaveOpen"
 > 
 </jb-button> 
 </jb-buttons> 
 </card-component>
 </div>
 <!-- <div v-if="courselength == 1 && items.student_course != null && items.student_course[0].booleans.incubation===false" class="lg:w-[72%] xl:w-[70%] bg-gray-900 w-full"> 
 <card-component
 card-class="w-15/12 md:w-5/12 lg:w-5/12 xl:w-5/12 shadow-2xl"
 card-rounded="rounded-lg"
 form
 @submit.prevent="submit" 
 >
 <div v-if="isrepeaterActive == false" class="grid md:grid-cols-5 sm:grid-cols-2 gap-1 mt-2">

 <p v-if="courselength==1 && coursedetails[0].booleans.disable_one_shot_pay==false"> <span class="text-yellow-500"> One Shot Amount:</span>
 <span><span v-for="(det) in coursedetails"
 :key="det.id" ><p> {{det.oneshot}}</p></span></span>
 </p>


 <p v-if="courselength==1 && coursedetails[0].booleans.disable_one_shot_pay==false"> <span class="text-yellow-500">One Shot Balance:</span>
 <span><span v-for="(det) in coursedetails"
 :key="det.id" ><p>{{det.oneshot_balance}}</p></span></span>
 </p>


 <p> <span class="text-yellow-500">Installment Amount:</span>
    <span v-for="(det) in coursedetails"
    :key="det.id" >{{det.partial}}</span>
 </p>

 <p> <span class="text-yellow-500">Installment Balance:</span>
    <span v-for="(det) in coursedetails"
    :key="det.id" >{{det.partial_balance}}</span>
 </p>
 </div>

 <div v-if="isrepeaterActive == true" class="grid md:grid-cols-4 sm:grid-cols-2 gap-1 mt-2">
 <p> <span class="text-yellow-500">Target fees: </span> {{changespayment.fees}} </p>
 <p> <span class="text-yellow-500">Subject: </span> {{changespayment.subject}} </p>
 </div> 

 <div class="grid lg:grid-cols-3 sm:grid-cols-2 gap-1 mt-2 md:grid-cols-3">
 <small>
 <field
 label="Amount"
 :error="hasError2"
 help="Enter the Amount Paid"
 class=" box-border w-50 p-1 border-2 border-gray-600"
 >
 <control
 v-model="form.amount"
 :error="hasError2"
 :icon-left="mdiCashMultiple"
 name="amount"
 placeholder="eg.36000"
 type="number"
 small
 />
 </field>
 </small>

 <small>
 <field
 label="Confirm Amount"
 :error="hasError3"
 help="Confirm the Amount Paid"
 class=" box-border w-50 p-1 border-2 border-gray-600"
 >
 <control
 v-model="form.camount"
 :error="hasError3"
 onpaste="return false"
 :icon-left="mdiCashCheck"
 name="camount"
 placeholder="eg.36000"
 type="password"
 autocomplete="new-password"
 />
 </field>
 </small>

 <small>
 <field label="Payment Mode" :error="hasError1" class=" box-border w-50 p-1 border-2 border-gray-600" help="Select the Payment Mode">
 <Multiselect :error="hasError1"
 placeholder = "Select the Payment Mode"
 v-model="form.paymenttype"
 :options="payment_types"
 valueProp = "name"
 label="name"
 searchable
 track-by = "name"
 :classes="selectClasses" 
 />
 </field>
 </small>
 </div>

 <div v-if="form.paymenttype">
 <div
 v-if="form.paymenttype.toLowerCase() === 'card'"
 class="grid md:grid-cols-3 sm:grid-cols-2 gap-1"
 > 
 <small>
 <field label="Auth ID (Approval Code)" :error="hasError4" help="Enter the Auth ID" class="box-border w-50 p-1 border-2 border-gray-600">
 <control
 v-model="form.authid"
 :error="hasError4"
 :icon-left="mdiIdentifier"
 name="authid"
 placeholder="Enter the Auth ID"
 />
 </field>
 </small>

 <small>
 <field
 label="Card Number from Merchant Copy"
 class="box-border w-50 p-1 border-2 border-gray-600"
 :error="hasError5"
 help="Enter the Card Number from Merchant Copy" 
 > 
 <control
 v-model="form.cardno"
 :error="hasError5"
 :icon-left="mdiCreditCard"
 name="cardno"
 placeholder="Card Number from Merchant Copy "
 /> 
 </field>
 </small>
 </div> 
 
 </div>
 <jb-buttons class="mt-2">
 <jb-button
 label="Collect"
 type="submit"
 color="info"
 small
 v-if="isSaveOpen"
 > 
 </jb-button> 
 </jb-buttons> 
 </card-component>
 </div>

  <div v-if="isPayFormActive && items.student_course != null" class="lg:w-[72%] xl:w-[70%] bg-gray-900 w-full"> 
 <card-component
 card-class="w-15/12 md:w-5/12 lg:w-5/12 xl:w-5/12 shadow-2xl"
 card-rounded="rounded-lg"
 form
 @submit.prevent="submit" 
 >
 <div v-if="isrepeaterActive == false" class="grid md:grid-cols-5 sm:grid-cols-2 gap-1 mt-2">
 <p v-if="courselength>1"> <span class="text-yellow-500"> Course:</span>
 <span v-if="courselength>1">{{changecourse.courses}}</span> 
 </p>

 <p v-if="courselength>1 && changecourse.disable_one_shot_pay==false"> <span class="text-yellow-500"> One Shot Amount:</span>
 <span>{{changecourse.oneshot_amount}}</span> 
 </p>

 <p v-if="courselength>1 && changecourse.disable_one_shot_pay==false"> <span class="text-yellow-500">One Shot Balance:</span>
 <span>{{changecourse.oneshot_amount_balance}}</span>
 </p>

 <p> <span class="text-yellow-500">Installment Amount:</span>
 <span v-if="courselength>1">{{changecourse.partial_amount}}</span>
 </p>

 <p> <span class="text-yellow-500">Installment Balance:</span>
 <span v-if="courselength>1">{{changecourse.partial_amount_balance}}</span>
 </p>
 </div>

 <div v-if="isrepeaterActive == true" class="grid md:grid-cols-4 sm:grid-cols-2 gap-1 mt-2">
 <p> <span class="text-yellow-500">Target fees: </span> {{changespayment.fees}} </p>
 <p> <span class="text-yellow-500">Subject: </span> {{changespayment.subject}} </p>
 </div> 

 <div class="grid lg:grid-cols-3 sm:grid-cols-2 gap-1 mt-2 md:grid-cols-3">
 <small>
 <field
 label="Amount"
 :error="hasError2"
 help="Enter the Amount Paid"
 class=" box-border w-50 p-1 border-2 border-gray-600"
 >
 <control
 v-model="form.amount"
 :error="hasError2"
 :icon-left="mdiCashMultiple"
 name="amount"
 placeholder="eg.36000"
 type="number"
 small
 />
 </field>
 </small>

 <small>
 <field
 label="Confirm Amount"
 :error="hasError3"
 help="Confirm the Amount Paid"
 class=" box-border w-50 p-1 border-2 border-gray-600"
 >
 <control
 v-model="form.camount"
 :error="hasError3"
 onpaste="return false"
 :icon-left="mdiCashCheck"
 name="camount"
 placeholder="eg.36000"
 type="password"
 autocomplete="new-password"
 />
 </field>
 </small>

 <small>
 <field label="Payment Mode" :error="hasError1" class=" box-border w-50 p-1 border-2 border-gray-600" help="Select the Payment Mode">
 <Multiselect :error="hasError1"
 placeholder = "Select the Payment Mode"
 v-model="form.paymenttype"
 :options="payment_types"
 valueProp = "name"
 label="name"
 searchable
 track-by = "name"
 :classes="selectClasses" 
 />
 </field>
 </small>
 </div>

 <div v-if="form.paymenttype">
 <div
 v-if="form.paymenttype.toLowerCase() === 'card'"
 class="grid md:grid-cols-3 sm:grid-cols-2 gap-1"
 > 
 <small>
 <field label="Auth ID (Approval Code)" :error="hasError4" help="Enter the Auth ID" class="box-border w-50 p-1 border-2 border-gray-600">
 <control
 v-model="form.authid"
 :error="hasError4"
 :icon-left="mdiIdentifier"
 name="authid"
 placeholder="Enter the Auth ID"
 />
 </field>
 </small>

 <small>
 <field
 label="Card Number from Merchant Copy"
 class="box-border w-50 p-1 border-2 border-gray-600"
 :error="hasError5"
 help="Enter the Card Number from Merchant Copy" 
 > 
 <control
 v-model="form.cardno"
 :error="hasError5"
 :icon-left="mdiCreditCard"
 name="cardno"
 placeholder="Card Number from Merchant Copy "
 /> 
 </field>
 </small>
 </div> 
 
 </div>
 <jb-buttons class="mt-2">
 <jb-button
 label="Collect"
 type="submit"
 color="info"
 small
 v-if="isSaveOpen"
 > 
 </jb-button> 
 </jb-buttons> 
 </card-component>
 </div> -->

 <div v-if="items && items.student_course && items.student_course.length === 0" class="lg:w-3/5 w-full">
 <div v-if="page_loading" wire:loading class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
 <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
 <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
 <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
 
 </div> 
 <card-component>
 <field label="Registration code" :error="reg_error" help="Select Registration code">

 <Multiselect
      placeholder = "Select Batchcode"
      v-model="formdata.regcode"
      :options="reg_codes"
      valueProp = "name"
      label="name"
      searchable
      track-by = "name"
      :classes="selectClasses"      
    /> 
 </field>
 <template #footer>
 <level mobile> 
 <jb-buttons>
 <jb-button
 label="Add Batch code"
 type="submit"
 color="info"
 @click="submitregcode()"
 /> 
 </jb-buttons>
 <!-- <Multiselect :error="reg_error"
 placeholder = "Select Registration Code"
 v-model="formdata.regcode"
 valueProp = "name"
 label="name"
 :filter-results="false"
 :min-chars="2"
 :resolve-on-load="false"
 :delay="0"
 :searchable="true"
 track-by = "name"
 :classes="selectClasses"
 :options="async function (filters) {
                return await fetchRegcodes(filters);
              }
            "
 /> -->
 </level>
 </template>
 </card-component>

 <selectcourse-modal v-if="show_course===true" :course_value="student_course" :student_id="student_id" :regcode="formdata.regcode" has-cancel> </selectcourse-modal>
 </div>
 </div>
 
 <div v-if="items && items.student_course && items.student_course.length>0">
   <div class="bg-black border-b border-white sm:px-2 mt-0 py-1 mb-1 text-center flex justify-center">
        <title-sub-bar class="text-base text-teal-600 font-semibold text-center" title="Student Course Details" />
      </div>
   <table class="">
        <thead class="sticky top-[53px] z-[9] bg-gray-900">
 <tr>
 <th>Course</th>
 <th>Course Display Name</th>
 <th>Branch</th>
 <th>Target & Balance</th>
 <th>Paid</th>
 <th>Refund</th>
 <th v-if="courselength >1">Pay</th>
 </tr>
 </thead>
 <tbody>
 <tr
 v-for="(client, index) in items.student_course"
 :key="client.id"
 :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
 >
 <td data-label="Courses">
 <small class="text-blue-200">
 {{ client.name }}
 </small>
 <jb-button
 v-if="client.booleans.incubation===true"
 color="success"
 label="INCUBATION"
 class="ml-3"
 small
 /> 
 </td>

 <td data-label="Course Display Name">
 <small>
 {{ client.displayname }}
 </small>
 </td>

 <td data-label="Branch">
 <small v-if="client.branch && client.branch.branchname">
 {{ client.branch.branchname }}
 </small>
 </td>

 <td data-label="Fees">
   <small>
      <p v-if="client.booleans.disable_one_shot_pay===false">If Paying 
         <span class="text-yellow-200"> OneShot Amount </span>
         , then Target is <span class="text-yellow-200"> {{client.oneshot}} </span>
         , Balance is <span class="text-yellow-200"> {{client.oneshot_balance}} </span> <br/></p>
      
      <p>If Paying 
         <span class="text-yellow-200"> in Installment </span>
         , then Target is <span class="text-yellow-200"> {{client.partial}} </span>
         , Balance is <span class="text-yellow-200"> {{client.partial_balance}} </span></p>
   </small>
 </td>

 <td data-label="Paid">
 <small >
 {{ client.paid }}
 </small>

 <!-- v-if="courselength>1 || (courselength==1 && client.booleans.incubation===false)" <jb-button
 v-if="courselength==1 && client.booleans.incubation===true"
 color="success"
 label="INCUBATION"
 small
 />  -->
 </td>

 <td data-label="Refund"> 
     <small v-if="client.refund">
    {{refundtotal(client.refund)}} 
    </small>
    <small v-else>0</small>
 </td>

 <td v-if="courselength>1" data-label="Pay">
 <jb-button
 color="info"
 label="Collect"
 :icon="mdiCash"
 small
 @click="onpay(client.id, client.name,client.paid, client.branch,client.oneshot, client.oneshot_balance, client.partial, client.partial_balance,client.booleans.disable_one_shot_pay)"
 /> 

 <!-- v-if="client.oneshot!=0 && client.partial!=0"<jb-button
 v-else
 color="success"
 label="INCUBATION"
 small
 />  -->
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <!-- <div class="border-2 mt-2" v-if="items.repeater !== null">
 <p class="text-red-500 ml-3 mt-2 text-xl font-bold"> Repeater </p>
 <table >
 <thead>
 <tr>
 <th>Subject</th>
 <th>Trainer</th>
 <th>Fees</th>
 <th>Paid Fees</th>
 <th>Pay</th>
 </tr>
 </thead>
 <tbody>
 <tr
 v-for="(client, index) in items.repeater"
 :key="client.id"
 :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
 >
 <td data-label="Subject">
 <small>
 {{ client.subject.name }}
 </small>
 </td>

 <td data-label="Trainer">
 <small>
 {{ client.trainer.name }}
 </small>
 </td>

 <td data-label="Fees">
 <small>
 {{ client.fees }}
 </small>
 </td>

 <td data-label="Paid Fees">
 <small>
 {{ client.fees_paid }}
 </small>
 </td>

 <td data-label="Pay">
 <jb-button
 v-if="client.paid == false"
 color="info"
 label="Collect"
 :icon="mdiCash"
 small
 @click="repeaterpay(client.subject.id,client.subject.name,client.trainer.id,client.trainer.name,client.fees)"
 /> 

 <jb-button
 v-if="client.paid == true"
 color="success"
 label="Paid"
 :icon="mdiCheckCircle"
 small
 /> 
 </td>

 </tr>
 </tbody>
 </table>
 </div> -->


<div v-if="items.student_batches && items.student_batches.length >0">  
 <div class="bg-black border-b border-white sm:px-2 mt-0 py-1 mb-1 text-center flex justify-center">
        <title-sub-bar class="text-base text-teal-600 font-semibold text-center" title="Student Batch Details" />
      </div>
 <table>
 <thead>
 <tr>
 <th>Batch</th>
 <th>Branch</th>
 <th>Course</th>
 <th>Subject</th>
 <th>Trainer</th>
 </tr>
 </thead>
 <tbody v-if="batchesPaginated && batchesPaginated.length <= 1">
 <tr
 v-for="(client, index) in batchesPaginated"
 :key="client.id"
 :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
 >
 <td data-label="Batch">
 <small>
 {{ client.name }}
 </small>
 </td>

  <td data-label="Branch">
 <small>
 {{ client.branch.name }}
 </small>
 </td>

 <td data-label="Course">
 <small>
 {{ client.batchplan.course.name }}
 </small>
 </td>

 <td data-label="Subject">
 <small>
 {{ client.subject.name }}
 </small>
 </td>

 <td data-label="Trainer">
 <small>
 {{ client.trainer.name }}
 </small>
 </td>
 </tr>
 </tbody>
 <tbody v-if="batchesPaginated && batchesPaginated.length > 1">
 <tr
 v-for="(client, index) in batchesPaginated.slice(0,1)"
 :key="client.id"
 :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
 >
 <td data-label="Batch">
 <small>
 {{ client.name }}
 </small>
 </td>

  <td data-label="Branch">
 <small>
 {{ client.branch.name }}
 </small>
 </td>

 <td data-label="Course">
 <small>
 {{ client.batchplan.course.name }}
 </small>
 </td>

 <td data-label="Subject">
 <small>
 {{ client.subject.name }}
 </small>
 </td>

 <td data-label="Trainer">
 <small>
 {{ client.trainer.name }}
 </small>
 </td>

 </tr>
 </tbody>
 <tbody v-if="isModalBatchActive && batchesPaginated && batchesPaginated.length > 1">
 <tr
 v-for="(client, index) in batchesPaginated.slice(1)"
 :key="client.id"
 :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
 >
 <td data-label="Batch">
 <small>
 {{ client.name }}
 </small>
 </td>

  <td data-label="Branch">
 <small>
 {{ client.branch.name }}
 </small>
 </td>

 <td data-label="Course">
 <small>
 {{ client.batchplan.course.name }}
 </small>
 </td>

 <td data-label="Subject">
 <small>
 {{ client.subject.name }}
 </small>
 </td>

 <td data-label="Trainer">
 <small>
 {{ client.trainer.name }}
 </small>
 </td>
 </tr>
 </tbody>
 </table>

  <div v-if=" batchesPaginated && batchesPaginated.length > 1" class="flex items-center p-2 justify-end pr-3 bg-gray-900">
      <jb-button @click="isModalBatchActive =! isModalBatchActive" :label="isModalBatchActive ? 'Show Less' : 'Show More'" small type="submit" color="cyan" :icon="mdiMore"/> 
  </div>
  <!-- <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"> -->
    <!-- <level mobile>
      <jb-buttons glue>
      <jb-button
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level> -->
  <!-- </div> -->
 </div>
 
 
 <div v-if="items.student_payments && items.student_payments.length >0">  <!--class="border-2 border-blue-200 mt-2" -->
 <!-- <p class="text-teal-600 ml-3 my-2 text-lg font-bold text-center underline"> Payment Details </p> -->
 <div class="bg-black border-b border-white sm:px-2 mt-0 py-1 mb-1 text-center flex justify-center">
        <title-sub-bar class="text-base text-teal-600 font-semibold text-center" title="Student Payment Details" />
      </div>
 <table>
 <thead>
 <tr>
 <th>Course</th>
 <th>Amount</th>
 <th>Payment Type</th>
 <th>Invoice Number</th>
 <th>Payment Date</th>
 </tr>
 </thead>
 <tbody v-if="paymentsPaginated && paymentsPaginated.length <= 1">
 <tr
 v-for="(client, index) in paymentsPaginated"
 :key="client.id"
 :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
 >
 <td data-label="Course">
 <small>
 {{ client.course.name }}
 </small>
 </td>

 <td data-label="Amount">
 <small>
 {{ client.amount }}
 </small>
 </td>

 <td data-label="Payment Type">
 <small>
 {{ client.payment_details.type }}
 </small>
 </td>

 <td data-label="Invoice Number">
 <small>
 {{ client.payment_details.invoiceno }}
  <span class="text-red-500 font-bold" v-if="client.cninvoice != null">
    <span v-for="cni in client.cninvoice"
      :key="cni">
     [-{{cni.amount}}/{{cni.cninvoice}}]
     </span>
  </span>
  <br>
  <span v-if="client.booleans && client.booleans.transferee === true && client.booleans.cancelled ===true" class="text-red-500 ">
    (Payment transferred to another student)
  </span>
  <span v-if="client.booleans && client.booleans.receiver === true" class="text-lime-200">
    (Payment received from another student)
  </span>
 </small>
 </td>

 <td data-label="Payment Date">
 <small>
 <!-- {{ client.payment_details.date }} -->
 {{ dayjs(client.payment_details.date).format('DD-MMM-YY h:mm A') }}
 </small>
 </td>

 </tr>
 </tbody>
 <tbody v-if="paymentsPaginated && paymentsPaginated.length > 1">
 <tr
 v-for="(client, index) in paymentsPaginated.slice(0,1)"
 :key="client.id"
 :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
 >
 <td data-label="Course">
 <small>
 {{ client.course.name }}
 </small>
 </td>

 <td data-label="Amount">
 <small>
 {{ client.amount }}
 </small>
 </td>

 <td data-label="Payment Type">
 <small>
 {{ client.payment_details.type }}
 </small>
 </td>

 <td data-label="Invoice Number">
 <small>
 {{ client.payment_details.invoiceno }}
  <span class="text-red-500 font-bold" v-if="client.cninvoice != null">
    <span v-for="cni in client.cninvoice"
      :key="cni">
     [-{{cni.amount}}/{{cni.cninvoice}}]
     </span>
  </span>
  <br>
  <span v-if="client.booleans && client.booleans.transferee === true && client.booleans.cancelled ===true" class="text-red-500 ">
    (Payment transferred to another student)
  </span>
  <span v-if="client.booleans && client.booleans.receiver === true" class="text-lime-200">
    (Payment received from another student)
  </span>
 </small>
 </td>

 <td data-label="Payment Date">
 <small>
 <!-- {{ client.payment_details.date }} -->
 {{ dayjs(client.payment_details.date).format('DD-MMM-YY h:mm A') }}
 </small>
 </td>

 </tr>
 </tbody>
 <tbody v-if="isModalPaymentActive && paymentsPaginated && paymentsPaginated.length > 1">
 <tr
 v-for="(client, index) in paymentsPaginated.slice(1)"
 :key="client.id"
 :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
 >
 <td data-label="Course">
 <small>
 {{ client.course.name }}
 </small>
 </td>

 <td data-label="Amount">
 <small>
 {{ client.amount }}
 </small>
 </td>

 <td data-label="Payment Type">
 <small>
 {{ client.payment_details.type }}
 </small>
 </td>

 <td data-label="Invoice Number">
 <small>
 {{ client.payment_details.invoiceno }}
  <span class="text-red-500 font-bold" v-if="client.cninvoice != null">
    <span v-for="cni in client.cninvoice"
      :key="cni">
     [-{{cni.amount}}/{{cni.cninvoice}}]
     </span>
  </span>
  <br>
  <span v-if="client.booleans && client.booleans.transferee === true && client.booleans.cancelled ===true" class="text-red-500 ">
    (Payment transferred to another student)
  </span>
  <span v-if="client.booleans && client.booleans.receiver === true" class="text-lime-200">
    (Payment received from another student)
  </span>
 </small>
 </td>

 <td data-label="Payment Date">
 <small>
 <!-- {{ client.payment_details.date }} -->
 {{ dayjs(client.payment_details.date).format('DD-MMM-YY h:mm A') }}
 </small>
 </td>

 </tr>
 </tbody>
 </table>

  <div v-if=" paymentsPaginated && paymentsPaginated.length > 1" class="flex items-center p-2 justify-end pr-3 bg-gray-900">
      <jb-button @click="isModalPaymentActive =! isModalPaymentActive" :label="isModalPaymentActive ? 'Show Less' : 'Show More'" small type="submit" color="cyan" :icon="mdiMore"/> 
  </div>
  <!-- <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"> -->
    <!-- <level mobile>
      <jb-buttons glue>
      <jb-button
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level> -->
  <!-- </div> -->
 </div> 
 </div> 

 <div v-else class="p-3 text-red-400 text-2xl ">
 <span class="p-3 flex justify-center">This student has not Registered</span>
 </div>

 
 <!--pagination-->
 <!-- <div
 :class="lightBorderStyle"
 class="p-1 lg:px-6 border-t dark:border-gray-800"
 > -->
 <!-- <level mobile>
 <jb-buttons glue>
 <jb-button
 v-for="page in pagesList"
 :key="page"
 :active-soft="page === currentPage"
 :label="page"
 addon
 :outline="darkMode"
 small
 no-focus-ring
 @click="pageChange(page)"
 />
 </jb-buttons>
 <small>Page {{ currentPage }} of {{ numPages }}</small>
 </level> -->
 <!-- </div> -->

</template>