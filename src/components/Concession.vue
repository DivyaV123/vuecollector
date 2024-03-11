<script setup>
import { computed, ref ,reactive,onBeforeMount} from 'vue'
import { collectorStore } from "../stores/collector";
import CheckboxCell from '@/components/CheckboxCell.vue'
import { mdiCloseCircleOutline, mdiMagnify, mdiLifebuoy,mdiPlaylistEdit, mdiBookEducation, mdiPlusBox,mdiMicrophone,mdiAccount, mdiEmail, mdiExclamationThick,mdiFilter ,mdiCalendarRange,mdiPhone  } from '@mdi/js'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { themeStore } from "../stores/theme"
import Icon from '@/components/Icon.vue'
import dayjs from 'dayjs';
import Tip from '@/components/Tip.vue';
import { useRoute, useRouter } from 'vue-router'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import {selectClasses} from "../selectcss"
// import BlockModal from "@/components/BlockModal.vue"
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Multiselect from "@vueform/multiselect";


const collector = collectorStore();
const route= useRoute();
const theme = themeStore();
const pageLoading=ref(false)
// Pagination
const perPage=50;
const currentPage = ref(1)
const itemsPaginated = computed(() => collector.conc_list.items)
const itemsCount = computed(() => collector.conc_list.total);
const branches = computed(() => collector.assigned_branches)
const maxPages = ref(10);
// const numPages = computed(() => Math.ceil(itemsCount.value / perPage));
const numPages = computed(() =>{ 
  if(itemsCount.value!=0){
    return Math.ceil(itemsCount.value / perPage)
  }
  });
const currentPageHuman = computed(() => currentPage.value );

    const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page+1;
    if (searchdata.length > 0) {
        await collector.getconcessionlist(page, searchdata);
    } 
    else if(fromtodate!='') {
        await collector.getconcessionlist(page,fromtodate);
    }
    else{
      await collector.getconcessionlist(page)
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
  
  
const block =Array({name:null,id:""})
const isBlockUser =ref(false)
const onBlockUser = (name,id) => {
    block.id=id,
    block.name= name;
    isBlockUser.value = true;
};

const lightBorderStyle = computed(() => theme.lightBorderStyle)
const lightBgStyle = computed(() => theme.lightBgStyle)
const tableTrStyle = computed(() => theme.tableTrStyle)
const tableTrOddStyle = computed(() => theme.tableTrOddStyle)
const darkMode = computed(() => theme.darkMode)
const isModalActive = ref(false)
const isModalDangerActive = ref(false)
const checkedRows = ref([])

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*")
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

const name =ref("")
const number =ref("")
const email=ref("")
const date_selected1 = ref(dayjs(new Date).format("YYYY-MM-01"));
const date_selected2 = ref(dayjs(new Date).format("YYYY-MM-DD"));
const branchfilter = ref('');

let fromtodate="";
fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-01") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD") 

// let params=ref("")
let searchdata="";

const searchParams = async() => {
    searchdata=""
    if(name.value ||number.value|| branchfilter.value || date_selected1.value|| date_selected2.value ){ 
        if (name.value ) {
            searchdata+="&student=" +name.value
        ;}  
        if (number.value ) {
            searchdata+="&contact=" +number.value
        ;} 
        if (branchfilter.value ) {
            searchdata+="&branch=" +branchfilter.value
        ;}    
        if (email.value ) {
            searchdata+="&email=" +email.value
        ;}     
        if (date_selected1.value) {
          searchdata += "&from="+(date_selected1.value);
        }
        if(date_selected2.value){
        searchdata += "&to="+(date_selected2.value);
        }
    }
    pageLoading.value = true
    currentPage.value = 1
    await  collector.getconcessionlist(0,searchdata);
    fromtodate=""
    pageLoading.value = false
}


const clear = async() => {
    pageLoading.value = true
      searchdata = '';
      branchfilter.value = '';
      name.value='';
      number.value="",
      email.value='',
      currentPage.value = 1
      date_selected1.value = dayjs(new Date).format("YYYY-MM-01");
      date_selected2.value = dayjs(new Date).format("YYYY-MM-DD");
      fromtodate= "&from="+dayjs(date_selected1.value).format("YYYY-MM-01") +  "&to="+dayjs(date_selected2.value).format("YYYY-MM-DD")
      await  collector.getconcessionlist(0,fromtodate);
    pageLoading.value = false
}


const paramsDate=ref(route.params.date)
 
onBeforeMount(async () => {
     pageLoading.value = true
    //  await collector.getbranches()
  await collector.get_assigned_branches()
  await collector.getconcessionlist(currentPage.value-1,fromtodate)
  theme.setPageTitle("Concession List")
       pageLoading.value = false
})

const ids_value = ref("")
const rejecthover = ref(false)

const mousehover=(id)=>{
  itemsPaginated.value.forEach((item)=>{
        if(item.id === id){
            rejecthover.value = true
            ids_value.value = id
            return rejecthover
        }
      });
    }

const leavedata=async(id)=>{
  await itemsPaginated.value.forEach((item)=>{
        if(item.id == id){
         return  rejecthover.value=false
        }
      });
}
  
// const action=null;

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}


</script>

<template>
  <div v-if="pageLoading" wire:loading
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
    </div>
     <div class="w-full bg-[#151D2B] sticky top-[48px] z-[9] py-2">    
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
      mt-12
      lg:mt-0
    "
    v-if="isModalActive"
  >
    <div>
      <div class="
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
            <span class="inline-flex justify-center items-center w-6 h-6">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                class="inline-block"
              >
                <path
                  fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                ></path></svg>
              </span
            ></a>
        </header>
        
      
          <field label="Student Name">
            <control
                v-model="name"
                :icon-left="mdiAccount"
                placeholder="Search by Name" 
            />
          </field>

             <div class="mb-4">
            <div class="relative">
             <field label="Email">
            <control
                v-model="email"
                :icon-left="mdiEmail"
                placeholder="Search by Email"
            />
          </field>
            </div>
          </div>

             <div class="mb-4">
            <div class="relative">
             <field label="Contact Number">
            <control
                v-model="number"
                :icon-left="mdiPhone"
                type="number"
                placeholder="Search by Contact"
            />
          </field>
            </div>
          </div>


            <field label="Search branch" class="ml-[5px]">
              <Multiselect
                v-model="branchfilter"
                :reduce="(name) => name"
                valueProp="id"
                label="name"
                class="border border-success "
                searchable
                placeholder="Search Branch "
                track-by="name"
                :classes="selectClasses"
                :options="branches"
              />

          </field>

          <div class="mb-4 ml-[5px]">
            <div class="relative">
              <field label="From Date">
        
            <input type="date" v-model="date_selected1"
            :icon-left="mdiCalendarRange"
                placeholder="Search by Date"
          :max="dayjs(new Date).format('YYYY-MM-DD')" 
          class="bg-gray-800 border border-gray-600 py-1 w-full pl-2 h-9" >
          </field>
            </div>
          </div>
   
          <div class="mb-4 ml-[5px]">
            <div class="relative">
             <field label="To Date">
              <input type="date" v-model="date_selected2" 
              :icon-left="mdiCalendarRange"
                placeholder="Search by Date"
          :max="dayjs(new Date).format('YYYY-MM-DD')" 
          class="bg-gray-800 border border-gray-600 py-1 w-full pl-2 h-9" >         
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
   
  </aside> 

  <div v-if="itemsCount>0">  
  <table class="">
    <thead class="sticky top-[88px] z-[1] bg-gray-900">
      <tr>
    <th><small class="text-gray-500 dark:text-gray-300">ID</small> </th>
    <th><small class="text-gray-500 dark:text-gray-300">Name</small> </th>
     <th> <small class="text-gray-500 dark:text-gray-300">Email</small> </th>
    <th> <small class="text-gray-500 dark:text-gray-300">Contact</small> </th>
    <th><small class="text-gray-500 dark:text-gray-300">Amount</small></th>
    <th><small class="text-gray-500 dark:text-gray-300">Attachment</small></th>
    <!-- <th><small class="text-gray-500 dark:text-gray-300">Type</small></th> -->
     <th><small class="text-gray-500 dark:text-gray-300">Course</small></th>
     <th><small class="text-gray-500 dark:text-gray-300">Branch</small></th>
     <th><small class="text-gray-500 dark:text-gray-300">Raised By</small></th>
   <th><small class="text-gray-500 dark:text-gray-300">Comment</small></th>
     <th><small class="text-gray-500 dark:text-gray-300">Status</small></th>

  </tr>
      
    </thead>
    <tbody>
      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
        
            <td data-label="ID">
              <small class="text-gray-500 dark:text-gray-300">
                  {{client.id}}
              </small>
            </td>
            <td data-label="Name" v-if="client.details">
              <small class="text-emerald-400 dark:text-emerald-400 font-semibold">
             <p v-if="client.details.type=='concession'">D-{{ client.student.name }}</p>
             <p v-if="client.details.type==='balancezero'" class="text-red-500">Z- {{ client.student.name }}</p>

              </small>
            </td>

            <td data-label="Email">
                <small class="text-gray-500 dark:text-gray-300" v-for="(email, i) in client.student.email" :key="i">
                  <a
                class=""
                :href="'mailto:' + email.email"
                > <jb-button
            color="warning"
            :icon="mdiEmail"
            small
          />
                </a>
                  <!-- {{ email.email }} -->
              <br/>
              </small>
            </td>
  
            <td data-label="Contact">
                <small class="text-gray-500 dark:text-gray-300" v-for="(number, i) in client.student.contact" :key="i">
                  <a
              class=""
              :href="'tel:' + number.number"
              >{{ (number.number )}}</a
            > 
                  <!-- {{ maskNumber(number.number) }} -->
          <br/>
              </small>
            </td>

            <td data-label="Amount" v-if="client.details ">
            <small class="text-orange-500 dark:text-orange-300" v-if="client.details.type==='concession'">
            {{ client.details.amount }}
              &nbsp;
            </small>
            <small v-else class="px-2"> -- </small>
            </td>
           
            <td data-label="Attachment" v-if="client.details.type==='concession'">
                <small v-if="client.attachment" class="text-gray-500 dark:text-gray-300">
            <a :href="`https://gotest.qspiders.com/concessions/${client.attachment}`" target="_blank">
              <img v-if="client.thumbnail" :src="`https://gotest.qspiders.com/concessions/${client.thumbnail}`"
              class="w-16 h-16 p-1 transition duration-500 hover:scale-150 transform cursor-pointer" alt="No Image" />
              </a>
              </small>
            </td>
            
            <td data-label="Attachment" v-else><small class="px-8">-</small></td>

            <!-- <td data-label="Type" v-if="client.details ">
            <small class="text-gray-500 dark:text-gray-300">
            {{ client.details.type }}
              &nbsp;
            </small>
            </td> -->

            <td data-label="Course">
            <small class="text-gray-500 dark:text-gray-300"  v-if="client.course">
            {{ client.course.name }}
              &nbsp;
            </small>
            <small class="text-gray-500 dark:text-gray-300 px-8"  v-else>
                --
            </small>
            </td>

            <td data-label="Branch" >
            <small class="text-gray-500 dark:text-gray-300" v-if="client.course && client.course.branch">
            {{ client.course.branch.branchname }}
              &nbsp;
            </small>
            <small class="text-gray-500 dark:text-gray-300 px-8"  v-else>
                --
            </small>
            </td>

             <td data-label="Raised By" >
              <small v-if="client.author && client.author.name" class="text-gray-500 dark:text-gray-300">
                  {{client.author.name}}
              </small>
            </td>

            <td data-label="Comment" v-if="client.details">
            <small class="text-gray-500 dark:text-gray-300">
            {{ client.details.comment }}
              &nbsp;
            </small>
            </td>

       <td data-label="Status" >
            <small class="text-gray-500 dark:text-gray-300" v-if="client.status===null ">
            <jb-button label="Yet to approve"  color="info" class="pt-0 pb-0"/>
            </small>
            <small v-if="client.status && client.status.type==='Success'">
            <jb-button label="Approved" color="success" small/>
            </small>

            <small v-if="client.status&& client.status.type==='Rejected'">
            <jb-button label="Rejected"  color="danger" small    @mouseenter="mousehover(client.id)"  @mouseleave="leavedata(client.id)" />
            <Tip :bottom="true" :tip="`${client.status.comment}`" v-if="rejecthover===true&&ids_value===client.id" class="mt-[-28px]"/>
            </small>
            </td>
         
          <!-- @mouseenter="mousehover(client.id)"  @mouseleave="leavedata(client.id)" v-if="rejecthover==true" -->
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
              :class="currentPage === page ? 'bg-gray-500' : ''"
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

      <div v-else class="text-red-600 text-2xl text-center">
    Record Not Found
  </div>

</template>
