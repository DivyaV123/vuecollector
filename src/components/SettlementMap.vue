<script setup>
import { computed, reactive, ref, onBeforeMount } from 'vue'
import { mdiAccount,mdiIdentifier,mdiCheckboxMarkedCircle,mdiBankTransfer,mdiChevronUp } from '@mdi/js'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Controlled from '@/components/Controlled.vue'
import McopyAvatar from '@/components/McopyAvatar.vue'
import McopyCard from '@/components/McopyCard.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import { themeStore } from "../stores/theme"
import Icon from '@/components/Icon.vue'
import Divider from '@/components/Divider.vue'
import { useRouter,useRoute } from "vue-router";
import { sessionStore } from "../stores/session";
import { collector_Store } from "../stores/collector2"
import dayjs from 'dayjs';
const theme = themeStore();
const route = useRoute();
const router = useRouter();
const collector2 = collector_Store()
const user = sessionStore();
const perPage = 50;

const userbranches = computed(() => { return user.user.branch_id})

const scrollToTop= () =>{
    window.scrollTo(0,0);
  }

const checked = (map, client) => {
    const index = added_data.value.findIndex(object => {
  return object.id === client;
  });
  for(let i = 0; i <= index; i++ ){
      if(!checkedRows.value.includes(added_data.value[i].id)){
      checkedRows.value.push(added_data.value[i].id)
      checkedAmount.value.push(added_data.value[i].amount)
      added_data.value[i].map = true
      document.getElementById(`${added_data.value[i].id}`).disabled = true;  
      }
  }
     mappedAmount.value = collector2.getCardMapids(currentPage.value,client)
    mappedFinalAmount.value = computed(() => Number(collector2.mapcardids))
    form.students = client
    console.log("form.students",form.students);
  } 

 

const form = reactive(
  {
    settlement_id : route.params.id,
    mapped : 0,
    students : null
  }
)
const submitMappedData = async() => {
  form.mapped = mappedFinalAmount.value  
  try{
    await collector2.mapcardStudents({"settled_id":form.settlement_id,"branch":userbranches.value,"mapped":form.mapped,"students":form.students})
    if (collector2.$state.error){
      theme.pushErrorMessage(collector2.$state.error);
      await collector2.removeError()
    }
    else if(collector2.$state.mapcardstudent){
      theme.pushMessage("Mapped Successfully")
      if(route.params.redirect == 'settlementlist'){
          router.push(`/settlementlist`);
      }
      else{
        router.push('/summary')
      }
    }
  }
  catch(error){
    theme.pushErrorMessage("Something went wrong! Please Try again");
  }
}

const clear = async() => {
  mappedFinalAmount.value = 0
  checkedRows.value = []
  checkedAmount.value = []
  for(let i = 0; i < added_data.value.length; i++ ){
    if (added_data.value[i].map == true) {
      added_data.value[i].map = false    
      document.getElementById(`${added_data.value[i].id}`).disabled = false;
    }  
  }
  currentPage.value = 1
}


const checkedAmount = ref([])

const mappedAmount = ref(0)

const mappedFinalAmount = ref(0)

const checkedRows = ref([])

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode);

let items =ref([])
const added_data = ref([])
const currentPage = ref(1)

onBeforeMount(async () => {
  await collector2.getMapStudentsCard(route.params.branch) 
  items.value = collector2.$state.mapstudentscard
  added_data.value = items.value
});

const itemsCount = computed(() => collector2.mapcardcount)

const amount = computed(() => Number(route.params.amount))

const numPages = computed(() => Math.ceil(itemsCount.value / perPage));


const pageChange = async() => {
    currentPage.value++;
    await collector2.getMapStudentsCard(currentPage.value); 
    items.value = collector2.$state.mapstudentscard
    for (var i=0;i<items.value.length;i++){
      added_data.value.push(items.value[i])
    }
}

</script>

<template>  
<div>
<div class="one bg-gray-900 "> 
    <div class="one bg-gray-900 ">
      <span class="mt-4 ml-4 text-blue-400 text-xl">Total : {{ itemsCount }}</span>
      <span class="m-4 text-blue-400 text-xl">Page : {{currentPage}}</span>
    </div>
  <divider/>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3 m-4">
      <field label="Bank Settlement Amount" >
        <controlled
          :icon-left="mdiBankTransfer"
          v-model="amount"
          placeholder="amount" 
        />
      </field>

      <field label="Total Amount to be Mapped" >
        <controlled
          :icon-left="mdiIdentifier"
          placeholder="Total Amount to be Mapped"
          class=""
          v-model="mappedFinalAmount.value"
        />
      </field>

      <field>
        <jb-buttons class="md:py-10 mt-3">
          <small>
          <jb-button
            label="Map"
            type="submit"
            color="info"
            small
            @click="submitMappedData()"
          />

          <jb-button
            class=""
            @click="clear()"
            label="Clear"
            type="submit"
            color="white"
            small
          /> 

          <jb-button
            :icon="mdiChevronUp"
            @click="scrollToTop()"
            label=""
            type="submit"
            color="light"
          /> 
          </small>

        </jb-buttons>
      </field>
    </div>
    
  </div>

  
  <table class="">
        <thead class="sticky top-[53px] z-[9] bg-gray-900">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Mobile Number</th>
        <th>Email ID</th>
        <th>Paid Amount</th>
        <th>Invoice Number by QSP</th>
        <th>Date & Time of Payment</th>
        <th>Selected Students for Mapping</th>
        <!-- <th>Merchant Copy</th> -->
      </tr>
    </thead>

    <tbody>
       <tr
        v-for="(client, index) in added_data"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        <td data-label="ID">
          <small>
          {{ index+1 }}
          </small>
        </td>

        <td data-label="Name">
          <small>
          {{ client.student.name }}
          </small>
        </td>

        <td data-label="Mobile Number">
          <small>
          {{ client.student.contact[0].contact }}
          </small>
        </td>

        <td data-label="Email ID">
          <small>
          {{ client.student.email[0].email }}
          </small>
        </td>

        
        <td data-label="Paid Amount">
          <small>
          {{ client.course.paid }}
          </small>
        </td>

        <td data-label="Invoice Number by QSP">
          <small>
          {{ client.invoiceno }}
          </small>
        </td>

        <td data-label="Date & Time of Payment">
          <small>
          <!-- {{ client.date }} -->
          {{dayjs(client.date).format("DD-MM-YYYY hh:mm:ss")}}
          </small>
        </td>

        <td data-label="Selected Students for Mapping" >
          <small>
          <div v-if="client.wrongupdated == false" >
            <div class="form-check flex justify-center">
              <input :id = "`${client.id}`" class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer" 
                type="checkbox" value="" 
                v-model="client.map"
                @click="checked(client.map, client.id)">
            </div>
          </div>

          <div v-else class="text-red-600 text-center">
            {{ "Can't able to Map"}}
          </div>
       </small>
        </td>
        
        <!-- <td data-label="Merchant Copy">
          <small>
          <div class="mx-auto">
            <mcopy-card :image=client.thumbnail100 :image1=client.merchant />
          </div>
          </small>
        </td> -->
 
      </tr>
    </tbody>
  </table>


  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level mobile>
      <jb-buttons glue>
        <jb-button v-if="currentPage<numPages"
          label="show more"
          :outline="darkMode"
          small
          no-focus-ring
          @click="pageChange()"
        />
      </jb-buttons>
      <small>Page {{ currentPage }} of {{ numPages }}</small>
    </level>
  </div> 
  </div>
</template>

<style>
.one {
  position: sticky;
  top: 0;
  z-index: 2;
  bottom: 0px;   
}

</style>
