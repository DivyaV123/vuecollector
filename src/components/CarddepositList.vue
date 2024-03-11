<script setup>
import { computed, ref ,reactive, onBeforeMount} from 'vue'
import { mdiCheckboxMarkedCircle,mdiMagnify,mdiCloseCircleOutline,mdiCalendarRange } from '@mdi/js'
import { useRouter,useRoute } from "vue-router";
import CheckboxCell from '@/components/CheckboxCell.vue'
import Field from '@/components/Field.vue'
import Level from '@/components/Level.vue'
import ScopyAvatar from '@/components/ScopyAvatar.vue'
import ScopyCard from '@/components/ScopyCard.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Icon from '@/components/Icon.vue'
import Control from '@/components/Control.vue'
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collector_Store } from "../stores/collector2"
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const theme = themeStore();
const user = sessionStore();
const collector2 = collector_Store()

const perPage = 50;
const pageLoading = ref(false)

const redirect = ref('settlementlist')
const redirect1 = ref('summary')

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

const querytype = ref("")

onBeforeMount(async () => {
  // collector2.getSettlementlist(currentPage.value, "created_after="+  search.created_after) ;
  pageLoading.value = true
  if(route.query.date && route.query.type){
    querytype.value = route.query.type
    await collector2.getSettlementlist(currentPage.value-1, "date="+  route.query.date, "type="+ route.query.type );       
  }
  else{
    await collector2.getSettlementlist(currentPage.value-1,fromtodate);       
  }   
  pageLoading.value = false
});

const date_selected1 = ref(dayjs(firstDay).format("YYYY-MM-DD"));
const date_selected2 = ref(dayjs(new Date()).format("YYYY-MM-DD"));

let fromtodate="";
fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-DD") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD") 

let searchdata="";
const searchParams = async() => {
    // let searchdata=""
    searchdata =""
    fromtodate=""
      if( date_selected1.value|| date_selected2.value ){                   
        if (date_selected1.value) {
          searchdata += "&from="+dayjs(date_selected1.value).format("YYYY-MM-DD");
        }
        if(date_selected2.value){
          searchdata += "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD");
        }
      }
      pageLoading.value = true
      currentPage.value = 1
      await collector2.getSettlementlist(currentPage.value-1, searchdata);
      pageLoading.value = false
}

 const clear = async() => {
    pageLoading.value = true
    date_selected1.value = dayjs(firstDay).format("YYYY-MM-DD");
    date_selected2.value = dayjs(new Date()).format("YYYY-MM-DD"); 
    fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-01") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD")   
    currentPage.value = 1
    collector2.getSettlementlist(currentPage.value-1,fromtodate);       
    pageLoading.value = false
}


const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, row => row.id === client.id)
  }
} 


const itemsPaginated = computed(() => collector2.settlementlist)
const itemsCount = computed(() => collector2.settlementcount)

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)

const isModalActive = ref(false)

const currentPage = ref(1)

const checkedRows = ref([])

    const maxPages = ref(10);
    const numPages = computed(() => {
      if(itemsCount.value != 0){
        return Math.ceil(itemsCount.value / perPage)
      }
    });
    const currentPageHuman = computed(() => currentPage.value );
    const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page + 1;
    if (searchdata.length > 0) {
        await collector2.getSettlementlist(page, searchdata);
    } else if(fromtodate!='') {
        await collector2.getSettlementlist(page,fromtodate);
    }
    else{
      await collector2.getSettlementlist(page)
    }
        // await collector2.getSettlementlist(page,fromtodate);
    pageLoading.value = false
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
    };
    const pagesList = computed(() => {
    const pagesList = [];
    let startPage;
    let endPage;
    if (currentPage.value < 1) {
        currentPage.value = 1;
    } else if (currentPage.value > numPages.value) {
        currentPage.value = numPages.value;
    }
    if (numPages.value <= maxPages.value) {
        startPage = 1;
        endPage = numPages.value;
    } else {
        let maxPagesBeforeCurrentPage = Math.floor(maxPages.value / 2);
        let maxPagesAfterCurrentPage = Math.ceil(maxPages.value / 2) - 1;
        if (currentPage.value <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages.value;
        } else if (currentPage.value + maxPagesAfterCurrentPage >= numPages.value) {
        // current page near the end
        startPage = numPages.value - maxPages.value + 1;
        endPage = numPages.value;
        } else {
        // current page somewhere in the middle
        startPage = currentPage.value - maxPagesBeforeCurrentPage;
        endPage = currentPage.value + maxPagesAfterCurrentPage;
        }
    }
    return Array.from(Array(endPage + 1 - startPage).keys()).map(
        (i) => startPage + i
    );
    });
// const numPages = computed(() => Math.ceil(itemsCount.value / perPage));
// const pagesList = computed(() => {
//   const numShown = ref(10)
//   for (let i = 1; i <= numPages.value; i++) {
//     const num = Math.min(numShown.value,numPages.value);
//     let first = currentPage.value - Math.floor(num / 2);
//         first = Math.max(first, 1);
//         first = Math.min(first, numPages.value - num + 1);
//     return [...Array(num)].map((k,i) => i + first)     
//   }
// })
// const pageChange =(page) => {
//   currentPage.value = page;
//   // collector2.getSettlementlist(currentPage.value, "created_after="+  search.created_after);     
//   if(route.query.date && route.query.type){
//     collector2.getSettlementlist(currentPage.value, "date="+  route.query.date, "type="+ route.query.type );       
//   }
//   else{
//     collector2.getSettlementlist(currentPage.value);       
//   } 
// }

</script>



<template>
<div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
    
  <div class="w-full bg-[#151D2B] sticky top-[48px] z-[9] py-2">
      <span class="m-4 text-blue-400 text-xl">Total : {{itemsPaginated.total}}</span>
      <span class="m-4 text-blue-400 text-xl">Page : {{itemsPaginated.page +1 }}</span>
        
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
              <field label="Settlement created from">
                  <control
                      v-model="date_selected1"
                      :icon-left="mdiCalendarRange"
                      placeholder="Search by Date"
                      type="date"          
                  />
              </field>
            </div>
          </div>


          <div class="mb-4">
            <div class="relative">
              <field label="Settlement created to">
                <control
                    v-model="date_selected2"
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

<div v-if="itemsPaginated.total != 0">
  <table class="">
        <thead class="sticky top-[83px] z-[9] bg-gray-900">
      <tr>
        <th class="text-center">ID</th>
        <th class="text-center">Amount</th>
        <th class="text-center">Settlement ID/Batch Number</th>
        <th class="text-center">Settlement Date</th>
        <th class="text-center">Settlement Copy</th>
        <th class="text-center">Comment</th>
        <th class="text-center">Map</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(client, index) in itemsPaginated.items"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        
        <td data-label="Settlement ID" class="text-center">
          <small>
          {{ index+1 }} 
          </small>
        </td>

        <td data-label="Amount" class="text-center">
          <small>
          {{ client.amount }}
          </small>
        </td>

        <td data-label="Settlement ID/Batch Number" class="text-center">
          <small v-if="client.settlementid">
          {{ client.settlementid }}
          </small>
        </td>

        <td data-label="Settlement Date" class="text-center">
          <small v-if="client.manual == true">
          <!-- {{ client.created }} -->
          <span v-if="client.details && client.details.date">
            <!-- {{client.details.date}} -->
          {{ dayjs(client.details.date).format('DD-MMM-YY') }} 
            </span>
          </small>
        </td>
        
        <td data-label="Settlement Copy" class="flex justify-center">
          <small v-if="client.manual== true">
           <span ><div class="mx-auto ml-3">
            <scopy-card :image=client.thumbnail :image1=client.settlement />
          </div></span>
          <!--<span v-else>-</span> --> <!--v-if="client.settlement != null"-->
         <!-- <span v-if="client.settlement != null">{{client.settlement}}
          Copy Received</span> -->
          </small>
        </td>

        <td data-label="Comment" class="text-center">
          <span v-if="client.manual == true">
          <small v-if="client.details && client.details.comment">
          {{ client.details.comment }}
          </small>
          </span>
          <span v-else>
              {{client.transactiondetails.message}}
          </span>
        </td>

        <td data-label="MAP" class="text-center">  
          <small>
          <div v-if="client.mapped == false">
            <div v-if="querytype == 'unmap'">
            <!-- <router-link :to="`/smaplist/${client.branch}/${client.id}/${client.amount}/${redirect1}`"> -->
              <jb-button
                label="MAP"
                color="info"
                :icon="mdiCloseCircleOutline"
                small
              /> 
           <!-- </router-link> -->
          </div>

          <div v-else>
            <!-- <router-link :to="`/smaplist/${client.branch}/${client.id}/${client.amount}/${redirect}`"> -->
              <jb-button
                label="MAP"
                color="info"
                :icon="mdiCloseCircleOutline"
                small
              /> 
           <!-- </router-link> -->
          </div>
          </div>

          <div v-if="client.mapped == true">
            <jb-button
              label="MAPPED"
              color="success"
              :icon="mdiCheckboxMarkedCircle"
              small
            /> 
           
          </div>
          </small>
        </td>
      </tr>
    </tbody>
  </table>


  <!-- <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level mobile>
      <jb-buttons glue>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :active-soft="page === currentPage"
          :label="page"
          addon
          :outline="darkMode"
          small
          no-focus-ring
          @click="pageChange(page)"
        />
      </jb-buttons>
      <small>Page {{ currentPage }} of {{ numPages }}</small>
    </level>
  </div> -->
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800 sticky z-[9] bottom-0 bg-gray-900"
  >
    <level mobile>
      <jb-buttons glue>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :active-soft="page === currentPage"
          :label="page"
          addon
          :outline="darkMode"
          small
          no-focus-ring
          @click="currentPage != page ? pageChange(page - 1) : ''"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
</div>

<div v-else>
    <span class="p-3 flex justify-center text-red-500 font-bold text-xl">Card Amount Settlements not done Today<br/></span>
  </div>

</template>
