<template>
 <div>

  <figure class="flex " v-if="props.image!=null">
    <!-- <span v-if="typeof(props.image)== 'object'">
      <span v-if="props.image.length == 1 ">
        <img :src="props.image" class = "max-w-full h-24" alt="No Image"  @click="imageresize=true">
      </span>

      <div v-if="props.image.length > 1"> 
         <img :src="props.image[0]" class = "max-w-full h-20" alt="No Image"  @click="imageresize=true">
        <button class= "text-teal-500 font-bold" @click="imageresize=true">+{{props.image.length - 1}} more</button>
      </div>
    </span> -->

      <!-- <span v-if="typeof(props.image)=='string'"> -->
        <img :src="`https://gotest.qspiders.com/devices/${props.image}`" class = "max-w-full h-16" alt="No Image"  @click="imageresize=true">
      <!-- </span> -->

    </figure>

    <figure class="flex " v-else>
        <img src="" class = "max-w-full h-auto" alt="No Image">
    </figure>

    <section>
    <ImageResize v-model="imageresize"  has-cancel :scopy1="items1" />
</section>
  </div>
</template>


<script setup>
import { computed,ref } from 'vue'
import { themeStore } from "../stores/theme"
import ImageResize from '@/components/ImageResize.vue'
const theme = themeStore();
const imageresize= ref(false)


const props = defineProps({
  scopy:{
    type: String,
    default: null
  },
  scopy1: {
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
const items = computed(() => props.scopy);
const items1 = computed(() => props.scopy1);

</script>