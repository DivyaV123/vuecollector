<script setup>
import { computed,ref,reactive } from 'vue'
import { useRouter,useRoute } from "vue-router";
import { mdiClose } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import PaymentPreview from '@/components/PaymentPreview.vue'
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector"
import { themeStore } from "../stores/theme"
const route = useRoute();
const router = useRouter();
const user = sessionStore();
const collector = collectorStore();
const theme = themeStore();


const props = defineProps({
    propValues:Array,
    alreadypaidValues:Array,
  title: {
    type: String,
    default: null
  },
  largeTitle: {
    type: String,
    default: null
  },
  shake: Boolean,
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

const pageLoading = ref(false)

const propsdata = computed(() => props.propValues.value)

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

// const confirmationpopup = ref(false)
const isnewpopup = ref(false)

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
 "cardno":""
 })

const confirm = async () => {
        propValues.name = props.propValues.name
        propValues.course = props.propValues.course
        propValues.sid = props.propValues.sid
        propValues.cid = props.propValues.cid
        propValues.bcourse = props.propValues.bcourse
        propValues.amount = props.propValues.amount
        propValues.type = props.propValues.type
        propValues.location = "same_location"
        propValues.date = props.propValues.date
        propValues.authid = props.propValues.authid
        propValues.cardno = props.propValues.cardno
        isnewpopup.value = true

//   if(props.propValues.type.toLowerCase() === 'cash'){
//     props.propValues.authid = ''
//     props.propValues.cardno = ''
//   }
//  pageLoading.value = true
//     await collector.getPay({"sid":props.propValues.sid,
//                               "cid":props.propValues.cid,
//                               "bcourse":props.propValues.bcourse,
//                               "amount":props.propValues.amount,
//                               "type":props.propValues.type,
//                               "location":props.propValues.location,
//                               "date":props.propValues.date,
//                               "authid":props.propValues.authid,
//                               "cardno":props.propValues.cardno
//                             });
//     if (collector.$state.error){
//         isCbuttonOpen.value = true
//       if (collector.$state.error === 'Auth ID(approval code) already exists, Please check') {
//         errvalue.value = collector.$state.error
//       }
//         theme.pushErrorMessage(collector.$state.error);
//         await collector.removeError()
//         pageLoading.value = false
//     }
//     else if(JSON.parse(JSON.stringify(collector.$state.pay)).length != 0){ 
//         isCbuttonOpen.value = false
//         // console.log("id data",JSON.parse(JSON.stringify(collector.$state.pay))); 
//         receiptdata.value = collector.$state.pay
//         // isSaveOpen.value = false
//         pageLoading.value = true

//         setTimeout(function(){
//         isPrintOpen.value = true
//         theme.pushMessage(collector.$state.pay.message);
//         redirectToUserView(receiptdata.value.invoice)
//         pageLoading.value = true
//         router.push("/")
//         }, 1000); 
//         }
//     else{
//         theme.pushErrorMessage("Somthimg went wrong,try again!!");
//     } 
  }
  

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const cancel = () => confirmCancel('cancel')
</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      class="shadow-lg w-full max-h-modal md:w-3/5 lg:w-2/5 z-50 sm:w-4/5"
    >
   <div class="flex justify-between border-b  border-gray-600 pb-2 mb-5">
    <h5 class="text-orange-500 text-xl font-bold  ">Alert</h5>
    <small>
      <jb-button
              small
              :icon="mdiClose"
              color="dark"
              @click="cancel"
            />
    </small>
</div>

    <div v-if="pageLoading" wire:loading
 class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
 <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
 <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
 <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
 </div>
 
      <div class="space-y-3">
        <span class="text-gray-300 mt-2 font-bold text-lg"><p> Student <span class="underline text-red-400">{{props.propValues.name}}</span> has already paid <span class="underline text-red-400">{{alreadypaidValues.amount}}</span> through <span class="underline text-red-400">{{alreadypaidValues.type}}</span> for <span class="underline text-red-400">{{alreadypaidValues.course.name}}</span> today. Do you want to continue?</p></span>
      </div>
      
      <template #footer>
        <level mobile>
          <jb-buttons>
        
            <jb-button
              label="Confirm"
              color="success"
              @click="confirm"
              class="mb-0 pt-1 pb-1"
            />
            <jb-button
              label="Cancel"
              color="danger"
              @click="cancel"
              class="mb-0 pt-1 pb-1"
            />
          </jb-buttons>

          <text-link
            :label="textLinkLabel"
            :icon="textLinkIcon"
          />
        </level>
      </template>
    </card-component>
  </overlay>

<payment-preview :propValues="propValues" v-if="isnewpopup == true" v-model="isnewpopup" title="Confirm Payment" >
</payment-preview>
</template>
