<script setup>
import { computed, ref ,reactive,onBeforeMount} from 'vue'
import { mdiMagnify,mdiBookMultipleOutline,mdiBookOpenPageVariantOutline,mdiAccountTie,mdiCalendarClock } from '@mdi/js'
import { useRouter,useRoute } from "vue-router";
import Multiselect from '@vueform/multiselect'
import { selectClasses } from '@/selectcss.js'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Icon from '@/components/Icon.vue'
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
import { collector_Store } from "../stores/collector2"
import dayjs from 'dayjs';

const collector = collector_Store()
const route = useRoute();
const user = sessionStore();
const theme = themeStore();

const perPage = 50;
const pageLoading = ref(false)

// const search = reactive({
//   course__id:ref(""),
//   subject__id:ref(""),
//   trainer__id:ref(""),  
// });


// const coursefilter = ref(null);
// const subjectfilter = ref(null);
// const trainerfilter = ref(null);

// let params = ref('');

// const searchParams = async() => {
//     if (coursefilter.value != null) {
//       search.course__id = coursefilter.value.id;
//     }
//     if(subjectfilter.value != null){
//       search.subject__id = subjectfilter;
//     }
//     if(trainerfilter.value != null){
//       search.trainer__id = trainerfilter;
//     }
//     params = new URLSearchParams(search).toString();
//     currentPage.value=1
//     await collector.getRegCode(currentPage.value,params,);
// }

// const clear = async() => {
//   params ='';
//   coursefilter.value = null;
//   subjectfilter.value = null;
//   trainerfilter.value = null;
//   search.course__id = '';
//   search.subject__id = '';
//   search.trainer__id = '';
//   await collector.getRegCode(currentPage.value, params.value);
// }

const batchcodefilter = ref('');
const displaynamefilter = ref('');
const coursefilter =ref("")
const subjectfilter =ref("")
const trainerfilter =ref("")

// let params=ref("")

const searchParams = async() => {
    let searchdata=""
      if(batchcodefilter.value || displaynamefilter.value ||coursefilter.value|| subjectfilter.value|| trainerfilter.value ){ 
        if (batchcodefilter.value ) {
          searchdata+="&regcode=" +batchcodefilter.value
        ;}  
        if (displaynamefilter.value ) {
          searchdata+="&displayname=" +displaynamefilter.value
        ;}     
        if (coursefilter.value ) {
          searchdata+="&course=" +coursefilter.value
        ;} 
        if (subjectfilter.value ) {
          searchdata+="&subject=" +subjectfilter.value
        ;} 
        if (trainerfilter.value ) {
          searchdata+="&trainer=" +trainerfilter.value
        ;}                 
      }
      pageLoading.value = true
      currentPage.value = 1
      await  collector.getRegCode( currentPage.value-1,searchdata);
      pageLoading.value = false
}

const clear = async() => {
  pageLoading.value = true
  batchcodefilter.value='';
  displaynamefilter.value='';
  coursefilter.value='';
  subjectfilter.value = '';
  trainerfilter.value = '';
  await collector.getRegCode( currentPage.value-1);
  pageLoading.value = false
}


const clearsubject = async() => {
  subjectfilter.value = null;
  search.subject__id = ''; 
}

const ct_search = computed(() => {
  return collector.regsearch;
});


onBeforeMount(async () => {
  // collector.getbranchid()
  pageLoading.value = true
  await collector.getRegCode(currentPage.value-1);
  pageLoading.value = false
  // collector.getRegSearch()
});

const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)


const isModalActive = ref(false)

const currentPage = ref(1)

const itemsPaginated = computed(() => collector.reg)
const itemsCount = computed(() => collector.regcount)

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
//   collector.getRegCode(page,params);   
// }

const maxPages = ref(10);
    const numPages = computed(() => Math.ceil(itemsCount.value / perPage));
    const currentPageHuman = computed(() => currentPage.value );
    const pageChange = async (page) => {
    pageLoading.value = true
    currentPage.value = page + 1;
        await collector.getRegCode(page);
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
  
  <div class="w-full bg-[#151D2B] sticky top-[48px] z-[9] pt-2 pb-0">
      <span class="m-4 text-blue-400 text-xl">Total : {{itemsCount}}</span>
      <span class="m-4 text-blue-400 text-xl">Page : {{currentPage}}</span>


        <jb-button
        @click = "isModalActive =! isModalActive"
            label="Search"
            small
            type="submit"
          color="info"
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
             <field label="Batch Code">
            <control
                v-model="batchcodefilter"
                placeholder="Search by Batch Code" 
            />
          </field>
            </div>
          </div>

          <div class="mb-4">
            <div class="relative">
             <field label="Display Name">
            <control
                v-model="displaynamefilter"
                placeholder="Search by Display Name" 
            />
          </field>
            </div>
          </div>

          <div class="mb-4">
            <div class="relative">
             <field label="Course">
            <control
                v-model="coursefilter"
                placeholder="Search Course" 
            />
          </field>
            </div>
          </div>

          <div class="mb-4">
            <div class="relative">
             <field label="Subject">
            <control
                v-model="subjectfilter"
                placeholder="Search Subject" 
            />
          </field>
            </div>
          </div>

          <div class="mb-4">
            <div class="relative">
             <field label="Trainer">
            <control
                v-model="trainerfilter"
                placeholder="Search Trainer" 
            />
          </field>
            </div>
          </div>

          <!-- <div class="mb-4">
            <div class="relative">
              <field label="Course" >
                <Multiselect
                      placeholder = "Search Course"
                      v-model="coursefilter"
                      :options="ct_search.courses"
                      valueProp = "id"
                      label="name"
                      searchable
                      track-by = "name"
                      :classes="selectClasses"  
                      :object = "true"
                      @click="clearsubject"    
                  />
              </field>
            </div>
          </div>

          <div class="mb-4">
            <div class="relative">
              <div v-if="coursefilter">
                <field label="Subject">
                  <Multiselect
                      placeholder = "Search Subject"
                      v-model="subjectfilter"
                      :options="coursefilter.subject"
                      valueProp = "id"
                      label="name"
                      searchable
                      track-by = "name"
                      :classes="selectClasses"      
                  />
                </field>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="relative">
              <field label="Trainers">
                <Multiselect
                    placeholder = "Search Trainers"
                    v-model="trainerfilter"
                    :options="ct_search.trainers"
                    valueProp = "id"
                    label="first_name"
                    searchable
                    track-by = "name"
                    :classes="selectClasses"      
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
  
  <div v-if="itemsCount>0">
  <table class="mt-2">
    <thead class="sticky top-[83px] z-[9] bg-gray-900">
      <tr>
        <th>Batch Code</th>
        <th>Display Name</th>
        <th>Course</th>
        <th>Timing</th>
        <th>Subject</th>
        <th>Trainer</th>
      </tr> 
    </thead>
    <tbody>
    
      <tr
        v-for="(client, index) in itemsPaginated"
        :key="client.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        <!-- <td data-label="regcode">
          <small>
            <jb-button color="" :label="client.regcode.reg_code" outline small />      
          </small>
        </td> -->
        <td data-label="Batch Code">
          <small >
            <!-- {{client.regcode.regcode}} -->
            <jb-button color="" :label="client.regcode.regcode" outline small class="border-0 p-0 cursor-default text-yellow-500"/>     
          </small>
        </td>
        <td data-label="Display Name">
          <small>
            {{client.regcode.displayname}}
          </small>
        </td>

        <td data-label="course">
          <small>
            <jb-button color="teal" :icon="mdiBookMultipleOutline" class="mr-1 cursor-default"
              small />
          {{ client.coursedetails.course.name }}
          </small>
        </td>

        <td data-label="timing">
          <small>
            <jb-button color="warning" :icon="mdiCalendarClock" outline class="mr-1 cursor-default"
              small />
          <!-- {{ client.coursedetails.tentative_start }} -->
          {{dayjs(client.coursedetails.tentative_start).format("DD-MMM-YY h:mm A")}}
          </small>
        </td>
        
        <td data-label="subject">
          <small>
            <jb-button color="info" :icon="mdiBookOpenPageVariantOutline" class="mr-1 cursor-default"
              small />
          {{ client.coursedetails.subject.name }}
          </small>
        </td>

        <td data-label="trainer">
          <small>
            <jb-button color="success" :icon="mdiAccountTie" outline class="mr-1 cursor-default"
              small />
          {{ client.branchdetails.trainer.name}}
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
    <span class="p-3 flex justify-center text-red-500 font-bold text-xl">Batch Codes List is Empty!<br/></span>
  </div>
</template>
