<script setup>
import { computed, ref ,reactive, onBeforeMount} from 'vue'
import { mdiCheckboxMarkedCircle,mdiMagnify,mdiCloseCircleOutline,mdiArrowRightThick,mdiNumeric,mdiCalendarRange,mdiCloseBox,mdiAccount,mdiPhone,mdiEmail,mdiCreditCard,mdiIdentifier } from '@mdi/js'
import { useRoute } from "vue-router";
import CheckboxCell from '@/components/CheckboxCell.vue'
import Multiselect from '@vueform/multiselect'
import { selectClasses } from '@/selectcss.js'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Divider from '@/components/Divider.vue'
import Icon from '@/components/Icon.vue'
import UnsettleModal from '@/components/UnsettleModal.vue'
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

// const perPage = 25;
const pageLoading = ref(false)

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};
onBeforeMount(async () => {   
  pageLoading.value = true
  await collector.get_cardstudents(limit,offset)
  await collector.get_assigned_branches()
  pageLoading.value = false
});

const confirmRefresh = async () => {
  pageLoading.value = true;
  if(searchdata.length >0){
      await collector.get_cardstudents(limit,offset,searchdata);
      if( itemsPaginated.value==null){
        offset=(numPages.value-1)*limit    
        await collector.get_cardstudents(limit,offset,searchdata);
      }
  }
  else{
    await collector.get_cardstudents(limit,offset);
      if( itemsPaginated.value==null){
        offset=(numPages.value-1)*limit    
        await collector.get_cardstudents(limit,offset);
      }
  }
    
  pageLoading.value = false;
};

const itemsPaginated = computed(() => collector.cardstudents.items)
const itemsCount = computed(() => collector.cardstudents.count)
const itemsData = computed(() => collector.cardstudents)
const branches = computed(() => collector.assigned_branches)

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)

const buttonSettingsModel = ref([])
const buttonsDisabled = computed(() => buttonSettingsModel.value.indexOf('disabled') > -1)

const isunsettleModalActive = ref(false)
const isModalActive = ref(false)

const isTableActive = ref(false)

const currentPage = ref(1)
const checkedRows = ref([])

const settle_payments = async (client) => {
    await collector.verify_cardpayments({"types" : "settle","student" : client.payment_details.invoiceno,"comment":''})               
    theme.pushMessage(collector.verify_students.message)
    // collector.get_cardstudents()
    confirmRefresh("confim")
}

const propValues = Array([])

const unsettle_payments = (client) => {
      propValues.value = client
      isunsettleModalActive.value = true
    };


const namefilter = ref('');
const contactfilter = ref('');
const authidfilter = ref('');
const cardnofilter = ref('');
const invoicefilter = ref('');
const branchfilter =ref("");

// let params=ref("")
let searchdata=ref("")

const searchParams = async() => {
   searchdata=""
      if(namefilter.value || contactfilter.value|| authidfilter.value || cardnofilter.value || invoicefilter.value || branchfilter.value){ 
        if (namefilter.value ) {
          searchdata+="&name=" +namefilter.value
        ;}                   
        if (contactfilter.value) {
          searchdata += "&contact="+contactfilter.value
        }
        if(authidfilter.value){
          searchdata += "&authid="+authidfilter.value
        }
        if(cardnofilter.value){
          searchdata += "&cardno="+cardnofilter.value
        }
        if(invoicefilter.value){
          searchdata += "&invoice="+invoicefilter.value
        }
        if (branchfilter.value ) {
          searchdata+="&branch=" +branchfilter.value
        ;}
      // params = new URLSearchParams(searchdata).toString();
      // let  copystring=searchdata
      }
      pageLoading.value = true
      currentPage.value = 1
      await collector.get_cardstudents(limit,0,searchdata);
      pageLoading.value = false
}

 const clear = async() => {
    pageLoading.value = true
    searchdata='';
    namefilter.value='';
    contactfilter.value='';
    authidfilter.value='';
    cardnofilter.value='';
    invoicefilter.value='';
    branchfilter.value='';
    offset = 0
    collector.get_cardstudents(limit,offset);      
    pageLoading.value = false
}

const limit = 50;
let offset = 0;
// const currentPage = ref(1)

const maxPages = ref(10);
    const numPages = computed(() => collector.cardstudents.total_page);
    const currentPageHuman = computed(() => currentPage.value );
    const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = (page) + 1;
    offset = page*limit
    if (searchdata.length > 0) {
        await collector.get_cardstudents(limit,offset,searchdata);
    }
    else{
      await collector.get_cardstudents(limit,offset)
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


const remove = (arr, cb) => {
  const newArr = []

  arr.forEach(item => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })
  return newArr
}

</script>



<template>
<div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>
<unsettle-modal :propValues="propValues" v-if="isunsettleModalActive == true" v-model="isunsettleModalActive" title="Confirm Unsettle Payment"  @confirm="confirmRefresh" has-cancel >
</unsettle-modal>
      <!-- <span class="m-4 text-blue-400 text-xl">Total : {{itemsCount}}</span>
      <span class="m-4 text-blue-400 text-xl">Page : {{currentPage}}</span> -->
       
       <div class="w-full bg-[#151D2B] sticky top-[48px] z-[9] py-2">
         <!-- <span class="m-4 text-blue-400 text-xl">Limit : {{limit}}</span>
          <span class="m-4 text-blue-400 text-xl">Offset : {{offset}}</span> -->
          <span class="m-4 text-blue-400 text-xl">Current Page : {{itemsData.current_page}}</span>
          <span class="m-4 text-blue-400 text-xl">Total Amount : {{itemsData.sum}}</span>
          <span class="m-4 text-blue-400 text-xl">Count : {{itemsData.count}}</span>
        <span class="">   
          <jb-button
            @click = "isModalActive =! isModalActive"
            label="Search"
            small
            type="submit"
            class="py-1"
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

          <div class="mb-4">
            <div class="relative">
             <field label="Auth ID">
            <control
                v-model="authidfilter"
                :icon-left="mdiIdentifier"
                placeholder="Search by Auth ID"
                   
            />
          </field>
            </div>
          </div>

          <div class="mb-4">
            <div class="relative">
             <field label="Card Number">
            <control
                v-model="cardnofilter"
                :icon-left="mdiCreditCard"
                placeholder="Search by Card No."
                   
            />
          </field>
            </div>
          </div>

          <div class="mb-4">
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

          <div class="mb-4">
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

<!-- <div v-if="itemsCount!= 0"> -->
<div v-if="itemsPaginated!= null">
  <table class="">
        <thead class="sticky top-[92px] z-[9] bg-gray-900">
      <tr>
        <th>Student ID</th>
        <th>Student Name</th>
        <th>Contact Number</th>
        <th>Email</th>
        <th>Amount Paid</th>
        <th>Auth ID (Approval Code)</th>
        <th>Card Number</th>
        <th>Invoice Number</th>
        <th>Settled/Unsettled</th>
      </tr> 
    </thead>

    <tbody>
      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        <td data-label="Student Name">
            <small>            
              {{client.student_id}} 
            </small>
        </td>
        <td data-label="Student Name">
          <small>            
            {{client.student_name}}
            <span v-if="client.refunded" class="bg-neutral-200 text-black px-1 border rounded-md font-semibold">Refunded</span>
          </small>
        </td>

        <td data-label="Contact Number">
          <span v-for="(contact, i) in client.contact" :key="i">
                <small>
                  <a class="" :href="'tel:' + contact.code + contact.number">
                    <jb-button
                            color="warning"
                            :icon="mdiPhone"
                            small
                        />
                  {{
                    contact.number
                  }}</a>
                  <br/>
                  <!-- &nbsp; -->
                </small>
              </span>
        </td>

        <td data-label="Email">
          <small>  
        <div v-for="mail in client.email" :key="mail">
            <a class="" :href="'mailto:' +  mail.email ">  
                <jb-button
                    color="info"
                    :icon="mdiEmail"
                    small
                />
                  {{mail.email}}
            </a> 
        </div>            
         
          </small>
        </td>

        <td data-label="Amount Paid">
          <small>            
            {{client.amount}} 
          </small>
        </td>

        <td data-label="Auth ID">
          <small>            
            {{client.payment_details.authid}} 
          </small>
        </td>

        <td data-label="Card Number">
          <small>            
            {{client.payment_details.cardno}} 
          </small>
        </td>

        <td data-label="Invoice Number">
          <small>            
            {{client.payment_details.invoiceno}} 
          </small>
        </td>

         <!-- <td data-label="Settled/Unsettled">
          <small> -->
          <!-- <div v-if="client.mapped == false" > -->
            <!-- <checkbox-cell
              @checked="checked($event, client)"
              :checkTrue="checkedTrue(client.id)"
              />  -->
          <!-- </div>  -->
          <!-- </small>       
        </td>  -->

         <td data-label="Settled/Unsettled"> 
          <small> 
              <jb-buttons>
              <jb-button
                label="Settled"
                color="success"
                :icon="mdiCheckboxMarkedCircle"
                small
                @click="settle_payments(client)"
              /> 
            <jb-button
              v-if="client.booleans.cancelled === false"
              label="Unsettled"
              color="danger"
              :icon="mdiCloseCircleOutline"
              small
              @click="unsettle_payments(client)"
            />

            <jb-button
              v-if="client.booleans.cancelled === true && client.booleans.transferee === true"
              label="Payment transferred to another student"
              color="white"
              outline
              small
            /> 
            </jb-buttons>
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
          @click="currentPage != page ? pageChange(page -1) : ''"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>

  </div>

  <div v-else>
    <span class="p-3 flex justify-center text-red-500 font-bold text-xl">Card Payments List is empty<br/></span>
  </div>
</template>
