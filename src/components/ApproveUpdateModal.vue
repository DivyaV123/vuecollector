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
import { collector_Store } from "../stores/collector2"
import { collectorStore } from "../stores/collector"
const theme = themeStore();
const collector2 = collector_Store()
const collector = collectorStore()
const user = sessionStore();
const route = useRoute();
const router = useRouter();

const props = defineProps({
    approvedata: Object,
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
    comment : "",
});


onBeforeMount(async () => {
  await user.checkUser();
  if (!user.loggedIn) {
    router.push("login");
  } 
});



const submit = async () => {
    try{
      if(props.approvedata.details[0].amount && !props.approvedata.details[0].payment_type){
        console.log("amount");
        await collector2.add_approve({"id":props.approvedata.id,
                                      "student":JSON.parse(JSON.stringify(props.approvedata.student)),
                                      "actual_amount":props.approvedata.details[0].amount.actual_amount,
                                      })
        if (collector2.$state.error){
          theme.pushErrorMessage(collector2.$state.error);
          await collector2.removeError()
        }
        else if(collector2.$state.approve){
          theme.pushMessage(collector2.$state.approve.message);
            router.push(`/approve_update`);
              location.reload()
        }
      }  
      else if(props.approvedata.details[0].payment_type && !props.approvedata.details[0].amount){
        console.log("payment type",form);
        await collector2.add_approve({"id":props.approvedata.id,
                                      "student":JSON.parse(JSON.stringify(props.approvedata.student)),
                                      "actual_type":props.approvedata.details[0].payment_type.actual_type,
                                      "authid":props.approvedata.details[0].payment_type.authid,
                                      "cardno":String(props.approvedata.details[0].payment_type.cardno),
                                      })
        if (collector2.$state.error){
          theme.pushErrorMessage(collector2.$state.error);
          await collector2.removeError()
        }
        else if(collector2.$state.approve){
          theme.pushMessage(collector2.$state.approve.message);
            router.push(`/approve_update`);
            location.reload()
        }
      } 
      else if(props.approvedata.details[0].amount && props.approvedata.details[0].payment_type){
        console.log("amount & ptype");
        await collector2.add_approve({"id":props.approvedata.id,
                                      "student":JSON.parse(JSON.stringify(props.approvedata.student)),
                                      "actual_amount":props.approvedata.details[0].amount.actual_amount,
                                      "actual_type":props.approvedata.details[0].payment_type.actual_type,
                                      "authid":props.approvedata.details[0].payment_type.authid,
                                      "cardno":String(props.approvedata.details[0].payment_type.cardno),
                                      })
        if (collector2.$state.error){
          theme.pushErrorMessage(collector2.$state.error);
          await collector2.removeError()
        }
        else if(collector2.$state.approve){
          theme.pushMessage(collector2.$state.approve.message);
            router.push(`/approve_update`);
              location.reload()
        }
      }  
      else{
        await collector2.add_approve({"id":props.approvedata.id,
                                      "student":JSON.parse(JSON.stringify(props.approvedata.student)),
                                      })
        if (collector2.$state.error){
          theme.pushErrorMessage(collector2.$state.error);
          await collector2.removeError()
        }
        else if(collector2.$state.approve){
          theme.pushMessage(collector2.$state.approve.message);
            router.push(`/approve_update`);
              location.reload()
        }
      }   
    }
    catch(error){
      console.log("vue error",error)
    }

    

}

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)

const termsconditions = computed(() => props.termsdata)

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const confirm = () => confirmCancel('confirm')

const cancel = () => confirmCancel('cancel')
</script>

<template>
  <overlay
    @overlay-click="cancel"
  >    
    <card-component
      :title="title"
      class="shadow-lg w-full sm:w-4/5 md:w-8/12 lg:w-3/4 z-50 h-850px"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
      @submit.prevent="submit"
    >
      <div class="space-y-3">
        <h1
          v-if="largeTitle"
          class="text-2xl"
        >
          {{ largeTitle }}
        </h1>
      </div>


      <!-- <field label="Name">
        <controlled
          v-model="props.approvedata.student.student.name"
          :icon-left="mdiAccount"
          name="Name"
        />
      </field> -->

    <div class="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-2">

        <field label="Updated Amount">
            <controlled
            v-model="props.approvedata.student.amount"
            :icon-left="mdiCashMultiple"
            name="Updated Amount"
            
            />
        </field>
        
      
        <field label="Updated Payment Type" class="h-6 height">
            <controlled
            v-model="props.approvedata.student.type"
            :icon-left="mdiCashMultiple"
            name="Updated Payment Type" 
            />
        </field>
    

        <field v-if="props.approvedata.details[0].amount && props.approvedata.details[0].amount.actual_amount" label="Actual Amount Paid">
          <controlled
            v-model="props.approvedata.details[0].amount.actual_amount"
            :icon-left="mdiCashMultiple"
            name="Updated Payment Type" 
          />
        </field>

        <field v-if="props.approvedata.details[0].payment_type && props.approvedata.details[0].payment_type.actual_type" label="Actual Payment Type">
          <controlled
            v-model="props.approvedata.details[0].payment_type.actual_type"
            :icon-left="mdiCashMultiple"
            name="Actual Payment Type" 
          />
        </field>
      </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-2">
        <field v-if="props.approvedata.details[0].payment_type && props.approvedata.details[0].payment_type.authid" label="Auth ID">
          <controlled
            v-model=props.approvedata.details[0].payment_type.authid
            :icon-left="mdiCashMultiple"
            name="Actual Payment Type" 
          />
        </field>

        <field class="h-1" v-if="props.approvedata.details[0].payment_type && props.approvedata.details[0].payment_type.cardno" label="Card Number">
          <controlled
            v-model=props.approvedata.details[0].payment_type.cardno
            :icon-left="mdiCashMultiple"
            name="Actual Payment Type" 
            class="h-1"
          />
        </field>
    </div>

      <!-- <field label="Comment" :error="hasError8" help="Enter the Comment" >
        <control
          v-model="form.comment"
          :icon-left="mdiComment"
          name="Enter the Comment"
          :error="hasError8"
          placeholder="Enter the Comment"
          type="textarea"
        />
      </field> -->
          

        <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              label="Approve"
              color="info"
              type="submit"
              @click="submit"
              class="pt-1 pb-1"
            />
          </jb-buttons>
        </level>
      </template>

  
    </card-component>
  </overlay>
</template>
