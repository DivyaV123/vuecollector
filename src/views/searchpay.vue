<template>
<div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
  <div>
      <card-component
        card-class="w-11/12 md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl" card-rounded="rounded-lg"
        :class="[cardClassAddon]"
        form
        @submit.prevent="submit"
      >
      <div class="grid md:grid-cols-2 sm:grid-cols-2 gap-4 m-2">

        <field label="Contact Number" :error="hasError1" help="Please Enter Student's Contact Number" class="sm:h-6">
          <control
            v-model="form.number"
            :error="hasError1"
            :icon-left="mdiCellphone"
            name="number"
            type="number"
            placeholder="eg:9437741234"            
          />
        </field>

        <field label="Email" :error="hasError" help="Please Enter Student's Email">
          <control
            v-model="form.email"
            :error="hasError"
            :icon-left="mdiMail"
            name="email"
            placeholder="user@example.com"
            autocomplete="email"
          />
        </field>
      
  </div>

        <template #footer>
          <jb-buttons>
            <jb-button
              label="Search"
              type="submit"
              color="info"
            />
          </jb-buttons>
        </template>
   

    </card-component> 
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import MainSection from '@/components/MainSection.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import { mdiCellphone,mdiMail } from '@mdi/js'
import CardComponent from '@/components/CardComponent.vue'
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector";


const route = useRoute();
const router = useRouter();
const theme = themeStore();
const user = sessionStore();
const collector = collectorStore()

const form = reactive({
  email: '',
  number: '',
})
// \s+/g
const hasError = ref(false)
const hasError1 = ref(false)
const pageLoading = ref(false)

const cardClassAddon = computed(() => hasError.value || hasError1.value ? 'animate-shake' : '')

const email =(value) =>{   
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
        {
            return  form.email;
        } 
    }

// const number =(value) =>{
// if (/\s+/g.test(value))
//         {
//             return  form.number;
//         } 
// }


onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Search & Pay")
  if (!user.loggedIn) {
    router.push("login");
  }
});


const submit = async () => {
  if(form.email === "" && form.number ==="")
  {
    hasError.value = true
    hasError1.value = true
    theme.pushErrorMessage("Please fill either Email or Number");
  }
  // else if(form.number && form.number){

  // }
  else if(form.email && email(form.email) === undefined)
  {
    hasError.value = true
    theme.pushErrorMessage("Email is Invalid");
  }
  else{
     try{
      if(form.email || form.number){
        if (form.number){
          // let contact = String(form.number.replace("+", "%2B"))
          pageLoading.value = true
          router.push(`/scourselist?contact=${form.number}`); 
          pageLoading.value = false
        }
        if (form.email){
          pageLoading.value = true
          router.push(`/scourselist?email=${form.email}`); 
          pageLoading.value = false
        }
      }
    }
    catch(error){
      console.log("vue error",error)
    }
  }
}


</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>
