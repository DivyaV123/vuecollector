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

const commenterror = ref(false)

const receiptdata = ref([])
const pageLoading = ref(false)
const isPrintOpen = ref(false)
const isCbuttonOpen = ref(true)


const errvalue = ref("")

const propsdata = computed(() => props.propValues.value)

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const redirectToUserView = async (receiptdata) => { 
 var w = window.open( `/invoice/${receiptdata}`, "_blank" );
};

const confirm = async () => {
  if(props.propValues.type.toLowerCase() === 'cash'){
    props.propValues.authid = ''
    props.propValues.cardno = ''
  }
 pageLoading.value = true
    await collector.getPay({"sid":props.propValues.sid,
                              "cid":props.propValues.cid,
                              "bcourse":props.propValues.bcourse,
                              "amount":props.propValues.amount,
                              "type":props.propValues.type,
                              "location":props.propValues.location,
                              "date":props.propValues.date,
                              "authid":props.propValues.authid,
                              "cardno":props.propValues.cardno
                            });
    if (collector.$state.error){
        isCbuttonOpen.value = true
      if (collector.$state.error === 'Auth ID(approval code) already exists, Please check') {
        errvalue.value = collector.$state.error
      }
        theme.pushErrorMessage(collector.$state.error);
        await collector.removeError()
        pageLoading.value = false
    }
    else if(JSON.parse(JSON.stringify(collector.$state.pay)).length != 0){ 
        isCbuttonOpen.value = false
        // console.log("id data",JSON.parse(JSON.stringify(collector.$state.pay))); 
        receiptdata.value = collector.$state.pay
        // isSaveOpen.value = false
        pageLoading.value = true

        setTimeout(function(){
        isPrintOpen.value = true
        theme.pushMessage(collector.$state.pay.message);
        redirectToUserView(receiptdata.value.invoice)
        pageLoading.value = true
        router.push("/")
        }, 1000); 
        }
    else{
        theme.pushErrorMessage("Somthimg went wrong,try again!!");
    } 
  }
  

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const cancel = () => confirmCancel('cancel')
// const cancel = async () => {
//     location.reload()
// }
</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      :title="title"
      class="shadow-lg w-full max-h-modal md:w-3/5 lg:w-2/5 z-50 sm:w-4/5"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >

    <div v-if="pageLoading" wire:loading
 class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
 <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
 <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
 <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  <p class="text-orange-500 mt-2 font-bold text-lg"> Warning: Do not reload the page,wait until you get the payment receipt</p>
 </div>
 
      <div class="space-y-3">
          Student: <span class="text-green-300">{{propValues.name}}</span> <br/>
          Course: <span class="text-green-300">{{propValues.course}}</span> <br/>
          Amount: <span class="text-green-300">{{propValues.amount}}</span> <br/>
          Payment Type: <span class="text-green-300">{{propValues.type}}</span> <br/>
          <span v-if="propValues.type.toLowerCase() == 'card'"> 
            Authid: <span class="text-green-300">{{propValues.authid}}</span> <span v-if="errvalue != ''" class="font-bold text-red-500">[Auth ID(Approval Code) already exists,please check!!]</span><br/>
            Card Number: <span class="text-green-300">{{propValues.cardno}}</span> <br/>
        </span>
        <span class="text-orange-500 mt-2 font-bold text-lg"><p> Warning: Do not reload the page,wait until you get the payment receipt</p></span>
      </div>
      
      <template #footer>
        <level mobile>
          <jb-buttons>
        
            <jb-button
            v-if="isCbuttonOpen == true"
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
</template>
