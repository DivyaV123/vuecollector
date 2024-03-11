<script setup>
import { computed } from 'vue'
import ErrorbarBar from '@/components/ErrorbarBar.vue'
import { themeStore } from "../stores/theme"
const theme = themeStore();

defineProps({
  active: Boolean
})


const errormessages = computed(() => theme.errormessages)


const expireed = () => {
  theme.shiftErrorMessage()
}


</script>

<template>
  
  <div class="fixed inset-0 flex flex-col-reverse p-9 overflow-hidden z-100 pointer-events-none">
    <errorbar-bar
      v-for="errormessage in errormessages"
      :key="errormessage.ts"
      :active="true"
      :errormessage="errormessage"
      @expireed="expireed"
    />
  </div>
</template>
