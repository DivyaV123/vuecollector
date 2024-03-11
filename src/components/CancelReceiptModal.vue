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
import { collector_Store } from "../stores/collector2"
import { collectorStore } from "../stores/collector"
import { themeStore } from "../stores/theme"
const route = useRoute();
const router = useRouter();
const user = sessionStore();
const collector2 = collector_Store();
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

const form = reactive({
  comment:""
})
const commenterror = ref(false)

const propsdata = computed(() => props.propValues)

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
    await collector2.cancelinvoice({"type" : "cancel",
    "invoiceno": props.propValues.invoiceno,"comment":form.comment  })               
    theme.pushMessage(collector2.cancel_invoice.message)
    collector.get_unsettlestudents()
    value.value = false
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
 
      <div class="space-y-3">
          <span class="font-bold">Are you sure, you want to cancel the invoice of Student <span class="underline text-red-600">{{propsdata.name}}</span> with Invoice Number <span class="underline text-red-600">{{propsdata.invoiceno}}</span> ?
              </span>
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
