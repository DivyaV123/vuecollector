<template>
<div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
    <div>
        <div class="flex items-end justify-end text-gray-200 font-semibold m-2">
        <label>
          Yet to Settle Amount : 
          <span class="border-2 border-teal-700 rounded-md py-1 px-1 text-sm">{{yet_to_settle.total_amount}}</span>
        </label>
         <label class="mx-3">
          Yet to Verify Amount : 
          <span class="border-2 border-teal-700 rounded-md py-1 px-1 text-sm">{{yet_to_settle.yet_to_verify}}</span>
        </label>
        </div>


  <card-component
      card-class="w-11/12 md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl" card-rounded="rounded-lg"
      form
      @submit.prevent="submit"
    >
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 my-2">
      <small>
        <field label="Settlement Date" :error="dateError" help="Enter the Settlement date" class="box-border w-50 p-2 border-2 border-gray-600 h-[106px]">
          <input 
            type="date" 
            class="py-2 placeholder-gray-200 text-gray-200 bg-gray-800 rounded text-sm w-full pl-6" 
            v-model="form.details.date" 
            :max="dayjs(new Date).format('YYYY-MM-DD')" 
          >
        </field>
      </small>

      <small>
        <field
          label="Settlement Amount"
          :error="amountError"
          help="Enter the Settlement Amount"
          class="box-border w-50 p-2 border-2 border-gray-600"
        >
          <control
            v-model="form.amount"
            :icon-left="mdiCashMultiple"
            name="Enter Settlement Amount"
            placeholder="Settlement Amount"
            type="number"
          />
        </field>
      </small>

      <small>
        <field
          label="Confirm Settlement Amount"
          :error="camountError"
          help="Confirm the Settlement Amount"
          class="box-border w-50 p-2 border-2 border-gray-600"          
        >
          <control
            v-model="form.camount"
            onpaste="return false"
            :icon-left="mdiCashCheck"
            name="Confirm Settlement Amount"
            placeholder="Confirm Settlement Amount"
            type="password"
            autocomplete="new-password"
          />
        </field>
      </small>

      <small>
        <field
          label="Settlement ID/Batch Number"
          :error="sidError"
          help="Enter the Settlement ID/Batch Number"
          class="box-border w-50 p-2 border-2 border-gray-600"
        >
          <control
            v-model="form.settlementid"
            :icon-left="mdiIdentifier"
            name="Enter Settlement ID/Batch Number"
            placeholder="Settlement ID/Batch Number"
          />
        </field>
      </small>
    </div>

    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-2">
      <small>
       <field label="Settlement Copy" :error="settlementError" class="box-border p-2 w-50 border-2 border-gray-600" help="Upload the Settlement Copy">
          <div class="flex h-[34px]">
            <input
              class="
                h-9
                border border-gray-700
                placeholder-gray-200
                py-1
                text-gray-200
                bg-gray-800
                rounded
                text-sm
                outline-white
                focus:outline-white focus:ring
                w-full
                pl-6
              "
              id="file"
              ref="file"
              type="file"
              name="file"
              accept="image/*"
              v-on:change="onFileChange"
              onchange="document.getElementById('img-show').src = window.URL.createObjectURL(this.files[0]);  document.getElementById('img-show').style.height = '36px'; document.getElementById('img-show').style.width = '30%'"

            />
            <img id="img-show" v-if="isSaveOpen" class="ml-2" />
          </div>
        </field>
      </small>

    <small>
      <field label="Comment" help="Enter the Comment" class="box-border h-30 px-2 w-50 p-1 border-2 border-gray-600"> 
          <control
            v-model="form.details.comment"
            :icon-left="mdiComment"
            name="Enter the Comment"
            placeholder="Enter the Comment"
            type="textarea"
          />
        </field>
    </small>

   </div>
    
      <template #footer>
          <jb-buttons>
            <jb-button
              label="Save"
              type="submit"
              color="info"
              class="pt-1 pb-1"
            />    
          </jb-buttons>
          
      </template>
    </card-component>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useRouter,useRoute } from "vue-router";
import Multiselect from '@vueform/multiselect'
import { selectClasses } from '@/selectcss.js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import MainSection from '@/components/MainSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import dayjs from 'dayjs';
import {mdiCashMultiple,mdiCashCheck,mdiComment,mdiIdentifier} from '@mdi/js'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collector_Store } from "../stores/collector2";

const route = useRoute();
const router = useRouter();
const theme = themeStore();
const user = sessionStore();
const collector2 = collector_Store()


const form = reactive({
    amount:'',
    camount:'',
    settlementid:'',
    settlement:null,
    details:{
      comment:'',
      date:''
    }
})

const pageLoading = ref(false)
const isSaveOpen = ref(true)
const nameError = ref(false)
const amountError = ref(false)
const camountError = ref(false)
const sidError = ref(false)
const settlementError = ref(false)
const dateError = ref(false)

const yet_to_settle = computed(() => {
  return collector2.cardmap
});

function  onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      for (const name in files) {
        if (files.hasOwnProperty(name)) {
          form.settlement = files[name];
          if (form.settlement.size >= 5242880) {
            alert("Image size should be less than 5MB");
            $refs.file.value = "";
          } else {
            form.settlement = files[name];
          }
        }
      }
    }


onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Bank Device Settlement Form")
  if (!user.loggedIn) {
    router.push("login");
  } 
  pageLoading.value = true
  await collector2.getYetToSettle() ;
  const  date = dayjs(new Date).format("YYYY-MM-DD");
  form.details.date = date
  pageLoading.value = false
});

const submit = async () => {
  let valid = true 
  if(form.details.date === ""){
      dateError.value = "This field is required"
      theme.pushErrorMessage("Settlement date is required")
      valid = false
  }
  if(form.amount === "" || form.amount<=0){
      amountError.value = "This field is required"
      theme.pushErrorMessage("Amount is required & should be greater than 0!!")
      valid = false
  }
  if(form.amount){
    if(Number(form.amount) > yet_to_settle.value.total_amount){
      amountError.value = "This field is required"
      theme.pushErrorMessage("Amount should not be greater than yet to settle amount")
      valid = false
    }
  }
  if(form.camount === ""){
      camountError.value = "This field is required"
      theme.pushErrorMessage("Confirm the Amount")
      valid = false
  }
  if(form.camount && form.amount != form.camount){
      amountError.value = "This field is required"
      camountError.value = "This field is required"
      theme.pushErrorMessage("Amount and Confirm Amount values should be equal!!!")
      valid = false
  }
  if(form.settlementid === ""){
      sidError.value = "This field is required"
      theme.pushErrorMessage("Settlement ID/Batch Number is Required")
      valid = false
  }
  if(form.settlement === null){
      settlementError.value = "This field is required"
      theme.pushErrorMessage("Upload the Settlement Copy")
      valid = false
  }
  if(form.settlement && (form.settlement.type != 'image/png' && form.settlement.type != 'image/jpeg' && form.settlement.type !='image/svg' && form.settlement.type !='image/jpg')){
      settlementError.value = "This field is required"
      theme.pushErrorMessage("Uploaded Settlement Copy should be of type png/svg/jpeg/jpg")
      valid = false
  }
  if(form.settlement && form.settlement.size>=5242880){
      theme.pushErrorMessage("Settlement Copy size should be less than 5MB")
      document.getElementById('file').value = "";
      document.getElementById('img-show').src = "";
      form.settlement=null
      settlementError.value = "Size of the settlement copy should be less than 5MB"
      valid = false
    }
  if(valid === true){
    pageLoading.value = true
    try{
        // const date= dayjs(form.details.date).format("DD-MM-YYYY");
        const date= dayjs(form.details.date).format("YYYY-MM-DD");
        const data = new FormData();
          data.append("amount",form.amount)
          data.append("settlementid",form.settlementid)
          data.append("image", form.settlement, form.settlement.name);     
          data.append("details", JSON.stringify({
                          "date":date,
                          "comment":form.details.comment,
                    }));
          await collector2.addSettlement(data)
          pageLoading.value = false
          isSaveOpen.value = false
        if (collector2.$state.error){
          theme.pushMessage(collector2.$state.error);
          await collector2.removeError()
        }
        else if(collector2.$state.settlement.id){
          isSaveOpen.value = false
          theme.pushMessage("Bank Device Settlement has been done!!!");
          router.push(`/card_payments`)          
        }
      }
      catch(error){
        theme.pushErrorMessage("Something went wrong,TRY AGAIN!!")
      }    

    }
}


</script>
