<script setup>
import { ref, computed, watch, onMounted, onBeforeMount} from 'vue'
import MainSection from '@/components/MainSection.vue'
import Overlay from '@/components/Overlay.vue'
import Field from '@/components/Field.vue'
import { useRouter } from "vue-router";
import { sessionStore } from "../stores/session";
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import CardComponent from '@/components/CardComponent.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import ItemBox from '@/components/ItemBox.vue'
import { collectorStore } from "../stores/collector";
import { themeStore } from "../stores/theme";
import { mdiAccount, mdiEyeOff,mdiProgressCheck,mdiPlusBox,mdiMinusBox,mdiAccountAlertOutline,mdiBookEducation,mdiAccountCogOutline,mdiExitRun,mdiCheck } from '@mdi/js'
const select = ref(false)
const checkboxOptions = { false: 'Select course' }
const user = sessionStore();
const pageLoading = ref(false)
const theme = themeStore();
const collector = collectorStore();
const router = useRouter();
const props = defineProps({
  course_value: {
    type: Object,
  },
  regcode:{
    type:String,
  },
  student_id : Array
});
onBeforeMount(async() => {
});

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}
const cancel = () => confirmCancel('cancel')

const update_course = computed(() => {
 pageLoading.value = true
 return collector.update_course
 pageLoading.value = false
})

const coursesubmit = async (course) => {
  try{
    await collector.updatecourse({ "course": course,"regcode":props.regcode.replaceAll("-",''),"student":props.student_id.id});
    if(collector.update_course.status===200){
      theme.pushMessage("course updated successfully!");
      value.value = false
      router.push(`/scourselist/?id=${props.student_id.id}`)
      location.reload()
    }
    else if(collector.error){
      theme.pushMessage(collector.error);
      collector.error = ""
    }
    }
    catch(err){
      theme.pushMessage(code.$state.error);
      collector.$state.error=""
    }
}
</script>

<template>
<overlay>
    <div v-if="pageLoading" wire:loading
    class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
    <div class="loader ease-linear rounded-full  h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">This may take a few seconds, please wait.</p>
  </div>  
  <card-component
      class="shadow-lg w-full max-h-none md:w-10/12 z-50 items1"
    >

 <label class="text-white  text-base text-center flex justify-center font-bold">Select your course in the courses shown below</label>


    <div>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      <div class="text-center bg-gray-900 relative pb-4 border border-gray-600 shadow-md shadow-orange-300"  v-for="(client, index) in props.course_value" :key="client.id" :class="{ 'bg-gray-900': index % 2}">


          <item-box
            :value="client.name"
            :title="client.branch.name"
            :title1="client.mode_of_class.name"
            :title2="client.class_timings.name"
            :one_shot="client.amount_one_shot"
            :partial_shot="client.installment_Amount1+client.installment_Amount2"
            trend-type="up"
            divider
          />

        <table class="border-collapse  border-3 border-opacity-50 w-full table-auto mb-10 mt-0">
          <thead class="pt-0">
          <tr class="pt-0">
            <th class="pt-0 text-sm text-bold text-center text-amber-400">Subjects</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(client1) in client.subject" :key="client1.id"
          >
              <small class="text-gray-500 dark:text-gray-300 font-bold text-sm">
                {{ client1.name }}
              </small>
          </tr>
        </tbody>
        </table>
        <footer class="flex justify-center absolute bottom-0 pb-5 left-1/2 right-1/2">
           <jb-buttons>
            <jb-button
              label="Select course"
              class="py-0 pt-1 bg-white text-black"
              type="submit"
             
              @click="coursesubmit(client)"
            />
     
          </jb-buttons>
        </footer>
        </div>
      </div>

    </div>
  </card-component>
</overlay>


</template>

<style >
.item + .item:after {
  content: ";";
}

.items1 {
  overflow-y: auto !important;;
}


</style>

