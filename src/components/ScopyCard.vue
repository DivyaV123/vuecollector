<script setup>
import { computed, ref, watch } from 'vue'
import { mdiCheckDecagram } from '@mdi/js'
import Level from '@/components/Level.vue'
import ScopyAvatar from '@/components/ScopyAvatar.vue'
import CardComponent from '@/components/CardComponent.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import Pill from '@/components/Pill.vue'
import { themeStore } from "../stores/theme"
const theme = themeStore();

const mCopy = computed(() => theme.mCopy)

const userSwitchVal = ref([])

const props = defineProps({
  image :String,
  image1:String
})


watch(userSwitchVal, value => {
  store.dispatch('pushMessage', value && value.indexOf('one') > -1 ? 'Success! Now active' : 'Done! Now inactive')
})
</script>

<template>

    <div class="flex p-1 padding-size blocksize">
    
        <div >
            <scopy-avatar
                class="w-8 md:w-16 mx-auto "
                button
                :image="props.image"
                :scopy1="props.image1"
            />
        </div>
    </div>

</template>


