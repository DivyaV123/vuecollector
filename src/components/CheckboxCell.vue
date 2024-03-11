<script setup>
import { ref, watch } from 'vue'

const props =  defineProps({
  type: {
    type: String,
    default: 'td'
  },
  checkTrue:{
    type:Boolean,
    default: false
  },
  check_True:{
    type:Boolean,
    default: false
  }
})

const emit = defineEmits(['checked'])

const checked = props.checkTrue?ref(true):ref(false)



watch(checked, newVal => {
  emit('checked', newVal)
})
</script>

<template>
  <component
    :is="type"
    class="checkbox-cell"
  >
    <label class="checkbox">
      <input
        v-model="checked"
        type="checkbox"
      >
      <span class="check" />
    </label>
  </component>
</template>
