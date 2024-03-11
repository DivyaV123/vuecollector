<script setup>
import { computed, ref,reactive, onBeforeMount} from 'vue'
import { mdiCash,mdiMagnify,mdiCalendarRange,mdiAccount,mdiCloseCircleOutline,mdiCloseBox } from '@mdi/js'
import Level from '@/components/Level.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Icon from '@/components/Icon.vue'
import Divider from '@/components/Divider.vue'
import RejectModal from '@/components/RejectModal.vue'
import dayjs from 'dayjs';
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collector_Store } from "../stores/collector2"
const collector2 = collector_Store();
const user = sessionStore();
const theme = themeStore();

const perPage = 50;
const pageLoading = ref(false)

const isrejectmodal = ref(false)
const rejectdata = Array({
      "id":null,
      "invoice":'',
      "type":''
      })

const rejectupdate = (id,type,invoice) =>{
  rejectdata.id = id,
  rejectdata.type = type,
  rejectdata.invoice = invoice,

  isrejectmodal.value = true
}

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

const date_selected1 = ref(dayjs(firstDay).format("YYYY-MM-DD"));
const date_selected2 = ref(dayjs(new Date()).format("YYYY-MM-DD"));
const namefilter = ref('');

let fromtodate="";
fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-DD") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD") 

// let params = ref('');
let searchdata="";
const searchParams = async() => {
    searchdata=""
      if(namefilter.value || date_selected1.value|| date_selected2.value ){ 
        if (namefilter.value ) {
          searchdata+="&name=" +namefilter.value
        ;}                   
        if (date_selected1.value) {
          searchdata += "&from="+dayjs(date_selected1.value).format("YYYY-MM-DD");
        }
        if(date_selected2.value){
          searchdata += "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD");
        }
      }
      pageLoading.value = true
      currentPage.value = 1
      await collector2.getUpdateList(0, searchdata);
      fromtodate=""
      pageLoading.value = false
}

 const clear = async() => {
    pageLoading.value = true
    namefilter.value='';
    searchdata = "";
    date_selected1.value = dayjs(firstDay).format("YYYY-MM-DD");
    date_selected2.value = dayjs(new Date()).format("YYYY-MM-DD");   
    fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-DD") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD") 
    currentPage.value = 1
    collector2.getUpdateList(currentPage.value-1,fromtodate);       
    pageLoading.value = false
}

const isModalActive = ref(false)

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)

const currentPage = ref(1)

const confirmRefresh = async () => {
  pageLoading.value = true;
  // await collector2.getUpdateList(currentPage.value-1,searchdata);  
  if (searchdata.length > 0) {
        await collector2.getUpdateList(currentPage.value-1, searchdata);
    } else {
        await collector2.getUpdateList(currentPage.value-1,fromtodate);
    }     
  pageLoading.value = false;
};

onBeforeMount(async () => {
  pageLoading.value = true
  await collector2.getUpdateList(currentPage.value-1,fromtodate);  
  pageLoading.value = false
});
const itemsPaginated = computed(() => collector2.updatelist)
const itemsCount = computed(() => collector2.cancelledcount)


    const maxPages = ref(10);
    const numPages = computed(() => Math.ceil(itemsCount.value / perPage));
    const currentPageHuman = computed(() => currentPage.value );
    const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page + 1;
     if (searchdata.length > 0) {
        await collector2.getUpdateList(page, searchdata);
    } 
    else if(fromtodate!='') {
        await collector2.getUpdateList(page,fromtodate);
    }
    else {
        await collector2.getUpdateList(page);
    }
        // await collector2.getUpdateList(page,fromtodate);
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


</script>

<template>
<reject-modal :rejectdata="rejectdata" v-if="isrejectmodal == true" v-model="isrejectmodal" title="Reject Wrong Update Request" @confirm="confirmRefresh" has-cancel>
</reject-modal>
<div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>

  <div class="w-full bg-[#151D2B] sticky top-[48px] z-[9] py-2">
    <span class="m-4 text-blue-400 text-xl">Total : {{itemsCount}}</span>
    <span class="m-4 text-blue-400 text-xl">Page : {{currentPage}}</span>

  <span class="mr-3">  
          <jb-button
            @click = "isModalActive =! isModalActive"
            label="Search"
            small
            type="submit"
            color="info"
            :icon="mdiMagnify"          
          /> 
        </span>
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
              <field label="Student Name">
            <control
                v-model="namefilter"
                :icon-left="mdiAccount"
                placeholder="Enter the Name"
                   
            />
          </field>
            </div>
          </div>


          <div class="mb-4">
            <div class="relative">
             <field label="Payment Cancelled from">
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
              <field label="Payment Cancelled to">
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



<div v-if="itemsCount != 0">
  <table class="">
        <thead class="sticky top-[83px] z-[9] bg-gray-900">
      <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Updated Payment Type</th>
        <th>Actual Payment Type</th>
        <th>Wrongly Updated Amount</th>
        <th>Actual Paid Amount</th>
        <th>Comment</th>
        <!-- <th>Date</th> -->
        <th>Status</th>
      </tr>
    </thead>
     <tbody>
      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >

      <td data-label="Student ID">
          <small>            
            {{client.student.student.id}}
          </small>
        </td>

        <td data-label="Name">
          <small class="font-bold">
          {{ client.student.student.name }}
          </small>
        </td>

        <td data-label="Updated Payment Type">
          <span v-for="details in client.details" :key="details.id">
          <small v-if="details.status && details.status.name.toLowerCase() === 'payment type is wrong' || details.status.name.toLowerCase() === 'both payment type and updated amount is wrong'" class="text-red-400">
          {{ client.student.type }}
          </small>
          </span>
        </td>

        <td data-label="Actual Payment Type">
          <span v-for="details in client.details" :key="details.id">
           <small v-if="details.payment_type && details.payment_type.actual_type" class="text-green-300">
          {{ details.payment_type.actual_type }}
          </small>
          </span>
        </td>

          <td data-label="Wrongly Updated Amount">
          <span v-for="details in client.details" :key="details.id">
            <small v-if="details.status && details.status.name.toLowerCase() === 'amount is wrong' || details.status.name.toLowerCase() === 'both payment type and updated amount is wrong'" class="text-red-400">
            {{ client.student.amount }}
            </small>
            </span>
          </td>

        <td data-label="Actual Paid Amount">
          <span v-for="details in client.details" :key="details.id">
           <small v-if="details.amount && details.amount.actual_amount" class="text-green-300">
          {{ details.amount.actual_amount }}
          </small>

          <small v-if="details.amount && details.amount.actual_amount == 0" class="text-green-300">
          {{ details.amount.actual_amount }}
          </small>
          </span>

        </td>

        <td data-label="Comment">
          <span v-for="details in client.details" :key="details.id">
           <small v-if="details.comment && details.comment">
          {{ details.comment }} <br/>
          <!-- {{client.id}}--{{client.student.type}}--{{client.student.invoiceno}} -->
          </small>
          </span>
        </td>

        <!-- <td data-label="Date">
           <small>
          {{ client.student.date }}
          </small>
        </td> -->

        <td data-label="Status">  
          <small>
            <div v-if="client.status == null">
              <jb-buttons>
                <jb-button
                    label="Yet to Approve"
                    class="cursor-not-allowed"
                    color="danger"
                    outline
                    small
                /> 

                <jb-button
                    label="Cancel Update Request"
                    color="info"
                    :icon="mdiCloseBox"
                    small
                    @click="rejectupdate(client.id,client.student.type,client.student.invoiceno)"
                /> 
              </jb-buttons>
            </div>
               
            <div v-if="client.status && client.status.type === 'Approved'">
              <jb-button
                  class="cursor-not-allowed"
                  label="Approved"
                  color="success"
                  small
            /> 
            </div>

            <div v-if="client.status && client.status.type === 'Cancelled'">
              <jb-button
                  class="cursor-not-allowed"
                  label="Request Cancelled"
                  color="danger"
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
    <span class="p-3 flex justify-center text-red-500 font-bold text-xl">No Wrong Updates<br/></span>
  </div>
</template>
