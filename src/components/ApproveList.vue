<script setup>
import { computed, ref,reactive, onBeforeMount} from 'vue'
import { mdiCash,mdiMagnify,mdiCalendarRange,mdiAccount,mdiCloseCircleOutline } from '@mdi/js'
import Level from '@/components/Level.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import ApproveUpdateModal from '@/components/ApproveUpdateModal.vue'
import Icon from '@/components/Icon.vue'
import Divider from '@/components/Divider.vue'
import dayjs from 'dayjs';
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collector_Store } from "../stores/collector2"
const collector2 = collector_Store();
const user = sessionStore();
const theme = themeStore();

const perPage = 50;
const approvemodal = ref(false)

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

const search = reactive({
  name:ref(""),
  created_after : ref(dayjs(new Date()).format("YYYY-MM-DD")),
  created_before : ref(dayjs(new Date()).format("YYYY-MM-DD")),  
});

const student_name = ref("");
const date_selected1 = ref(dayjs(new Date()).format("YYYY-MM-DD"));
const date_selected2 = ref(dayjs(new Date()).format("YYYY-MM-DD"));

let params = ref('');

const searchParams = async() => {
  if(student_name.value != "" || date_selected1.value != null || date_selected2.value != null){
    if (student_name.value) {
        search.name = student_name;
    }
    if (date_selected1.value) {
      search.created_after = dayjs(date_selected1.value).format("YYYY-MM-DD");
    } 
    if (date_selected2.value) {
      search.created_before = dayjs(date_selected2.value).format("YYYY-MM-DD");
    } 
    params = new URLSearchParams(search).toString();
    currentPage.value=1
    await collector2.getUpdateList(currentPage.value,search.created_after);
  }
  else{
   await collector2.getUpdateList(currentPage.value);       
  }
}

const clear = async() => {
  params ='';
  student_name.value = '';
  date_selected1.value = dayjs(new Date()).format("YYYY-MM-DD");
  date_selected2.value =dayjs(new Date()).format("YYYY-MM-DD");
  search.name ='';
  search.created_after = ref(dayjs(new Date()).format("YYYY-MM-DD"));
  search.created_before = ref(dayjs(new Date()).format("YYYY-MM-DD"));
  await collector2.getUpdateList();
}

const isModalActive = ref(false)

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)

const currentPage = ref(1)

const approvedata = ref([])

const openapprovemodal = (student) =>{
  // console.log("stud",student);
    approvedata.value = student,
    approvemodal.value = true
}

onBeforeMount(async () => {
  collector2.getUpdateList(currentPage.value-1);       
});
const itemsPaginated = computed(() => collector2.updatelist)
const itemsCount = computed(() => collector2.cancelledcount)

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
//   collector2.getUpdateList(page,params);   
// }

const pageLoading = ref(false)

    const maxPages = ref(10);
    const numPages = computed(() => Math.ceil(itemsCount.value / perPage));
    const currentPageHuman = computed(() => currentPage.value );
    const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page + 1;
    
        await collector2.getUpdateList(page);
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
<approve-update-modal :approvedata="approvedata" v-if="approvemodal == true" v-model="approvemodal" :title="'Approve Wrong Update of '+ approvedata.student.student.name " >
</approve-update-modal>  
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

        <aside
    id="aside-right"
    class="
      w-60
      pr-1.5
      fixed
      z-40
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
                v-model="student_name"
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

<divider/>

<div v-if="itemsCount != 0">
  <table class="">
        <thead class="sticky top-[53px] z-[9] bg-gray-900">
      <tr>
        <th>Name</th>
        <th>Updated Payment Type</th>
        <th>Actual Payment Type</th>
        <th>Wrongly Updated Amount</th>
        <th>Actual Paid Amount</th>
        <!-- <th>Comment</th> -->
        <th>Date</th>
        <th>Status</th>
      </tr>
    </thead>
     <tbody>
      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
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
          </span>

        </td>

        <!--<td data-label="Comment">
           <small>
          {{ client.comment }}
          </small>

        </td>-->

        <td data-label="Date">
           <small>
          {{ client.student.date }}
          </small>
        </td>

         <td data-label="Status">  
           <small>
            <div v-if="client.status == null">
           <jb-button
                label="Approve"
                color="success"
                small
                @click="openapprovemodal(client)"
            /> 
           </div>
               
               <div v-else>
               <jb-button
               class="cursor-not-allowed"
            label="Approved"
          color="info"
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
