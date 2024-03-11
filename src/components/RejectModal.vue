<script setup>
import { computed,ref,reactive } from 'vue'
import { useRouter,useRoute } from "vue-router";
import { mdiClose,mdiComment } from '@mdi/js'
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
import { collector_Store } from "../stores/collector2"
import { themeStore } from "../stores/theme"
import { current } from 'tailwindcss/colors';
const route = useRoute();
const router = useRouter();
const user = sessionStore();
const collector = collectorStore();
const collector2 = collector_Store();
const theme = themeStore();

const currentPage = ref(1)
const pageLoading = ref(false)

const props = defineProps({
    rejectdata:Array,
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

const form = reactive({
    // id: props.propValues.value.id,
    // type : props.propValues.value.type,
    // invoiceno : props.propValues.value.invoiceno,
    comment:""
})

const propsdata = computed(() => props.rejectdata.value)
console.log("propsdata",props.rejectdata);
console.log("propsdata 2222",props.rejectdata.id);

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirm = async () => {
  let valid = true
  if(form.comment === ""){
      commenterror.value = "This field is required"
      theme.pushErrorMessage("Comment is required")
      valid = false
  }
  if(valid===true){
      pageLoading.value = true
        await collector2.add_rejectupdate({"id" : props.rejectdata.id ,
        "type" : props.rejectdata.type,"invoiceno" : props.rejectdata.invoice,"comment":form.comment})  
        if(collector2.$state.rejectupdate.message==="Wrongupdate request has been cancelled"){             
          setTimeout(function(){
            theme.pushMessage(collector2.rejectupdate.message)
            confirmCancel("confirm")
          }, 1000); 
      // pageLoading.value = false
        }
        else{
            theme.pushMessage(collector2.error);
            await collector2.removeError()
            value.value = false 
        }
  }
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
  </div>
      <div class="space-y-3">
          <span class="font-bold">Are you sure, that you want to cancel the wrong update request for invoice number <span class="underline text-red-500"> {{props.rejectdata.invoice}}?</span> </span>
        <slot />
        <field> 
        <control
          v-model="form.comment"
          :icon-left="mdiComment"
          name="Enter the Comment"
          :error="commenterror"
          placeholder="Enter the Comment"
          type="textarea"
        />
      </field>
      </div>
      
      <template #footer>
        <level mobile>
          <jb-buttons>
        
            <jb-button
              label="Yes"
              color="success"
              @click="confirm"
              class="mb-0 pt-1 pb-1"
            />
            <jb-button
              label="No"
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
