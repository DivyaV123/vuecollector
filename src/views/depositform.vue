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
          Cash in Hand : 
          <span class="border-2 border-teal-700 rounded-md py-1 px-1 text-sm">{{yet_to_deposit.total_amount}}</span>
        </label>
        <label class="mx-3">
          Yet to Verify Amount : 
          <span class="border-2 border-teal-700 rounded-md py-1 px-1 text-sm">{{yet_to_deposit.yet_to_verify}}</span>
        </label>
        </div>

        <div class="flex items-end justify-end text-blue-400 font-semibold m-2">
        
        </div>

  <card-component
      card-class="w-11/12 md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl" card-rounded="rounded-lg"
      form
      @submit.prevent="submit"
    >
  
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 my-1">
      <small>
        <field label="Amount" :error="amountError" help="Enter the Amount" class="box-border w-50 p-2 border-2 border-gray-600">
          <control
            v-model="form.amount"
            :icon-left="mdiCashMultiple"
            name="amount"
            placeholder="Enter the Amount"
            type="number"
          />
        </field>
      </small>

      <small>
        <field label="Confirm Amount" :error="amountError" help="Confirm the Amount" class="box-border w-50 p-2 border-2 border-gray-600">
          <control
            v-model="form.camount"
            onpaste="return false"
            :icon-left="mdiCashMultiple"
            name="confirmamount"
            placeholder="Confirm the Amount"
            type="password"
            autocomplete="new-password"
          />
        </field>
      </small>

      <small>
        <field label="Bank" :error="bankError" class="box-border w-50 p-2 border-2 border-gray-600" help="Select the Bank" >
          <Multiselect
            placeholder = "Select the Bank"
            v-model="form.details.bank"
            :options="banks"
            valueProp = "id"
            label="displayname"
            searchable
            :object="true"
            track-by = "name"
            :classes="selectClasses"     
          />
        </field>
      </small>
      
      <small>
        <field
          label="Deposit ID"
          :error="didError"
          help="Enter the Deposit Id"
          class="box-border w-50 p-2 border-2 border-gray-600"
        >
          <control
            v-model="form.details.deposit_id"
            :icon-left="mdiIdentifier"
            name="Deposit Id"
            placeholder="Deposit Id"
          />
        </field>
      </small>
      
      <small>
        <field label="Deposit Date & Time" :error="datetimeError" help="Enter the deposit date and time" class="h-[106px] box-border w-50 p-2 border-2 border-gray-600">
          <input 
            type="datetime-local" 
            class="py-2 placeholder-gray-200 text-gray-200 bg-gray-800 rounded text-sm w-full pl-6" 
            v-model="form.details.date_time" 
            :max="dayjs(new Date).format('YYYY-MM-DDTHH:mm')" 
            :min="dayjs(new Date).format('HH:mm')"
          >
        </field>
      </small>  
      </div>

    
      <div class="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-1"> 
        <small>
          <field label="Challan" class="box-border p-2 py-2 w-50 border-2 border-gray-600" :error="chalanError" help="Upload the Challan">
            <div class="flex h-[34px]">
              <input
                class="
                  h-9
                  border border-gray-700
                  py-1
                  placeholder-gray-200
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
                onchange="document.getElementById('img-show').src = window.URL.createObjectURL(this.files[0]); document.getElementById('img-show').style.height = '36px'; document.getElementById('img-show').style.width = '30%'"
                
              />
              <img id="img-show" v-if="isSaveOpen" class="ml-2" />
            </div>
          </field>
        </small>

      <small>
        <field
          label="Deposited By"
          :error="depositorError"
          help="Deposited By"
          class="box-border w-50 p-2 border-2 border-gray-600"
        >
          <control
            v-model="form.details.deposited_by"
            :icon-left="mdiAccount"
            name="Enter Depositer Name"
            placeholder="Depositer Name"
          />
        </field>
      </small>
  
      <small>
        <field label="Comment" help="Enter the Comment" class="box-border px-2 w-50 p-1 border-2 border-gray-600">
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
import { mdiAccount,mdiCashMultiple,mdiIdentifier,mdiComment } from '@mdi/js'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector";

const route = useRoute();
const router = useRouter();
const theme = themeStore();
const user = sessionStore();
const collector = collectorStore()

const form = reactive({
    amount : '',
    camount:'',
    chalan: null,
    branch:null,
    details:{
      bank:null,
      deposited_by: '',
      deposit_id :'',
      date_time:'',
      comment:''
    }    
})

const userbranches = computed(() => { return user.user.branches})
const branchdetails = computed(() => { return user.user})

const redirect = ref('depositlist')

const pageLoading = ref(false)
const isSaveOpen = ref(true)
const amountError = ref(false)
const camtError = ref(false)
const bankError = ref(false)
const depositorError = ref(false)
const didError = ref(false)
const datetimeError = ref(false)
const chalanError = ref(false)
const branchError = ref(false)

const banks = computed(()=> {
  return collector.bank
})

const yet_to_deposit = computed(() => {
  return collector.yet_to_deposit
}); 

function  onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      for (const name in files) {
        if (files.hasOwnProperty(name)) {
              form.chalan = files[name];
              if (form.chalan.size >= 5242880) {
              alert("Image size should be less than 5MB");
              // $refs.file.value = "";
              } 
              else {
                form.chalan = files[name];     
              }
        }
      }
    }

onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Bank Deposit Form")
  if (!user.loggedIn) {
    router.push("login");
  } 
  pageLoading.value = true
  await collector.getBank() ; 
  await collector.getyettodeposit() ;  
  const  time = dayjs(new Date).format("YYYY-MM-DDTHH:mm");
  form.details.date_time = time
   pageLoading.value = false
});


const submit = async () => {
  let valid = true
  if(form.amount === "" || form.amount<=0){
      amountError.value = "This field is required"
      theme.pushErrorMessage("Amount is required & should be greater than 0!!")
      valid = false
  }
  if(form.amount){
    if(Number(form.amount) > yet_to_deposit.value.total_amount){
      amountError.value = "This field is required"
      theme.pushErrorMessage("Amount should not be greater than Cash in Hand")
      valid = false
    }
  }
  if(form.camount === ""){
      camtError.value = "This field is required"
      theme.pushErrorMessage("Confirm Amount is required")
      valid = false
  }
  if(form.amount != form.camount){
      amountError.value = "This field is required"
      camtError.value = "This field is required"
      theme.pushErrorMessage("Confirmed amount is not equal to the entered amount")
      valid = false
  }
  if(form.details.bank === null){
      bankError.value = "This field is required"
      theme.pushErrorMessage("Bank is required")
      valid = false
  }
  if(form.details.deposit_id === ""){
      didError.value = "This field is required"
      theme.pushErrorMessage("Deposit ID is required")
      valid = false
  }
  if(form.details.date_time === ""){
      datetimeError.value = "This field is required"
      theme.pushErrorMessage("Deposit date & time is required")
      valid = false
  }
  if(form.chalan === null){
      chalanError.value = "This field is required"
      theme.pushErrorMessage("Challan is required")
      valid = false
  }
  if(form.chalan && (form.chalan.type != 'image/png' && form.chalan.type != 'image/jpeg' && form.chalan.type !='image/svg' && form.chalan.type !='image/jpg')){
      chalanError.value = "This field is required"
      theme.pushErrorMessage("Uploaded Challan should be of type png/svg/jpeg/jpg")
      valid = false
  }
  if(form.chalan && form.chalan.size>=5242880){
      theme.pushErrorMessage("Challan size should be less than 5MB")
      document.getElementById('file').value = "";
      document.getElementById('img-show').src = "";
      form.chalan=null
      chalanError.value = "Size of the challan should be less than 5MB"
      valid = false
    }
  if(form.details.deposited_by === ""){
      depositorError.value = "This field is required"
      theme.pushErrorMessage("Depositor name is required")
      valid = false
  }
  
  if(valid===true){
    pageLoading.value = true
    try{
        // const time= dayjs(form.details.date_time).format("DD-MM-YYYY HH:mm");
        const time= dayjs(form.details.date_time).format("YYYY-MM-DDTHH:mm");
        const data = new FormData();
          data.append("amount",form.amount)
          data.append("image", form.chalan, form.chalan.name);     
          data.append("details", JSON.stringify({
                          "bank":{
                            "id":form.details.bank.id,
                            "name":form.details.bank.name,
                            "displayname":form.details.bank.displayname,
                          },
                          "deposited_by": form.details.deposited_by, 
                          "deposit_id":form.details.deposit_id,
                          "date_time":time,
                          "comment":form.details.comment,
                    }));
          await collector.addBankdeposit(data)
          pageLoading.value = false
          isSaveOpen.value = false
        if (collector.$state.error){
          theme.pushErrorMessage(collector.$state.error);
          await collector.removeError()
        }
        else if(collector.$state.deposit.id){
          isSaveOpen.value = false
          theme.pushMessage(collector.$state.deposit.message);
          router.push( `/depositlist`)
        }
      }
      catch(error){
        theme.pushMessage("Something went wrong!!")
      }    
  }
  }


</script>

