<script setup>
import { computed } from 'vue'
import { mdiClose } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import Overlay from '@/components/Overlay.vue'
import { themeStore } from "../stores/theme"
const theme = themeStore();


import { sessionStore } from "../stores/session";
import { useRouter } from "vue-router";

const router = useRouter();
const user = sessionStore();


const props = defineProps({
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
   scopy1: {
    type: String,
    default: null
  },
  dep1: {
    // type: Array,
    type: String,
    default: null
  },
  mcopy1: {
    type: String,
    default: null
  },
  button: Boolean
})
const items = computed(() => props.scopy1);
const items1 = computed(() => props.dep1);
const items2 = computed(() => props.mcopy1);

// console.log("in image resize");
// console.log("item-resized image",items.value);
// console.log("resized image",items1.value);

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})


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
      class="shadow-lg w-full h-450px md:w-3/5 lg:w-2/3 z-50 overflow-y-scroll"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
    >
      
 <div >
   
    <figure class="ml-[18px] justify-start" v-if="items != null"> 
          <img :src="`https://gotest.qspiders.com/images/${items}`"  class = " w-[100%] h-[100%] rounded-lg "  @click="imageresize=true">
    </figure>

    <figure class="ml-[18px] justify-start" v-if="items2 != null"> 
          <img :src="`https://gotest.qspiders.com/copies/${items2}`"  class = " w-[100%] h-[100%] rounded-lg "  @click="imageresize=true">
    </figure>


    <figure class="ml-[18px] justify-start" v-if="items1 != null"> 
        <!-- <div  v-if="items1.length ==1">      -->
          <img :src="`https://gotest.qspiders.com/images/${items1}`" class = " w-[100%] h-[100%] rounded-lg "  @click="imageresize=true">
        <!-- </div> -->

        <!-- <div  v-if="items1.length > 1">  
          <div v-for="multi in items1" :key="multi">   
            <img :src="`https://gotest.qspiders.com/images/${multi}`" class = " w-[100%] h-[100%] rounded-lg "  @click="imageresize=true">
          </div>
        </div> -->
      
    </figure>
    

    
  </div>

      <template #footer>
        <level mobile>
          <jb-buttons>
            
            <jb-button
              v-if="hasCancel"
              label="Cancel"
              color="warning"
              outline
              @click="cancel"
            />
          </jb-buttons>

          
        </level>
      </template>
    </card-component>
  </overlay>
</template>