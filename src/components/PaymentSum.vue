<script setup>
import { computed, ref ,reactive,onBeforeMount} from 'vue'
import { mdiCheckboxMarkedCircle,mdiMagnify,mdiCloseCircleOutline,mdiAttachment,mdiApplicationEditOutline, mdiCalendarRange } from '@mdi/js'
import { useRouter,useRoute } from "vue-router";
import CheckboxCell from '@/components/CheckboxCell.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import { themeStore } from "../stores/theme"
import Icon from '@/components/Icon.vue'
import dayjs from 'dayjs';
import { sessionStore } from "../stores/session";
import { collector_Store } from "../stores/collector2"
const collector2 = collector_Store()
const route = useRoute();
const user = sessionStore();
const theme = themeStore();

const perPage = 25;
const pageLoading = ref(false)
const type = ref('cash')
const type1 = ref('card')
const type2 = ref('merchant')
const type3 = ref('total')


const search = reactive({
    date:ref(""),
})

let params = ref('');

const date_selected1 = ref(dayjs(new Date()).format("YYYY-MM-DD"))

const searchParams = async() => {
    if (date_selected1.value) {
      search.date = dayjs(date_selected1.value).format("YYYY-MM-DD");
    } 
    else {
      date_selected1.value = dayjs(new Date()).format("YYYY-MM-DD")
      search.date = dayjs(new Date()).format("YYYY-MM-DD");
    }
    params = new URLSearchParams(search).toString();
    currentPage.value=1
    // await collector2.getSummary(currentPage.value,params);
    pageLoading.value = true
    await collector2.getSummary(search.date);
    pageLoading.value = false
}

const clear = async() => {
  pageLoading.value = true
  params ='';
  date_selected1.value =dayjs(new Date()).format("YYYY-MM-DD");
  await collector2.getSummary(dayjs(new Date()).format("YYYY-MM-DD"));
  pageLoading.value = false
}


const format = (date) => {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
}

onBeforeMount(async () => {
  // collector2.getbranchid()
  pageLoading.value = true
  await collector2.getSummary(dayjs(new Date()).format("YYYY-MM-DD"));  
  pageLoading.value = false
});

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)


const isModalActive = ref(false)

const currentPage = ref(1)

const itemsPaginated = computed(() => collector2.paysum)


</script>

<template>
<div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
 <div class="w-full bg-[#151D2B] sticky top-[48px] z-[9] py-2">
          <jb-button
            @click = "isModalActive =! isModalActive"
            label="Search"
            type="submit"
            color="info"
            small
            :icon="mdiMagnify"          
          /> 
        </div>
     <aside
    id="aside-right"
    class="
      w-60
      pr-1.5
      fixed
      z-20
      h-screen
      lg:h-screen-menu
      top-0
      lg:top-14
      bg-white
      border-l border-gray-100
      overflow-y-scroll
      transition-position
      dark:bg-gray-900
      dark:border-gray-700
      dark:scrollbar-thumb-gray-600
      dark:scrollbar-track-gray-800
      right-0
    "
    v-if="isModalActive"
  >
    <div>
      <div
        class="
          md:rounded
          dark:bg-gray-900/70
          block
          bg-white
          border border-gray-100
          dark:border-gray-900
          mb-4
        "
      >
        <header
          class="
            flex
            items-stretch
            border-b border-gray-100
            dark:border-gray-700
            mt-[50px]
            lg:mt-0
          "
        >
          <p class="flex items-center py-3 grow font-bold px-6">
            Search List
          </p>
          <a @click="isModalActive = false" class="flex items-center py-3 px-4 justify-center cursor-pointer">
            <span class="inline-flex justify-center items-center w-6 h-6"
              ><svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                class="inline-block"
              >
                <path
                  fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                ></path></svg
              ></span
            ></a
          >
        </header>
        <div class="p-2">
          <div class="mb-4">
            <div class="relative">
              <field label="Search by Date">
            <control
                v-model="date_selected1"
                :icon-left="mdiCalendarRange"
                placeholder="Search by Date"
                type="date"          
            />
          </field>
            </div>
          </div>          

          <div class="grid grid-cols-1 last:mb-0 mb-2">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                class="
                  inline-flex
                  cursor-pointer
                  justify-center
                  items-center
                  whitespace-nowrap
                  ring-blue-700
                  focus:outline-none
                  transition-colors
                  duration-150
                  border
                  bg-emerald-600
                  text-white
                  border-emerald-700
                  hover:bg-emerald-700
                  focus:ring
                  rounded
                "
                @click="searchParams()"
                type="button"
              >
                <span class="pl-1 pr-1">Search</span></button>
              <button
                class="
                  inline-flex
                  cursor-pointer
                  justify-center
                  items-center
                  whitespace-nowrap
                  ring-blue-700
                  focus:outline-none
                  transition-colors
                  duration-150
                  border
                  bg-red-600
                  text-white
                  border-red-700
                  hover:bg-red-700
                  focus:ring
                  rounded
                "
                @click="clear()"
                type="button"
              >
                <span class="pl-1 pr-1">Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>

  <table>
        <thead class="sticky top-[91px] z-[9] bg-gray-900">
      <tr>
        <th rowspan="2" class="text-center px-2">Date</th>
        <th colspan="3" class="text-center">Cash</th>
        <th colspan="3" class="text-center">Card</th>
        <th rowspan="2" class="text-center">Total Amount Collected</th>
        <!-- <th rowspan="2" class="text-center">Wrong Amount Update</th> -->
        <!-- <th rowspan="2" class="text-center"> Wrong Amount Count</th> -->
        <!-- <th rowspan="2" class="text-center"> Wrong Amount</th>
        <th rowspan="2" class="text-center"> Refund</th> -->

      </tr>

      <tr>
          <th class="text-center"><small> Cash Collected </small></th>
          <th class="text-center"><small>Cash in Hand </small></th>
          <th class="text-center"><small>Unverified Deposits </small></th>

           <th class="text-center"><small>Card Amount Collected </small></th>
          <!-- <th class="text-center"><small>Pending Merchant Copy </small></th> -->
          <th class="text-center"><small>Amount in Device </small></th>
          <th class="text-center"><small>Unverified Settlements </small></th>

      </tr>
    </thead>
    <tbody>
    
  
      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
      

        <td data-label="Date" class="text-center px-2">
          <small>
          {{ dayjs(client.date).format("DD-MM-YYYY") }}
          </small>
        </td> 

        <td data-label="Cash Collected" class="text-center ">
          <small>
          <span v-if="client.cash.cash_collected != null">
          <!-- <router-link :to="`/datewiselist/${client.date}/${type}`"> -->
            <span class="bg-cyan-800 py-1 px-2 rounded-md hover:border border-cyan-800 hover:bg-cyan-600 hover:border-cyan-600">{{ client.cash.cash_collected }}</span>
          <!-- </router-link> -->
          </span>
          <span v-else>
            <span class="bg-cyan-800 py-1 px-2 rounded-md hover:border border-cyan-800 hover:bg-cyan-600 hover:border-cyan-600">0</span>
          </span>
          </small>
        </td>

        <td data-label="Cash in Hand" class="text-center"> 
          <small>   
            <span  v-if="client.cash.cash_in_hand != null">{{client.cash.cash_in_hand}}</span>
            <span v-else>0</span>
          </small>
        </td>

        <td data-label="Unverified Deposits" class="text-center" >
          <small>
          <span v-if="client.cash.unverified_deposities != '0'">
          <!-- <router-link :to="{ path: '/depositlist', query: { date: client.date ,type:'unmap'} }" > -->

            <span class="bg-red-600 py-1 px-2 rounded-md hover:border border-red-700 hover:bg-red-500 hover:border-red-500 cursor-default">{{ client.cash.unverified_deposities }}</span>
          <!-- </router-link> -->
          </span>

          <span v-else>
            <span class="bg-red-600 py-1 px-2 rounded-md hover:border border-red-700 hover:bg-red-500 hover:border-red-500 cursor-default">{{ client.cash.unverified_deposities }}</span>
          </span>
          </small>
        </td>

        <td data-label="Card Amount Collected" class="text-center">
          <small>
          <span v-if="client.card.card_collected != null">
            <!-- <router-link :to="`/datewiselist/${client.date}/${type1}`"> -->
              <span class="bg-blue-600 py-1 px-2 rounded-md hover:border border-blue-600 hover:bg-blue-500 hover:border-blue-500">{{ client.card.card_collected }}</span>
            <!-- </router-link> -->
          </span>
          <span v-else>
            <span class="bg-blue-600 py-1 px-2 rounded-md hover:border border-blue-600 hover:bg-blue-500 hover:border-blue-500">0</span>
          </span>
          </small>
        </td>

        <!-- <td data-label="Pending Merchant Copy" class="text-center">
          <small>
          <span v-if="client.card.attach_merchant != '0 - None'">
            <router-link :to="`/pendingmcopy/${client.date}/${type2}`">
              <span class="bg-sky-700 p-1 rounded-md hover:border border-sky-200">{{ client.card.attach_merchant }}</span>
            </router-link>
          </span>

          <span v-else>
            <span class="bg-sky-700 p-1 px-3 rounded-md hover:border border-sky-200">{{ client.card.attach_merchant }}</span>
          </span> 
          </small>          
        </td> -->

        <!-- <td data-label="Pending Settlement Copy Mapping" class="text-center">
          <small>
          <span v-if="client.card.unmapped != null">
            <router-link :to="{ path: '/settlementlist', query: { date: client.date ,type:'unmap'} }" >
              <span class="bg-indigo-700 p-1 rounded-md hover:border border-indigo-200"> {{ client.card.unmapped }}</span>
            </router-link>
          </span>

          <span v-else>
            <span class="bg-indigo-700 p-1 px-3 rounded-md hover:border border-indigo-200">0</span>
          </span>
          </small>
        </td> -->

        <td data-label="Amount in Device" class="text-center">
          <small>
            <span  v-if="client.card.device_amount != null">{{ client.card.device_amount }}</span>
            <span v-else>0</span>
          </small>
        </td>

        <td data-label="Unverified Settlemnts" class="text-center">
          <small>
          <span v-if="client.card.unverified_settlement != null">
            <!-- <router-link :to="{ path: '/settlementlist', query: { date: client.date ,type:'unmap'} }" > -->
              <span class="bg-red-600 py-1 px-2 rounded-md hover:border border-red-600 hover:bg-red-500 hover:border-red-500"> {{ client.card.unverified_settlement }}</span>
            <!-- </router-link> -->
          </span>

          <span v-else>
            <span class="bg-red-600 py-1 px-2 rounded-md hover:border border-red-600 hover:bg-red-500 hover:border-red-500">0</span>
          </span>
          </small>
        </td> 

        <td data-label="Total Amount Collected" class="text-center">
          <small>
          <span v-if="client.total != null">
            <!-- <router-link :to="`/datewiselist/${client.date}/${type3}`"> -->
              <span class="bg-emerald-600 py-1 px-2 rounded-md hover:border border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500">{{ client.total }}</span>
            <!-- </router-link> -->
          </span>
          <span v-else>
            <span class="bg-emerald-600 py-1 px-2 rounded-md hover:border border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500">0</span>
          </span>
          </small>
        </td> 

        <!-- commeteddd <td data-label="Wrong Amount Update" class="text-center">
          <small>
          {{ client.wrong_update_amount }}
          </small>
        </td> -->

        <!-- <td data-label="Wrong Amount" class="text-center">
          <small>
          <span v-if="client.wrong_update_amount != '0 - None'">
            <router-link :to="`/datewupdatelist/${client.date}`">
              <span class="bg-red-600 p-1 px-2 rounded-md hover:border border-red-200"> {{ client.wrong_update_amount }}</span>
            </router-link>
          </span>

          <span v-else>
            <span class="bg-red-600 p-1 px-2 rounded-md hover:border border-red-200">{{ client.wrong_update_amount }}</span>
          </span>
          </small>
        </td>  -->

        <!-- <td data-label="Wrong Amount Count" class="text-center">
          <small>
          <span v-if="client.wrong_update_count != null">
            <router-link :to="`/datewupdatelist/${client.date}`">
              <span class="bg-red-600 p-1 px-2 rounded-md hover:border border-red-200"> {{ client.wrong_update_count }}</span>
            </router-link>
          </span>

          <span v-else>
            <span class="bg-red-600 p-1 px-2 rounded-md hover:border border-red-200">0</span>
          </span>
          </small>
        </td> -->

        <!-- <td data-label="Refund" class="text-center">
          <small>
          {{ client.refund }}
          </small>
        </td> -->
        

        
      </tr>
    </tbody>
  </table>
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
   
  </div>
</template>
