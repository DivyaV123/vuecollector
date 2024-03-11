<template>
 <div>
    <figure class="flex items-right" v-if="props.image!=null">
        <img :src="`https://gotest.qspiders.com/images/${props.image}`" class = "max-w-full h-auto rounded-full" alt="Student has not added the image">
    </figure>
    <figure class="flex items-right" v-else>
        <img src="" class = "max-w-full h-auto rounded-full" alt="Student has not added the image">
    </figure>

  </div>
</template>


<script setup>
import { computed } from 'vue'
import { themeStore } from "../stores/theme"
const theme = themeStore();

const props = defineProps({
  username: {
    type: String,
    default: null
  },
  bg: {
    type: String,
    default: 'bg-gray-100 dark:bg-gray-800'
  },
  api: {
    type: String,
    default: 'api/avataaars'
  },
  button: Boolean,
  image :String
})
const items = computed(() => props.username);


</script>