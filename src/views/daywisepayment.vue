<script setup>
import { onBeforeMount, ref} from 'vue'
import DayList from '@/components/DayList.vue'
import CardComponent from '@/components/CardComponent.vue'
import { themeStore } from "../stores/theme"
const theme = themeStore();
import { useRouter,useRoute } from "vue-router";
const router = useRouter();
import { sessionStore } from "../stores/session";
const user = sessionStore();


onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Daywise Cash Payment List")
  if (!user.loggedIn) {
    router.push("login");
  } 
  // window.onpopstate = event => {
  //           router.push("/daywisepayment");
            
  //       };
});

</script>

<template>

      <card-component class="mb-6" has-table>
      <day-list />
    </card-component>
    
</template>



