<script setup>
import { ref,onBeforeMount } from 'vue'
import BankdepositList from '@/components/BankdepositList.vue'
import CardComponent from '@/components/CardComponent.vue'
import { useRouter,useRoute } from "vue-router";
import { sessionStore } from "../stores/session";
import { themeStore } from "../stores/theme"
const theme = themeStore();

const router = useRouter();
const user = sessionStore();

onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Bank Deposit List")
  if (!user.loggedIn) {
    router.push("login");
  } 
});

</script>

<template>

  <card-component class="mb-6" has-table>
    <bankdeposit-list  />   
  </card-component>

</template>



