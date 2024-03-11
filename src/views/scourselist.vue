<script setup>
import { ref,onBeforeMount, computed } from 'vue'
import { useRouter,useRoute } from "vue-router";
import CourseList from '@/components/CourseList.vue'
import CardComponent from '@/components/CardComponent.vue'
import { sessionStore } from "../stores/session";
import { collectorStore } from "../stores/collector"
import { themeStore } from "../stores/theme"
const theme = themeStore();
const collector = collectorStore()
const route = useRoute();
const router = useRouter();
const user = sessionStore();

// const course = computed(() => {
//   return collector.courses;
  
// });

onBeforeMount(async () => {
  await user.checkUser();
  theme.setPageTitle("Student Course List")
  if (!user.loggedIn) {
    router.push("login");
  } 
  // collector.getCourses(route.params)
});


</script>


<template>

  <card-component class="mb-6" has-table>
  
      <course-list />
   
  </card-component>
    
</template>



