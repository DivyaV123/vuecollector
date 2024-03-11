<script setup>
import { computed ,onBeforeMount,ref,reactive,watch} from 'vue'
import { useRouter,useRoute } from "vue-router";
import { mdiLock,mdiLockReset,mdiLockCheck,mdiEyeOff,mdiClose } from '@mdi/js'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import TextLink from '@/components/TextLink.vue'
import Overlay from '@/components/Overlay.vue'
import { themeStore } from "../stores/theme"
import {collectorStore} from "../stores/collector"
const theme = themeStore();
import { sessionStore } from "../stores/session";
const user = sessionStore();
const route = useRoute();
const router = useRouter();
const collector = collectorStore();


const props = defineProps({
    // termsdata: Object,
  title: {
    type: String,
    default: null
  },
  largeTitle: {
    type: String,
    default: null
  },
  shake: Boolean,
  hasCancel: Boolean,
  textLinkLabel: {
    type: String,
    default: null
  },
  textLinkIcon: {
    type: String,
    default: null
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  }
})

const cpwd=ref('')
const form = reactive({
  oldpassword: '',
  password: '',
})

// const pwd = ref("")

// watch(pwd, async (newform, oldform) => {
//   // form.wrong_status_id = newform
//   form.old_password = ""
//   form.new_password = ""
//   form.confirmed_password = ""  
// })

const hasError = ref(false)
const hasError1 = ref(false)
const hasError2 = ref(false)

const cardClassAddon = computed(() => hasError.value || hasError1.value ? 'animate-shake' : '')

onBeforeMount(async () => {
  await user.checkUser();
  if (!user.loggedIn) {
    router.push("login");
  }
});

const passShowHideClicked = ref(true)

const submit = async () => {
  let valid = true
  if(form.oldpassword == '')
  {
    hasError.value = true
    theme.pushErrorMessage("Please fill your Old Password");
    valid = false
  }
  if(form.password == '')
  {
    hasError1.value = true
    theme.pushErrorMessage("Please fill your New Password");
    valid = false
  }
  if(cpwd.value == '')
  {
    hasError2.value = true
    theme.pushErrorMessage("Please Confirm New Password");
    valid = false
  }
  if(form.password != cpwd.value)
  {
    hasError1.value = true
    hasError2.value = true
    theme.pushErrorMessage("New Password & Confirm New Password is not matching");
    valid = false
  }
  if(valid===true){
     try{
          await collector.changepassword({"oldpassword":form.oldpassword,"password":form.password})
          if(collector.$state.changepwd){
            // console.log("collector.$state.changepwd",collector.$state.changepwd.message);
            if(collector.$state.changepwd.message === "Your's password has been changed successfully, please login with new password!"){
                cancel()
                user.logout()
                Object.assign(form, {
                  oldpassword: '',
                  password: '',
                });
                cpwd.value = ''
                router.push("/login")
                theme.pushMessage(collector.$state.changepwd.message);
            }
            //else if(collector.$state.changepwd.message !== "Your's password has been changed successfully, please login with new password!"){
            //      theme.pushErrorMessage(collector.$state.changepwd.message)
            //}
            else{
                theme.pushErrorMessage(collector.$state.error)
            }
          }
      }
    catch(error){
      console.log("vue error",error)
    }
  }
}



const lightBorderStyle = computed(() => theme.lightBorderStyle)

const lightBgStyle = computed(() => theme.lightBgStyle)

const tableTrStyle = computed(() => theme.tableTrStyle)

const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const darkMode = computed(() => theme.darkMode)


const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  Object.assign(form, {
      oldpassword: null,
      password: null,
    });
    cpwd.value = ''
    hasError.value = false
    hasError1.value = false
    hasError2.value = false
  emit(mode)
}

const confirm = () => confirmCancel('confirm')

const cancel = () => confirmCancel('cancel')
</script>

<template>
  <overlay
  v-show="value"
    @overlay-click="cancel"
  >    
    <card-component
      v-show="value"
      :title="title"
      class="shadow-lg w-full max-h-modal md:w-3/5 lg:w-2/5 z-50"
      :class="{ 'animate-shake': shake }"
      :header-icon="mdiClose"
      modal
      @header-icon-click="cancel"
      @submit.prevent="submit"
    >
      <div class="space-y-3">
        <h1
          v-if="largeTitle"
          class="text-2xl"
        >
          {{ largeTitle }}
        </h1>
      </div>

    <small>
        <field label="Old Password" :error="hasError">
          <control
            v-model="form.oldpassword"
            :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
            :icon-right="mdiEyeOff"
            :error="hasError"
            :icon-left="mdiLock"
            name="old password"
            type="password"
            @right-icon-click="passShowHideClicked = true"
            placeholder="Enter your Old Password"
          />
        </field>
      </small>
      
      <small>
        <field label="New Password" :error="hasError1">
          <control
            v-model="form.password"
            :error="hasError1"
            :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
            :icon-right="mdiEyeOff"
            :icon-left="mdiLockReset"
            name="new password"
            type="password"
            @right-icon-click="passShowHideClicked = true"
            placeholder="Enter your New Password"
          />
        </field>
      </small>

      <small>
        <field label="Confirm Password" :error="hasError2">
          <control
            v-model="cpwd"
            :error="hasError2"
            :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
            :icon-right="mdiEyeOff"
            :icon-left="mdiLockCheck"
            name="confirm password"
            type="password"
            onpaste="return false"
            @right-icon-click="passShowHideClicked = true"
            placeholder="Confirm New Password"
          />
        </field>
      </small>
             

        <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              label="Change"
              type="submit"
              color="info"
              @click="submit"
            />
          </jb-buttons>
        </level>
      </template>

  
    </card-component>
  </overlay>
</template>
