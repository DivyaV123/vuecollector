<script setup>
import { computed, ref, watch } from 'vue'
import { mdiCheckDecagram } from '@mdi/js'
import Level from '@/components/Level.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import CardComponent from '@/components/CardComponent.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import Pill from '@/components/Pill.vue'
import { themeStore } from "../stores/theme"
const theme = themeStore();

const userName = computed(() => theme.userName)

const userSwitchVal = ref([])


const props = defineProps({
  name: String,
  image : String,
  number : Array,
  email :Array
})

watch(userSwitchVal, value => {
  store.dispatch('pushMessage', value && value.indexOf('one') > -1 ? 'Success! Now active' : 'Done! Now inactive')
})
</script>

<template>
  <div class="flex p-2 padding-size w-full justify-center blocksize">
    <!-- <div v-if="props.image !== null"> -->

     <div
      class="
        w-1/5
        p-6
        bg-gray-800
        width-full
        margin-bottom
        md:w-2/6
        lg:w-1/5
        sm:w-2/6
      "
    >
      <div class="text-center">
        <user-avatar
          class="w-28 md:w-32 mx-auto mt-2 rounded-full"
          button
          :image="props.image"
        />

        <!-- </div> -->
      </div>
    </div>

    <div
      class="
        w-4/6
        p-6
        bg-gray-800
        ml-4
        pt-2
        margin-left
        width-full
        md:w-full
        lg:w-4/6
        padding-left
        overflow-x
      "
    >
      <table class="border-0 border-collapse w-full">
        <tbody>
          <tr class="border-bottom flex">
            <td
              class="
                font-bold
                text-left text-md
                p-3
                border-0
                text-amber-200
                justify-start
              "
            >
              Student Name
            </td>
            <td
              class="
                text-teal-200 text-md text-left
                p-3
                border-0
                font-bold
                justify-start
              "
            >
              {{ props.name }}
            </td>
          </tr>

          <tr class="border-bottom flex">
            <td
              class="
                font-bold
                text-left text-md
                p-3
                border-0
                text-amber-200
                justify-start
              "
            >
              Email Id
            </td>
            <td
              class="
                text-teal-200 text-md text-left
                p-3
                border-0
                font-bold
                justify-start
              "
            >
              <span
                v-for="(num, array) in props.email"
                :key="array"
                class="mr-8 break-words"
              >
                <a :href="`mailto:${num.email}`" target="_blank">
                  {{ num.email }}
                </a>
              </span>
            </td>
          </tr>

          <tr class=" flex">
            <td
              class="
                font-bold
                text-left text-md
                p-3
                border-0
                text-amber-200
                justify-start
              "
            >
              Contact Number
            </td>
            <td
              class="
                text-teal-200 text-md text-left
                p-3
                border-0
                font-bold
                justify-start
                flex
                flex-wrap
              "
            >
              <span
                v-for="(num, array) in props.number"
                :key="array"
                class="mr-4 break-words"
              >
                <a :href="`tel:${num.contact}`" target="_blank" class="">
                  {{ num.contact }}
                </a>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style>
#student_detail {
  background-color: #3d4451;
}

.border-bottom {
  border-bottom: 1px solid #e9e9e9;
}

.border-bottom:last-child {
  border-bottom: 0;
}

.color-table {
  background-color: #0a1818;
  border-color: #000;
}

@media (max-width: 638px) {
  .blocksize {
    display: block !important;
  }

  .padding-left {
    padding-left: 0 !important;
  }

  .margin-bottom {
    margin-bottom: 24px !important;
  }

  .margin-left {
    margin-left: 0 !important;
  }

  .width-full {
    width: 100% !important;
  }

  .padding-size {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  .padding-left-right {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .overflow-x {
    overflow-x: auto !important;
  }
}

@media (max-width: 767px) {
  .padding-left-right {
    padding-left: 32px !important;
    padding-right: 32px !important;
  }

  .overflow-x {
    overflow-x: auto !important;
  }
}
</style>