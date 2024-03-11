<script setup>
import { computed, ref ,reactive, onBeforeMount} from 'vue'
import { mdiCheckboxMarkedCircle,mdiMagnify,mdiCloseCircleOutline,mdiCalendarRange,mdiAccount } from '@mdi/js'
import { useRouter,useRoute } from "vue-router";
import CheckboxCell from '@/components/CheckboxCell.vue'
import Field from '@/components/Field.vue'
import DepositAvatar from '@/components/DepositAvatar.vue'
import DepositCard from '@/components/DepositCard.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Icon from '@/components/Icon.vue'
import Control from '@/components/Control.vue'
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector"
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const theme = themeStore();
const user = sessionStore();
const collector = collectorStore()

const perPage = 50;

const redirect = ref('depositlist')
const redirect1 = ref('summary')

const pageLoading = ref(false)

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

const querytype = ref("")

const date_selected1 = ref(dayjs(firstDay).format("YYYY-MM-DD"));
const date_selected2 = ref(dayjs(new Date()).format("YYYY-MM-DD"));
const namefilter = ref('');

let fromtodate="";
fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-01") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD") 

let searchdata="";
const searchParams = async() => {
    searchdata=""
      if(namefilter.value || date_selected1.value|| date_selected2.value ){ 
        if (namefilter.value ) {
          searchdata+="&depositedby=" +namefilter.value
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
      await collector.getBdepositlist(0, searchdata);
      fromtodate=""
      pageLoading.value = false
}

 const clear = async() => {
    pageLoading.value = true
    namefilter.value='';
    searchdata = "";
    date_selected1.value = dayjs(firstDay).format("YYYY-MM-DD");
    date_selected2.value = dayjs(new Date()).format("YYYY-MM-DD");    
    fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-01") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD")  
    currentPage.value = 1
    collector.getBdepositlist(currentPage.value-1,fromtodate);       
    pageLoading.value = false
}

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, row => row.id === client.id)
  }
} 

// const merge = async (checkedRows) => {
//   // const checkmarge = []
//   // const mergevalues =[]

//   // for (let i = 0; i < checkedRows.length; i++) {
//   //   checkmarge.push(checkedRows[i].id)
//   //   console.log("checkmerge values",checkmarge.id);

//     // for(let j=0;j<checkedRows[i].merge.length; j++){
//     //   // console.log("mergevalues",checkedRows[i].merge[j]);

//     //   mergevalues.push(checkedRows[i].merge[j])
//     // }

//   // }
  
//   if(checkedRows.length > 1){
//     await collector.add_bdmerge({"merge" : checkedRows})                //, "merge" : mergevalues
//     theme.pushMessage("Bank deposits merged successfully")
//     setTimeout(function(){
//               location.reload()            
//             }, 500);
//   }
//   else{
//     theme.pushErrorMessage("Select the Bank Deposits to Merge")
//   }
// }

const itemsPaginated = computed(() => collector.bdepositlist)
const itemsCount = computed(() => collector.depositcount)

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
        await collector.getBdepositlist(page, searchdata);
    } else if(fromtodate!='') {
        await collector.getBdepositlist(page,fromtodate);
    }
    else{
      await collector.getBdepositlist(page)
    }
        // await collector.getBdepositlist(page,fromtodate);
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

onBeforeMount(async () => {
    pageLoading.value = true
  // collector.getBdepositlist(currentPage.value, "created_after="+  search.created_after);  
  // await user.checkUser();
  // theme.setPageTitle("Bank Deposit List")
  // if (!user.loggedIn) {
  //   router.push("login");
  // } 
  // else 
  if(route.query.date && route.query.type){
    querytype.value = route.query.type
    await collector.getBdepositlist(currentPage.value-1, "date="+  route.query.date, "type="+ route.query.type );       
  }
  else{
    await collector.getBdepositlist(currentPage.value-1,fromtodate);       
  }  
    pageLoading.value = false
});

const checkedTrue = (id) => {
  let found = false
  checkedRows.value.forEach(ele => {
    // console.log("ele.id",ele.id);
    if(ele.id === id){
      found = true
    }
  })
  return found
}


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

  <!-- <div
    v-if="checkedRows.length"
    class="bg-opacity-50 p-3 dark:bg-gray-800"
    :class="lightBgStyle"
  >Merging the amount :
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm dark:bg-gray-700"
      :class="lightBgStyle"
    >
    {{ checkedRow.amount }}
    </span>

  </div> -->

  <!-- <div class="m-8">
      <jb-button
        label="MERGE & MAP"
        color="danger"
        :icon="mdiCheckboxMarkedCircle"
        @click="merge(checkedRows)"
        
        small
      /> 
  </div>  -->
   <!--v-if="checkedRows.length >1"-->

<div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>

<div class="w-full bg-[#151D2B] sticky top-[48px] z-[9] py-2">
      <span class="m-4 text-blue-400 text-xl">Total : {{itemsPaginated.total}}</span>
      <span class="m-4 text-blue-400 text-xl">Page : {{itemsPaginated.page +1}}</span>

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
             <field label="Deposited By">
            <control
                v-model="namefilter"
                :icon-left="mdiAccount"
                placeholder="Search Deposited By"
                   
            />
          </field>
            </div>
          </div>

          <div class="mb-4">
            <div class="relative">
              <field label="Deposit created from">
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
              <field label="Deposit created to">
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
        <!-- <th>Merge</th> -->
        <th>ID</th>
        <th>Amount</th>
        <th>Bank</th>
        <th >Challan</th>
        <th>Deposited By</th>
        <th>Deposit Time</th>
        <th>Deposit ID</th>
        <th>Comment</th>
        <th>Map</th>

      </tr>
    </thead>

    <tbody>
  
      <tr
        v-for="(client, index) in itemsPaginated.items"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        <!-- <td data-label="Merge">
          <small>
          <div v-if="client.mapped == false" >
            <checkbox-cell
              @checked="checked($event, client)"
              :checkTrue="checkedTrue(client.id)"
              /> 
          </div> 
          </small>       
        </td> -->

        <td data-label="ID">
          <small>
          {{ index+1 }}
          </small>
        </td>

        <td data-label="Amount">
          <small>
            {{ client.amount }}
          </small>
        </td>

        <td data-label="Bank">
          <span v-if="client.manual == true">
          <small v-if="client.details && client.details.bank && client.details.bank.displayname">
          {{ client.details.bank.displayname }}
          </small>
          <small v-if="client.details && client.details.bank && !client.details.bank.displayname">
          {{ client.details.bank.name }}
          </small>
          </span>
        </td>
        
        <td data-label="Chalan">
          <span v-if="client.manual == true">
          <small>
            <deposit-card :image=client.thumbnail :image1=client.chalan />
          </small>
          </span>
          <!-- <small>
         <span v-if="client.chalan != null">Chalan Received</span>
          </small> -->
        </td>

        <td data-label="Deposited By">
          <span v-if="client.manual == true">
          <small v-if="client.details && client.details.deposited_by">
          {{ client.details.deposited_by }}
          </small>
          </span>
        </td>

        <td data-label="Deposit Time">
          <span v-if="client.manual == true">
          <small v-if="client.details && client.details.date_time">
          <!-- {{ client.details.date_time }} -->
          {{ dayjs(client.details.date_time).format('DD-MMM-YY h:mm A')}}
          </small>
          </span>
        </td>

        <td data-label="Deposit ID">
          <span v-if="client.manual == true">
          <small>
          {{ client.details.deposit_id }}
          </small>
          </span>
        </td>

         <td data-label="Comment">
          <span v-if="client.manual == true">
          <small v-if="client.details && client.details.comment">
          {{ client.details.comment }}
          </small>
          </span>
          <span v-else>
              {{client.transactiondetails.message}}
          </span>
        </td>
      
        <td data-label="MAP"> 
          <small> 
          <div v-if="client.mapped == false">
            <div v-if="querytype == 'unmap'">
              <jb-button
                label="MAP"
                color="info"
                :icon="mdiCloseCircleOutline"
                small
              /> 
          </div>

          <div v-else>
              <jb-button
                label="MAP"
                color="info"
                :icon="mdiCloseCircleOutline"
                small
              /> 
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


        <!-- <td data-label="MAP"> 
          <small> 
          <td>
          <div v-if="client.mapped == false">
            <div v-if="querytype == 'unmap'">
              <jb-button
                label="MAP"
                color="info"
                :icon="mdiCloseCircleOutline"
                small
              /> 
          </div>

          <div v-else>
              <jb-button
                label="MAP"
                color="info"
                :icon="mdiCloseCircleOutline"
                small
              /> 
          </div>
          </div>

          <div v-if="client.mapped == true">
            <jb-button
              label="MAPPED"
              color="gray"
              :icon="mdiCheckboxMarkedCircle"
              small
            /> 
          </div>
        </td>
          </small>
        </td> -->

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
    <span class="p-3 flex justify-center text-red-500 font-bold text-xl">Bank Deposits not done Today<br/></span>
  </div>
</template>
