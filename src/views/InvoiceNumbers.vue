<script setup>
import { onBeforeMount, ref} from 'vue'
import InvoicenumList from '@/components/InvoicenumList.vue'
import CardComponent from '@/components/CardComponent.vue'
import { themeStore } from "../stores/theme"
const theme = themeStore();
import { useRouter,useRoute } from "vue-router";
const router = useRouter();
import { sessionStore } from "../stores/session";
const user = sessionStore();


onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Invoice Numbers List")
  if (!user.loggedIn) {
    router.push("login");
  } 
  // window.onpopstate = event => {
  //           router.push("/invoice_list");
            
  //       };
});

</script>

<template>

      <card-component class="mb-6" has-table>
      <invoicenum-list />
    </card-component>
    
</template>



