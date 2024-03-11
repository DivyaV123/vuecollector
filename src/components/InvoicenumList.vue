<script setup>
import { computed, ref ,reactive, onBeforeMount} from 'vue'
import { mdiCheckboxMarkedCircle,mdiMagnify,mdiCloseCircleOutline,mdiCalendarRange,mdiCloseBox,mdiAccount,mdiPhone,mdiNumeric,mdiAlertCircle } from '@mdi/js'
import { useRoute } from "vue-router";
import Multiselect from '@vueform/multiselect'
import { selectClasses } from '@/selectcss.js'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Divider from '@/components/Divider.vue'
import Icon from '@/components/Icon.vue'
import UpdateModal from '@/components/UpdateModal.vue'
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector"
import { collector_Store } from "../stores/collector2"
import dayjs from 'dayjs';
const route = useRoute();
const user = sessionStore();
const theme = themeStore();
const collector = collectorStore()
const collector2 = collector_Store();

const perPage = 50;
const pageLoading = ref(false)

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const date_selected1 = ref(dayjs(new Date()).format("YYYY-MM-DD"));
const date_selected2 = ref(dayjs(new Date()).format("YYYY-MM-DD"));
const namefilter = ref('');
const contactfilter = ref('');
const invoicefilter =ref("");
const branchfilter =ref("");
const paytypefilter =ref("");

let fromtodate="";
let searchdata="";

fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-DD") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD") 
const searchParams = async() => {
    searchdata=""
    if(namefilter.value || contactfilter.value ||invoicefilter.value || branchfilter.value || paytypefilter.value || date_selected1.value|| date_selected2.value ){ 
        if (namefilter.value ) {
          searchdata+="&name=" +namefilter.value
        ;}  
        if (contactfilter.value ) {
          searchdata+="&contact=" +contactfilter.value
        ;}     
        if (invoicefilter.value ) {
          searchdata+="&invoiceno=" +invoicefilter.value
        ;}
        if (branchfilter.value ) {
          searchdata+="&branch=" +branchfilter.value
        ;}
        if (paytypefilter.value ) {
          searchdata+="&type=" +paytypefilter.value
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
    await collector.get_invoicenumbers(0,searchdata);
    fromtodate=""
    pageLoading.value = false
}

const clear = async() => {
  pageLoading.value = true
  namefilter.value='';
  contactfilter.value='';
  invoicefilter.value='';
  branchfilter.value='';
  paytypefilter.value='';
  date_selected1.value = dayjs(new Date()).format("YYYY-MM-DD");
  date_selected2.value = dayjs(new Date()).format("YYYY-MM-DD");
  fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-DD") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD") 
  currentPage.value = 1
  await collector.get_invoicenumbers( currentPage.value-1,fromtodate);
  pageLoading.value = false
}

onBeforeMount(async () => {
  // collector.get_branches();
  pageLoading.value = true
  await collector.get_assigned_branches()
  // await collector.getPaymentType()
  await collector.get_invoicenumbers(currentPage.value-1,fromtodate)
  pageLoading.value = false
});

const itemsPaginated = computed(() => collector.invoicenumbers.items)
const itemsCount = computed(() => collector.invoicenumbers.total)

const branches = computed(() => collector.assigned_branches)
// const transactiontype = computed(() => collector.paytype)

const transactiontype = [
  {"name":"cash"},
  {"name":"card"},
  {"name":"online"},
  {"name":"bank_transfer"},
  {"name":"upi"},
]

const format = (date) => {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
}

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)

const buttonSettingsModel = ref([])
const buttonsDisabled = computed(() => buttonSettingsModel.value.indexOf('disabled') > -1)

const isModalActive = ref(false)
const isTableActive = ref(false)

const currentPage = ref(1)

    const maxPages = ref(10);
    const numPages = computed(() => Math.ceil(itemsCount.value / perPage));
    const currentPageHuman = computed(() => currentPage.value );
    const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page + 1;   
    if (searchdata.length > 0) {
        await collector.get_invoicenumbers(page, searchdata);
    } 
    else if(fromtodate!='') {
        await collector.get_invoicenumbers(page,fromtodate);
    }
    else{
      await collector.get_invoicenumbers(page)
    }
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
<div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
      <!-- <span v-if="itemsPaginated" class="m-4 text-blue-400 text-xl">Total : {{itemsPaginated.length}}</span> -->
      <!-- <span class="m-4 text-blue-400 text-xl">Page : {{currentPage}}</span> -->
      <div class="w-full bg-[#151D2B] sticky top-[48px] z-[9] py-2">
        
        <span class="m-4 text-blue-400 text-xl">Current Page :{{currentPage}}</span>
        <span v-if="itemsCount>0" class="m-4 text-blue-400 text-xl">Total :{{itemsCount}}</span>


        <span class="">   
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
          <div class="mb-[2px]">
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

           <div class="mb-[2px]">
            <div class="relative">
             <field label="Contact Number">
            <control
                v-model="contactfilter"
                :icon-left="mdiPhone"
                type="number"
                placeholder="Search by Contact"
            />
          </field>
            </div>
          </div>

          <div class="mb-[2px]">
            <div class="relative">
             <field label="Invoice Number">
            <control
                v-model="invoicefilter"
                :icon-left="mdiNumeric"
                placeholder="Search Invoice"
            />
          </field>
            </div>
          </div>

          <!-- <div class="mb-[2px]">
            <div class="relative">
            <field label="Payment Type">
            <Multiselect
                    placeholder = "Search by Payment Type"
                    v-model="paytypefilter"
                    :options="transactiontype"
                    valueProp = "name"
                    label="name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"      
                /> 
          </field>
            </div>
          </div> -->

          <div class="mb-[2px]">
            <div class="relative">
            <field label="Payment Type">
              <Multiselect
                    placeholder = "Search by Payment Type"
                    v-model="paytypefilter"
                    :options="transactiontype"
                    valueProp = "name"
                    label="name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"      
                /> 
          </field>
            </div>
          </div>

          <div class="mb-[2px]">
            <div class="relative">
            <field label="Branch">
            <Multiselect
                    placeholder = "Search by Branch"
                    v-model="branchfilter"
                    :options="branches"
                    valueProp = "id"
                    label="name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"      
                /> 
          </field>
            </div>
          </div>

          <div class="mb-[2px]">
            <div class="relative">
              <field label="Invoice created from">
            <control
                v-model="date_selected1"
                :icon-left="mdiCalendarRange"
                placeholder="Search by Date"
                type="date"          
            />
          </field>
            </div>
          </div>

          <div class="mb-[2px]">
            <div class="relative">
             <field label="Invoice created to">
            <control
                v-model="date_selected2"
                :icon-left="mdiCalendarRange"
                placeholder="Search by Date"
                type="date"    
            />
          </field>
            </div>
          </div>

             <!-- <div class="mb-[2px]">
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
          </div> -->

          

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

<divider class="-mx-0 mt-0 mb-0"/>

<div v-if="itemsPaginated && itemsPaginated.length != 0">
  <table class="">
        <thead class="sticky top-[91px] z-[9] bg-gray-900">
      <tr>
        <th>Student ID</th>
        <th>Student Name</th>
        <th>Invoice</th>
        <th>Contact Number</th>
        <th>Amount</th>
        <th>Payment Type</th>
        <th>Paid Course</th>
        <th>Paid Branch</th>
        <th>Payment Date</th>

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
            <!-- {{index+1}}  -->
            {{client.student.id}}
          </small>
        </td>
      
        <td data-label="Student Name">
          <small>            
            {{client.student.name}} 
          </small>
        </td>

      <td data-label="Receipt Number">
          <small class="text-blue-300 font-semibold">
          {{ client.invoiceno }} <span class="text-red-500 font-bold" v-if="client.payment.cninvoice != null"> [-{{client.payment.cninvoice.amount}}/{{client.payment.cninvoice.cninvoice}}]</span>
          </small>
           <br>
            <span v-if="client.status && client.status.transferee === true && client.status.cancelled === true" class="text-red-400 font-normal text-xs">
                  (Payment transferred to another student)
            </span>
            <span v-if="client.status && client.status.receiver === true" class="text-green-300 font-normal text-xs">
                  (Payment received from another student)
            </span>
      </td>

      <td data-label="Contact Number">
          <span v-for="(contact, i) in client.student.contact" :key="i">
                <small>
                  <a class="" :href="'tel:' + contact.code + contact.number">
                    <!-- <jb-button
                            color="warning"
                            :icon="mdiPhone"
                            small
                        /> -->
                  {{
                    contact.number
                  }}</a>
                  <br>
                </small>
              </span>
      </td>

       <td data-label="Amount">
          <small class="text-lime-200" v-if="client.payment && client.payment.amount">
          {{ client.payment.amount }} 
            <br/>
          </small>
        </td>

        <td data-label="Payment Type">
          <small>
              <span v-if="client.payment && client.payment.type == 'card'" class="text-teal-300 font-semibold">{{ client.payment.type }}</span>
              <span v-if="client.payment && client.payment.type == 'cash'" class="text-orange-300 font-semibold">{{ client.payment.type }}</span>
              <span v-if="client.payment && client.payment.type == 'online'" class=" text-purple-300 font-semibold">{{ client.payment.type }}</span>
              <span v-if="client.payment && client.payment.type == 'bank_transfer'" class="text-sky-300 font-semibold">{{ client.payment.type }}</span>
              <span v-if="client.payment && client.payment.type == 'upi'" class="text-yellow-100 font-semibold">{{ client.payment.type }}</span>
              <span v-if="client.payment && client.payment.type == 'transferred'" class="text-red-400 font-semibold">{{ client.payment.type }}</span>
              <span v-if="client.payment && (client.payment.type !== 'card' && client.payment.type !== 'cash' && client.payment.type !== 'online' && client.payment.type !== 'bank_transfer' && client.payment.type !== 'upi' && client.payment.type !== 'transferred')" class="text-neutral-400 font-semibold">{{ client.payment.type }}</span>
          </small>
        </td> 

        <td data-label="Paid Course">
          <small v-if="client.course && client.course.name">
          {{ client.course.name }}
          </small>
        </td>

        <td data-label="Paid Branch">
          <small v-if="client.branch && client.branch.name">
          {{ client.branch.name }}
          </small>
        </td>

        <td data-label="Payment date">
          <small v-if="client.payment && client.payment.date">
            <!-- {{ client.payment.date}} -->
          {{ dayjs(client.payment.date).format('DD-MMM-YY h:mm A') }} 
          </small>
        </td>
       
      </tr>
    </tbody>
  </table>
  
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
    <span class="p-3 flex justify-center text-red-500 font-bold text-xl">No Payments Done Today, Invoice List is Empty!<br/></span>
  </div>
</template>


<!-- <level mobile>
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
    </level> -->