<script setup>
import { ref,onBeforeMount, computed } from 'vue'
import ApproveList from '@/components/ApproveList.vue'
import CardComponent from '@/components/CardComponent.vue'
import { useRouter,useRoute } from "vue-router";
import { sessionStore } from "../stores/session";
import { themeStore } from "../stores/theme"
const theme = themeStore();
const router = useRouter();
const user = sessionStore();

onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Approve Wrong Updates")
  if (!user.loggedIn) {
    router.push("login");
  } 
});


</script>

<template>

      <card-component class="mb-6" has-table>
      <approve-list  />          
    </card-component>
</template>



