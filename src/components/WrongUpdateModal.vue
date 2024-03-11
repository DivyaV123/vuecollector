<script setup>
import { computed ,onBeforeMount,ref,reactive,onMounted,watch} from 'vue'
import { mdiClose,mdiCity,mdiAccount,
  mdiMail,
  mdiCashMultiple,
  mdiCashCheck,
  mdiCreditCard,
  mdiIdentifier,
  mdiComment, } from '@mdi/js'
import { useRoute,useRouter } from "vue-router";
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import Multiselect from '@vueform/multiselect'
import { selectClasses } from '@/selectcss.js'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Controlled from '@/components/Controlled.vue'
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector"
import { collector_Store } from "../stores/collector2"
const theme = themeStore();
const collector = collectorStore();
const collector2 = collector_Store();
const user = sessionStore();
const route = useRoute();
const router = useRouter();

const props = defineProps({
    updatedata: Array,
  title: {
    type: String,
    default: null
  },
  largeTitle: {
    type: String,
    default: null
  },
  shake: Boolean,
  hasCancel: Boolean,
  textLinkLabel: {
    type: String,
    default: null
  },
  textLinkIcon: {
    type: String,
    default: null
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  }
})

const form = reactive({
    branch:null,
    wrong_status_id:null,
    amount:"",
    camount:"",
    type_id:null,
    ctype_id : null,
    authid: "",
    cardno : "",
    comment : "",
});

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})


const wstatus = ref("")

watch(wstatus, async (newform, oldform) => {
  form.wrong_status_id = newform
  form.amount = ""
  form.type_id = ""
  form.camount = ""
  form.ctype_id = ""  
})

const pageLoading = ref(false)
const hasError = ref(false)
const hasError1 = ref(false)
const hasError2 = ref(false)
const hasError3 = ref(false)
const hasError4 = ref(false)
const hasError5 = ref(false)
const hasError6 = ref(false)
const hasError7 = ref(false)
const hasError8 = ref(false)
const brancherror = ref(false)

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const cardClassAddon = computed(() => hasError.value || hasError1.value ||hasError2.value || hasError3.value || hasError4.value || hasError5.value || hasError6.value || hasError7.value || hasError8.value ? 'animate-shake' : '')

onBeforeMount(async () => {
  await user.checkUser();
  if (!user.loggedIn) {
    router.push("login");
  } 
  await collector2.getWrongStatus()
  await collector.getPaymentType()
});


const wrongstatus = computed(() => {
  return collector2.wrongstatus
});

const payments = computed(() => {
  return collector.paytype
});

const submit = async () => {
  if(form.wrong_status_id === null)  
  {
    hasError.value = true
    theme.pushMessage("Wrong Update Status field is mandatory"); 
  }
  else{                           
    if(form.wrong_status_id.name.toLowerCase() === 'payment type is wrong'){
      if(form.type_id === null){
        hasError3.value = true
        theme.pushMessage("Actual Payment Type field is mandatory"); 
      }
      else if(props.updatedata.type == String(form.type_id.name)){
        hasError3.value = true
        theme.pushMessage("Updated Payment type and Actual payment type is same"); 
      }
      else if(form.ctype_id === null){
        hasError4.value = true
        theme.pushMessage("Confirm Payment Type Field is mandatory"); 
      }
      else if(Number(form.type_id.id) != Number(form.ctype_id.id) ){
        hasError4.value = true
        hasError3.value = true
        theme.pushMessage("Actual Payment Type & Confirm Payment Type field should be same"); 
      }
      else if(form.type_id.name.toLowerCase() === 'card' && form.authid === ""){
          hasError5.value = true
          theme.pushMessage("Auth ID Field is mandatory"); 
      }
      else if(form.type_id.name.toLowerCase() === 'card' && form.cardno ===""){
        hasError6.value = true
        theme.pushMessage("Card Number from Merchant Copy Field is mandatory"); 
      } 
      else{
        try{
          pageLoading.value = true
          if (form.type_id.name === "card") {
            await collector2.cancelinvoice({"type" : "wrongupdate",
                                                "invoiceno": props.updatedata.invoiceno,
                                                "comment":form.comment,
                                                "details":[
                                                    {"status":JSON.parse(JSON.stringify(form.wrong_status_id)),
                                                        "payment_type" : {
                                                                    "actual_type" : form.type_id.name,
                                                                    "authid" : form.authid,
                                                                    "cardno" : form.cardno,
                                                                    "comment":form.comment,
                                                            },
                                                    }]
                                    }
            )
          } 
          else{
            await collector2.cancelinvoice({"type" : "wrongupdate",
                                                "invoiceno": props.updatedata.invoiceno,
                                                "comment":form.comment,
                                                "details":[
                                                    {"status":JSON.parse(JSON.stringify(form.wrong_status_id)),
                                                        "payment_type" : {
                                                                    "actual_type" : form.type_id.name,
                                                                    "comment":form.comment,
                                                            },
                                                    }]
                                    })
          }        
              theme.pushMessage(collector2.cancel_invoice.message)
              pageLoading.value = false
                collector.get_unsettlestudents()
                value.value = false

        }
      catch(error){
        console.log("vue error",error)
        }
      }
    }
    // if(form.wrong_status_id.name.toLowerCase() === 'wrong student'){
    //   if(form.comment === ""){
    //     hasError8.value = true
    //     theme.pushMessage("Comment field is Mandatory if Status is Wrong Student"); 
    //   }
    //   else{
    //     try{
    //     await collector2.cancelinvoice({"student":JSON.parse(JSON.stringify(props.updatedata)),
    //                                   "branch":props.updatedata.branch,  
    //                                   "comment":form.comment,                                 
    //                                   "details":[
    //                                     {"status":JSON.parse(JSON.stringify(form.wrong_status_id)),
    //                                   }
    //                                   ]})
    //       theme.pushMessage("Successfully Raised request to Help Team, Please wait for the confirmation");
    //         router.push(`/unsettled_payments`);
    //         confirmCancel();
    //     }
    // catch(error){
    //   console.log("vue error",error)
    // }
    //   }
    // }

    if(form.wrong_status_id.name.toLowerCase() === 'amount is wrong'){
      if(props.updatedata.amount == form.amount){
        hasError1.value = true
        theme.pushMessage("Updated Amount & Actual Paid Amount is same"); 
      }
      else if(form.amount === ""){
        hasError1.value = true
        theme.pushMessage("Actual Paid Amount field is mandatory"); 
      }
      else if(form.camount === ""){
        hasError2.value = true
        theme.pushMessage("Confirm Actual Paid Amount Field is mandatory"); 
      }
      else if(form.amount != form.camount){
        hasError1.value = true
        hasError2.value = true
        theme.pushMessage("Check if Actual Paid Amount and Confirm Actual Paid Amount is equal or not"); 
      }
      else{
        try{
          pageLoading.value = true
          await collector2.cancelinvoice({"type" : "wrongupdate",
                                       "invoiceno": props.updatedata.invoiceno,
                                       "comment":form.comment,
                                                "details":[
                                                    {"status":JSON.parse(JSON.stringify(form.wrong_status_id)),
                                                        "amount":{"actual_amount":form.amount},
                                                        "comment":form.comment,
                                      }]})
              theme.pushMessage(collector2.cancel_invoice.message)
                pageLoading.value = false
                collector.get_unsettlestudents()
                value.value = false
          }
        catch(error){
          console.log("vue error",error)
        }
      }    
    }

    else if(form.wrong_status_id.name.toLowerCase() === 'both payment type and updated amount is wrong'){
      if(props.updatedata.amount == form.amount){
        hasError1.value = true
        theme.pushMessage("Updated Amount & Actual Paid Amount is same"); 
      }
      else if(form.amount === ""){
        hasError1.value = true
        theme.pushMessage("Actual Paid Amount field is mandatory"); 
      }
      else if(form.amount <= 0){
        hasError1.value = true
        theme.pushMessage("Actual Paid Amount should be greater than zero"); 
      }
      else if(form.camount === ""){
        hasError2.value = true
        theme.pushMessage("Confirm Actual Paid Amount Field is mandatory"); 
      }
      else if(form.amount != form.camount){
        hasError1.value = true
        hasError2.value = true
        theme.pushMessage("Check if Actual Paid Amount and Confirm Actual Paid Amount is equal or not"); 
      }
      else if(form.type_id === null){
        hasError3.value = true
        theme.pushMessage("Actual Payment Type field is mandatory"); 
      }
      else if(props.updatedata.type == String(form.type_id.name)){
        hasError3.value = true
        theme.pushMessage("Updated Payment type and Actual payment type is same"); 
      }
      else if(form.ctype_id === null){
        hasError4.value = true
        theme.pushMessage("Confirm Payment Type Field is mandatory"); 
      }
      else if(Number(form.type_id.id) != Number(form.ctype_id.id) ){
        hasError4.value = true
        hasError3.value = true
        theme.pushMessage("Actual Payment Type & Confirm Payment Type field should be same"); 
      }
      else if(form.type_id.name.toLowerCase() === 'card' && form.authid === ""){
          hasError5.value = true
          theme.pushMessage("Auth ID Field is mandatory"); 
      }
      else if(form.type_id.name.toLowerCase() === 'card' && form.cardno ===""){
        hasError6.value = true
        theme.pushMessage("Card Number from Merchant Copy Field is mandatory"); 
      } 
      else{
        try{
          pageLoading.value = true
          if (form.type_id.name === "card") {
            await collector2.cancelinvoice({"type" : "wrongupdate",
                                                "invoiceno": props.updatedata.invoiceno,
                                                "comment":form.comment,
                                                "details":[
                                                    {"status":JSON.parse(JSON.stringify(form.wrong_status_id)),
                                                    "amount":{"actual_amount":form.amount},
                                                    "comment":form.comment,
                                                    "payment_type" : {
                                                    "actual_type" : form.type_id.name,
                                                    "authid": form.authid,
                                                    "cardno" : form.cardno,
                                                    "comment":form.comment,
                                      }}]})
          }
          else{
            await collector2.cancelinvoice({"type" : "wrongupdate",
                                                "invoiceno": props.updatedata.invoiceno,
                                                "comment":form.comment,
                                                "details":[
                                                    {"status":JSON.parse(JSON.stringify(form.wrong_status_id)),
                                                    "amount":{"actual_amount":form.amount},
                                                    "comment":form.comment,
                                                    "payment_type" : {
                                                    "actual_type" : form.type_id.name,
                                      }}]})
          }
                theme.pushMessage(collector2.cancel_invoice.message)
                pageLoading.value = false
                collector.get_unsettlestudents()
                value.value = false
          }
        catch(error){
          console.log("vue error",error)
        }
      }    
    }

  }
}

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)

const termsconditions = computed(() => props.termsdata)



const confirm = () => confirmCancel('confirm')

const cancel = () => confirmCancel('cancel')
</script>

<template>
  <overlay
    @overlay-click="cancel"
  >    
    <card-component
      :title="title"
      class="shadow-lg w-full md:w-full lg:w-4/5 z-50 h-850px sm:w-4/5 overflow-y-scroll"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
      @submit.prevent="submit"
    >
    <div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
      <div class="space-y-3">
        <h1
          v-if="largeTitle"
          class="text-2xl"
        >
          {{ largeTitle }}
        </h1>
      </div>


         <div class="grid md:grid-cols-4 sm:grid-cols-2 gap-2">
      <field label="Name" class="h-6 height">
        <controlled
          v-model="props.updatedata.name"
          :icon-left="mdiAccount"
          name="Name"
        />
      </field>


      <field label="Updated Amount" class="h-6 height">
        <controlled
          v-model="props.updatedata.amount"
          :icon-left="mdiCashMultiple"
          name="Updated Amount"          
        />
      </field>
      

      <field label="Updated Payment Type" :error="hasError7" class="h-6 height">
          <controlled
            v-model="props.updatedata.type"
            :error="hasError7"
            :icon-left="mdiCashMultiple"
            name="Updated Payment Type" 
          />
        </field>

    <field
          label="Wrong Update Status"
          :error="hasError" help="Select the Status"
        >
        <Multiselect
                    placeholder = "Select the Update status"
                    v-model="wstatus"
                    :options="wrongstatus"
                    valueProp = "id"
                    label="name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"
                    :object = "true"
                    class="h-9"
                /> 
        </field>
     
      </div>
   

<div v-if="form.wrong_status_id">
  <div v-if="form.wrong_status_id.name.toLowerCase() === 'both payment type and updated amount is wrong'" class="grid sm:grid-cols-2 gap-2 xl:grid-cols-4">
    <field label="Actual Paid Amount" :error="hasError1" help="Enter the Actual Paid Amount">
        <control
          v-model="form.amount"
          :error="hasError1"
          onpaste="return false"
          :icon-left="mdiCashMultiple"
          name="Enter Actual Paid Amount"
          placeholder="Enter Actual Paid Amount"
          type="number" 
        />
      </field>

    
      <field label="Confirm Actual Paid Amount" :error="hasError2" help="Confirm the Actual Paid Amount" class="h-6 height">
        <control
          v-model="form.camount"
          :error="hasError2"
          onpaste="return false"
          :icon-left="mdiCashMultiple"
          name="Confirm Updated Amount"
          placeholder="Confirm the Actual Paid Amount"
          type="password"
          autocomplete="new-password"
        />
      </field>

      <field label="Actual Payment Type" :error="hasError3" help="Select the Actual Payment Type">
        <Multiselect
                    placeholder = "Select Payment Mode"
                    v-model="form.type_id"
                    :options="payments"
                    valueProp = "id"
                    label="name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"    
                    :object = "true"  
                    onpaste="return false"
                    class="h-9"
                /> 
        </field>
                

      <field label="Confirm Payment Type" :error="hasError4" help="Confirm the Payment Type" class="h-6 height">
        <Multiselect
                    placeholder = "Confirm Payment Mode"
                    v-model="form.ctype_id"
                    :options="payments"
                    valueProp = "id"
                    label="name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"    
                    :object = "true"  
                    onpaste="return false"
                    class="h-9"
                /> 
        </field>
         </div>

        <span v-if="form.wrong_status_id.name.toLowerCase() === 'both payment type and updated amount is wrong' && form.type_id">
   <span v-if="form.wrong_status_id.name.toLowerCase() === 'both payment type and updated amount is wrong' && form.type_id.name.toLowerCase() === 'card'" class="grid sm:grid-cols-2 gap-2 lg:grid-cols-3">
      <field label="Auth ID" :error="hasError5" help="Enter the Auth ID">
        <control
          v-model="form.authid"
          :error="hasError5"
          :icon-left="mdiIdentifier"
          name="authid"
          placeholder="Enter Auth ID"
        />
      </field>

      <field label="Card Number from Merchant Copy" :error="hasError6" help="Enter the Card Number from Merchant Copy" class="h-6 height">
        <control
          v-model="form.cardno"
          :error="hasError6"
          :icon-left="mdiCreditCard"
          name="cardno"
          placeholder="Card Number from Merchant Copy "
        />
      </field>
      </span> 
      </span> 
     

        <div v-if="form.wrong_status_id.name.toLowerCase() === 'amount is wrong'" class="grid sm:grid-cols-2 gap-2 xl:grid-cols-3">
      <field label="Actual Paid Amount" :error="hasError1" help="Enter the Actual Paid Amount" >
        <control
          v-model="form.amount"
          :error="hasError1"
          onpaste="return false"
          :icon-left="mdiCashMultiple"
          name="Enter Actual Paid Amount"
          placeholder="Enter Actual Paid Amount"
          type="number" 
        />
      </field>

    
      <field label="Confirm Actual Paid Amount" :error="hasError2" help="Confirm the Actual Paid Amount">
        <control
          v-model="form.camount"
          :error="hasError2"
          onpaste="return false"
          :icon-left="mdiCashMultiple"
          name="Confirm Updated Amount"
          placeholder="Confirm the Actual Paid Amount"
          
          type="password"
          autocomplete="new-password"
        />
      </field>
      </div>

<div v-if="form.wrong_status_id.name.toLowerCase() === 'payment type is wrong'" class="grid sm:grid-cols-2 gap-2 mb-2 xl:grid-cols-3">
      <field label="Actual Payment Type" :error="hasError3" help="Select the Actual Payment Type" class="h-6 height">
        <Multiselect
                    placeholder = "Select Payment Mode"
                    v-model="form.type_id"
                    :options="payments"
                    valueProp = "id"
                    label="name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"    
                    :object = "true"  
                    onpaste="return false"
                    class="h-9"
                /> 
        </field>
                

      <field label="Confirm Payment Type" :error="hasError4" help="Confirm the Payment Type">
        <Multiselect
                    placeholder = "Confirm Payment Mode"
                    v-model="form.ctype_id"
                    :options="payments"
                    valueProp = "id"
                    label="name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"    
                    :object = "true"  
                    onpaste="return false"
                    class="h-9"
                /> 
        </field>
        </div>

        

<span v-if="form.type_id && form.wrong_status_id.name.toLowerCase() === 'payment type is wrong'">
   <span v-if="form.type_id.name.toLowerCase() === 'card'" class="grid sm:grid-cols-2 gap-2 lg:grid-cols-3">
      <field label="Auth ID" :error="hasError5" help="Enter the Auth ID">
        <control
          v-model="form.authid"
          :error="hasError5"
          :icon-left="mdiIdentifier"
          name="authid"
          placeholder="Enter Auth ID"
        />
      </field>

      <field label="Card Number" :error="hasError6" help="Enter the Card Number from Merchant Copy">
        <control
          v-model="form.cardno"
          :error="hasError6"
          :icon-left="mdiCreditCard"
          name="cardno"
          placeholder="Card Number"
          class="-mt-3"
        />
      </field>
      </span> 
      </span>

    </div>

      <div class="grid md:grid-cols-2 gap-2 lg:grid-cols-3 ">
      <field label="Comment" :error="hasError8" help="Enter the Comment" >
        <control
          v-model="form.comment"
          :icon-left="mdiComment"
          name="Enter the Comment"
          :error="hasError8"
          placeholder="Enter the Comment"
          type="textarea"
        />
      </field>
      </div>     

        <template #footer>
       
          <jb-buttons>
            <jb-button
              label="Submit"
              color="info"
              type="submit"
              @click="submit"
            />
          </jb-buttons>
      
      </template>

  
    </card-component>
  </overlay>
</template>
