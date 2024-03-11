<template>
  <div>
  

  <!-- <modal-box
      v-model="isModalActive"
      title="Search & Pay" >
  
      <card-component
        card-class="w-11/12 md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl" card-rounded="rounded-lg"
        :class="[cardClassAddon]"
        form
        @submit.prevent="submit"
      >

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
      
      <field label="Contact Number" :error="hasError1" help="Please Enter Student's Contact Number">
        <control
          v-model="form.number"
          :error="hasError1"
          :icon-left="mdiCellphone"
          name="number"
          placeholder="eg:9437741234"
          type="number"
        />
      </field>

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
    
  </modal-box>

        <div class="grid place-content-end mt-4 mr-4">
            <jb-button
              color="info"
              label="Search & Pay"
              @click="isModalActive = true"
            />
        </div>
   -->

<router-link :to="`/searchpay`">
   <div class="grid place-content-end mt-4 mr-4">
            <jb-button
              color="info"
              label="Search & Pay"
            />
        </div>
</router-link>

        <div class="grid place-content-center mt-8">
            <qrcode-stream @decode="onDecode"></qrcode-stream>
        </div>
  </div>


</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import ModalBox from '@/components/ModalBox.vue'
import MainSection from '@/components/MainSection.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import { mdiCellphone,mdiMail,mdiClose } from '@mdi/js'
import CardComponent from '@/components/CardComponent.vue'
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector";
import { themeStore } from "../stores/theme"

const route = useRoute();
const router = useRouter();
const user = sessionStore();
const collector = collectorStore()
const theme = themeStore();


const form = reactive({
  email: '',
  number: '',
})


const hasError = ref(false)
const hasError1 = ref(false)

const cardClassAddon = computed(() => hasError.value || hasError1.value ? 'animate-shake' : '')

const isModalActive = ref(false)

const result = ref("");
const error = ref("");
const ids_date = ref("")
const ids = ref("")


const number =(value) =>{
if (/\s+/g.test(value))
        {
            return  form.number;
        } 
}

//  let num = formValues[key].replace(/\s+/g, '')
//         if (num.length < 10 || isNaN(num)) {

const email =(value) =>{   
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
        {
            return  form.email;
        } 
    }

const onDecode = async(result) => {
 ids_date.value = result.substring(0, result.lastIndexOf("/") );
 ids.value = ids_date.value.substring(0, ids_date.value.lastIndexOf("/") );
  if(ids.value && (/^[0-9]+$/.test(ids.value))){
    router.push(`/scourselist/?id=${ids.value}`)
  }
  else{
    theme.pushMessage("Invalid QR Code")
  }
}

onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Scan QR Code of Student")
  if (!user.loggedIn) {
    router.push("/login");
  } 
  await collector.getbranchid();
  window.onpopstate = event => {
            router.push("/");
            
        };
});

const submit = async () => {
  if(form.email === "" && form.number ==="")
  {
    hasError.value = true
    hasError1.value = true
    theme.pushErrorMessage("Please fill either Email or Number");
  }
  else if(form.email && email(form.email) === undefined)
  {
    hasError.value = true
    theme.pushErrorMessage("Email is Invalid");
  }
  else if(form.number && number(form.number) === undefined)
  {
    hasError1.value = true
    theme.pushErrorMessage("Contact Number is Invalid");
  }
  else{
     try{
      if(form.email || form.number || ids.value){
        if (form.number){
          router.push(`/scourselist, query: { contact: form.contact }`); 
        }
        if (form.email){
          router.push(`/scourselist?query: { email: form.email }`); 
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
