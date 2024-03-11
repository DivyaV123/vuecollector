<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { mdiAccount, mdiEyeOff } from '@mdi/js'
import FormScreenSection from '@/components/FormScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import TextLink from '@/components/TextLink.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import { sessionStore } from "../stores/session";
import { useRouter } from "vue-router";
import { themeStore } from "../stores/theme"
const theme = themeStore();

const router = useRouter();
const user = sessionStore();

const isresendmobile = ref(false);

const resendmobile = async () => {
  isresendmobile.value = true;
};


const form = reactive({
  username: '',
  password: '',
})

const hasError = ref(false)
const hasError1 = ref(false)
const cardClassAddon = computed(() => hasError.value || hasError1.value ? 'animate-shake' : '')


const email =(value) =>{ 
    
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
        {
            return  form.username;
        } 
    }


const submit = async () => {
  if(form.username === "" )
  {
    hasError.value = true
    theme.pushErrorMessage("Valid Username is mandatory");
    
  }
  else if(email(form.username) === undefined)
  {
    hasError.value = true
    theme.pushErrorMessage("Username is Invalid");
  }
  else if(form.password === "")
  {
    hasError1.value = true
    theme.pushErrorMessage("Valid Password is mandatory");

  }
  else{
    await user.login({ email: form.username, password: form.password });
    if (user.loggedIn) {
      router.push("/");
    }
  }
  
}
const passShowHideClicked = ref(true)
onBeforeMount(() => {
  if (user.loggedIn) {
    router.push("/");
  }
});
</script>

<template>
 <forgot-password  v-if="isresendmobile === true"  v-model="isresendmobile"/>
  <form-screen-section v-slot="{ cardClass, cardRounded }" bg="login" promo>
    <card-component
      :class="[cardClass, cardClassAddon]"
      :rounded="cardRounded"
   >
      <field label="Login" :error="hasError" help="Please enter your mail ID">
        <control
          v-model="form.username"
          :error="hasError"
          :icon-right="mdiAccount"
          name="login"
          placeholder="user@example.com"
          autocomplete="username"
        />
      </field>

      <field label="Password" :error="hasError1" help="Click icon to show/hide">
        <control
          v-model="form.password"
          :error="hasError"
          :tip-right="passShowHideClicked ? null : 'Click to show/hide'"
          :icon-right="mdiEyeOff"
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
          @right-icon-click="passShowHideClicked = true"
        />
      </field>
      
    <template #footer>
        <div class="flex justify-between items-center mb-1">
            <div class="form-group form-check">
            </div>
            <jb-button label="Forgot Password?" type="password" color="black" @click="resendmobile"  class="py-0 px-0 pt-0 pb-1 border-0 text-sm underline font-bold " />
          </div>
           <jb-buttons>
            <jb-button  label="Login" type="submit" color="info" @click="submit" class="font-medium text-base "/>
          </jb-buttons>
        
      </template>
<!-- 
      <template #footer>
        <level mobile>
          <jb-buttons>
            <jb-button
              label="Login"
              type="submit"
              color="info"
            />
     
          </jb-buttons>
        </level>
      </template> -->
    </card-component>
  </form-screen-section>
</template>
