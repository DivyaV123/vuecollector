<script setup>
import { ref,computed,onBeforeMount } from 'vue'
import { useRouter,useRoute } from "vue-router";
import CarddepositList from '@/components/CarddepositList.vue'
import CardComponent from '@/components/CardComponent.vue'
import { themeStore } from "../stores/theme"
const theme = themeStore();
import { sessionStore } from "../stores/session";
import { collector_Store } from "../stores/collector2"
const router = useRouter();
const user = sessionStore();
const collector2 = collector_Store()

const yettodeposit = computed(() => {
  return collector2.cardmap["Yet to Settle"]
});  

onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Settlement Statement List")
  if (!user.loggedIn) {
    router.push("login");
  } 
  await collector2.getYetToSettle() ;
  
});


</script>

<template>

  <!-- <div class="flex items-end justify-end text-blue-400 m-4 font-semibold">
        <label>
          Yet to Map Card Amount : 
          <span v-if="yettodeposit > 0" class="border border-gray-100 p-2">{{yettodeposit}}</span>
          <span v-else class="border border-gray-100 p-2">0</span>
        </label>
      </div> -->

  <card-component class="mb-6" has-table>
    <carddeposit-list  />   
  </card-component>

</template>



