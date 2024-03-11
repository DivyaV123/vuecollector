<template>
  <div
    v-if="pageLoading"
    wire:loading
    class="
      fixed
      top-0
      left-0
      right-0
      bottom-0
      w-full
      h-screen
      z-50
      overflow-hidden
      bg-gray-700
      opacity-75
      flex flex-col
      items-center
      justify-center
    "
  >
    <div
      class="
        loader
        ease-linear
        rounded-full
        border-4 border-t-4 border-gray-200
        h-12
        w-12
        mb-4
      "
    ></div>
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p  class="w-1/3 text-center text-white">
      This may take a few seconds, please wait.
    </p>

  </div>
  <overlay @overlay-click="cancel">  
    <card-component class="bg-gray-700 z-50 ">
<div class="flex justify-between border-b-2 border-white pb-2 mb-5">
    <h5 class="text-orange-500 text-xl font-bold  ">Student Registration </h5>
    <small>
      <jb-button
              small
              :icon="mdiClose"
              color="info"
              @click="cancel"
            />
    </small>
</div>
    <div  class="gap-1 mb-0 items-center" v-if="show_register_button===false">
      <field v-if="(form.number&&show_verifyotp_button===true)||(form.number&&show_register_button===true)" label="Contact Number" class="text-orange-500 text-sm">
        <h1 class="mt-2 px-3 py-2 max-w-full focus:ring focus:outline-none dark:placeholder-gray-400 w-full border-0 border-gray-700 dark:bg-gray-800 rounded opacity-50 cursor-not-allowed text-white">{{ selected["code"]+""+form.number}}</h1>
      </field>
        <div class="flex">
        <div v-if="show_verifyotp_button===false && disable_button===false"  class="flex-none pr-2 w-32"> 
            <field label="country code" :error="hasError6" help="Select country code" class="text-orange-500 text-sm pb-6">
                <Multiselect
                  v-model="selected"
                  :searchable="true"
                  valueProp = "code"
                  label="code"
                  :classes="selectClasses"
                  :options="codes"
                  :object="true"
                  class="h-[30px] text-white"
                />
            </field> 
          </div>
          <div v-if="disable_button===false && show_verifyotp_button===false" class="shrink w-1/2 sm:w-[56%] lg:w-max h-max  text-orange-500" >
          <field label="contact number" help="Enter contact number" class="text-orange-500 text-sm pb-6">
            <control
              v-model="form.number"
              :error="hasError5" 
              name="email"
              class="text-white"
              placeholder="Enter your number here"
              :onchange="nanfunc4(form.number)"
            />
          </field>
            </div>
          </div>
            <div :id="[[element]]">
            <jb-buttons v-if="show_sendotp_button===true&&show_verifyotp_button===false && disable_button===false" class="mb-0 pb-10">
            <jb-button
              label="Send OTP"
              color="info"
              @click="send"
              class="mb-0 mt-5 text-sm pt-2 pb-2"
              id="sign-in-button"
            />
            </jb-buttons>
            </div>

      <div v-if="show_verifyotp_button===true">
        <div class="w-full">
            <div  class="rounded text-center">
            <div id="otp" class="flex flex-row text-center flex-wrap mt-3"> 
              <input :onchange="ValidatePassKey('first')" v-model="first" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="first" id="first" name="first" maxlength="1"/>
                <input :onchange="ValidatePassKey('second')" v-model="second" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="second" id="second" name="second" maxlength="1"/> 
                <input :onchange="ValidatePassKey('third')" v-model="third" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="third" id="third" name="third" maxlength="1"/> 
                <input :onchange="ValidatePassKey('four')" v-model="four" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="four" id="four" name="four" maxlength="1"/>
                <input :onchange="ValidatePassKey('five')" v-model="five" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="five" id="five" name="five" maxlength="1"/> 
                <input :onchange="ValidatePassKey('six')" v-model="six" class="m-1 border h-8 w-8 text-center form-control rounded text-black" type="six" id="six" name="six" maxlength="1"/> 
            </div>
            <div class="flex justify-center text-center"> <a class="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer"><i class='bx bx-caret-right ml-1'></i></a> </div>
            </div>
        </div>
       
    </div>
     <div v-if="show_verifyotp_button===true" class="pt-2">
        <jb-button
              label="Verify OTP"
              type="verify"
              color="info"
              @click="verifyotp"
              class="mb-4 text-sm  w-full"
            />
        </div>

        <div v-if="show_verifyotp_button===true" class="pt-2">
        <jb-button
              label="Edit number"
              class="text-sm  w-full"
              type="edit"
              color="info"
              @click="edit"
            />
        </div>

        <div v-if="show_verifyotp_button===true" class="pt-2 justify-items-center">
          <div v-if="isOpen== true" class="">
            <div  :id="[[element]]"> 
              <jb-buttons 
              class="mb-0">
            <jb-button
              label="Resend OTP"
              color="success"
              @click="send"
              class="text-sm w-full"
              id="sign-in-button"
            />
      </jb-buttons>
            </div>
          </div>
          <div v-else>
            <div class="">
              <button class="" >
                <h2 class="text-amber-500 hover:underline text-sm">Resend OTP in {{countDown}} seconds</h2>
              </button>
            </div>
          </div>
      </div>
</div>


     <div  class="grid md:grid-cols-1 lg:grid-cols-4 sm:grid-cols-1 lg:gap-4 lg:mb-0 gap-1" v-if="(form.number&&show_register_button===true)">
       <field label="Contact Number" class="text-orange-500 text-sm mb-0 lg:mb-6 lg:h-[0]">
        <h1 class="px-3 py-2 max-w-full focus:ring focus:outline-none dark:placeholder-gray-400 w-full leading-7 border-0 border-gray-700 dark:bg-gray-900 rounded pr-10 opacity-50 cursor-not-allowed text-white">{{ selected["code"]+""+form.number}}</h1>
      </field>

      <field label="Name" :error="hasError2" help="Name field should not contain any number or special character" class="text-orange-500 text-sm mb-0 lg:mb-6">
        <control
          v-model="form.name"
          :icon-right="mdiAccount"
          name="name"
          class="text-xs text-white"
          placeholder="Enter your name here"
          autocomplete="username"
          :onchange="nanfunc3(form.name)"
        />
      </field>
      
     

    <field  label="Email" :error="hasError4" help="Please enter your email" class="lg:h-20 h-auto text-orange-500 text-sm mb-0 lg:mb-6" >
        <control
          v-model="form.email"
          :icon-right="mdiAccount"
          name="name"
          class="text-xs text-white"
          placeholder="Enter your email here"
          autocomplete="username"
          :onchange="nanfunc(form.email)"
        />
      </field>

      <field  label="Confirm Email(Repeat same Email)" :error="hasError10" help="Please confirm your email" class="lg:h-20 h-auto text-orange-500 text-sm mb-0 lg:mb-6">
        <control
          v-model="form.confirm_email"
          :icon-right="mdiAccount"
          name="name"
          class="text-xs text-white"
          placeholder="confirm your email here"
          autocomplete="username"
          :onchange="nanfunc6(form.confirm_email)"
          id="myInput"
        />
      </field>
</div>
<!-- v-if="(form.number&&show_register_button===true)"  -->
<div v-if="(form.number&&show_register_button===true)"   class="grid md:grid-cols-1 lg:grid-cols-3 sm:grid-cols-1 lg:gap-4 gap-1 lg:mb-0 lg:mt-0">
  <field  label="Country" :error="hasError7" help="Please select your Country" class="lg:h-20 h-auto text-orange-500 text-sm mb-0 lg:mb-6">
        <Multiselect
                valueProp ="name"
                v-model="form.country"
                label="name"
                class="border border-white text-xs text-white"
                :classes="selectClasses" 
                placeholder="Search country here"
                track-by ="name"
                searchable
                :object="true"
                @click="countrychange(form.country)"
                :options="studentcountry"
            />
      </field>
      <field  v-if="form.country" label="State" :error="hasError8" help="Please select your State" class="lg:h-20 h-auto text-orange-500 text-sm mb-0 lg:mb-6">
        <Multiselect
                v-model="form.state_id"
                valueProp ="name"
                label="name"
                class="border border-white text-xs text-white"
                searchable
                placeholder="Search state here"
                track-by ="name"
                :classes="selectClasses" 
                @click="statechange(form.state_id)"
                :object="true"
                :options="studentstate"
            />
      </field>
      <field  v-if="form.state_id" label="District" :error="hasError9" help="Please select your District" class="lg:h-20 h-auto text-orange-500 text-sm mb-0 lg:mb-6">
        <Multiselect
              v-model="form.location"
              valueProp="name"
              label="name"
              class="
                border border-white
                bg-gray-800
                text-sm text-white
                h-9
                rounded
              "
              searchable
              placeholder="Search District"
              track-by="name"
              :classes="selectClasses"
              @click="districtchange(form.location)"
              :object="true"
              :options="studentcity"
            />
      </field>
      <!--<field  v-if="form.location" label="Pincode" :error="hasError11" help="Please select your Pincode" class="lg:h-20 h-auto text-orange-500 text-sm mb-0 lg:mb-6">
        <Multiselect
              v-model="form.pincode"
              valueProp="name"
              label="name"
              class="
                border border-white
                bg-gray-800
                text-sm text-white
                h-9
                rounded
              "
              searchable
              placeholder="Search Pincode"
              track-by="name"
              :classes="selectClasses"
              @click="changing"
              :object="true"
              :options="studentpincode"
            />
      </field>-->
</div>
      



<div  v-if="(form.number&&show_register_button===true)"  class="grid md:grid-cols-1 lg:grid-cols-3 sm:grid-cols-1 gap-1 mb-0 lg:mb-6">
   <field  label="Highest Degree Passout Year" :error="hasError3" help="Please select your Highest Degree Passout Year" class="lg:h-20 h-auto text-orange-500 text-sm mb-0 lg:mb-6">
        <Multiselect
            v-model="form.highestyop"
            valueProp ="name"
            label="name"
            class="border border-white text-xs text-white"
            searchable
            placeholder="Select Highest Degree Passout Year"
            track-by ="name"
            :classes="selectClasses" 
            @click="changing"
            :options="form.years"
          />
      </field>
      <field label="Password"  class="text-orange-500 text-sm mb-0 lg:mb-6" help="Password must contain 8 characters:uppercase,lowercase,number,special character">
        <control
          v-model="form.password"
          :error="hasError1"
          :icon-right="oldPassShowHideClicked? mdiEyeOff:mdiEye"
          type="password"
          name="password"
          class="text-xs text-white"
          placeholder="Please enter Password"
          autocomplete="current-password"
          @right-icon-click="oldToggleEye"
          :onchange="nanfunc1(form.password)"
        />
      </field>

      <field label="Confirm Password" class="lg:h-20 h-auto text-orange-500 text-sm mb-0 lg:mb-6" help="Password must contain 8 characters:uppercase,lowercase,number,special character">
        <control
          v-model="form.confirmed_password"
          :error="hasError"
          :icon-right="newPassShowHideClicked? mdiEyeOff:mdiEye"
          type="password"
          name="password"
          onpaste="return false"
          class="text-xs text-white"
          placeholder="Please enter confirmed Password"
          autocomplete="current-password"
          @right-icon-click="newToggleEye"
          :onchange="nanfunc2(form.confirmed_password)"
        />
      </field>
</div>
      
      <template #footer>
        <level mobile>
          <jb-buttons v-if="show_register_button===true">
            <jb-button
              label="Submit"
              type="register"
              class="font-bold text-sm"
              @click="submit"
              color="info"
            />
          </jb-buttons>
        </level>
      </template>
    </card-component>
    </overlay>


</template>

<script setup>
import { reactive, ref, computed, onBeforeMount, onMounted } from 'vue'
import { mdiAccount, mdiEyeOff, mdiEmail, mdiPhone,mdiEye,mdiClose} from '@mdi/js'
import FormScreenSection from '@/components/FormScreenSection.vue'
import Overlay from '@/components/Overlay.vue'
import CardComponent from '@/components/CardComponent.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import TextLink from '@/components/TextLink.vue'
import { sessionStore } from "../stores/session";
import { useRouter,useRoute } from "vue-router";
import { collectorStore } from "../stores/collector";
import { themeStore } from "../stores/theme";
// import { useStorage } from "vue3-storage";
import Multiselect from '@vueform/multiselect'
import { selectClasses } from '@/selectcss.js'
import { firebaseStore } from "../stores/firebase";
import firebase from 'firebase/app'
const fb = firebaseStore();
const auth = computed(() => firebase.auth);
const router = useRouter();
const user = sessionStore();
const theme = themeStore();
const route = useRoute();
const counts = ref(0);
const countss = ref(0);
const reg_code = ref("");
const collector = collectorStore();
const appVerifier = ref('');
const conResult = ref('');
const form = reactive({
  username: '',
  regcode:"",
  password: '',
  number:'',
  name:'',
  email:'',
  pincode:null,
  confirm_email:'',
  confirmed_password:'',
  highestyop:null,
  workexp:null,
  state_id:null,
  location:null,
  country:null,
  years: [...Array(30)].map((a, b) => (new Date().getFullYear() + 1) - b),
})
const number=ref("")
const datassss1 = ref(null)
const captcha = ref(false)
// const ls = useStorage();
const hasError = ref(false)
const hasError1 = ref(false)
const hasError2 = ref(false)
const hasError3 = ref(false)
const hasError4 = ref(false)
const hasError5 = ref(false)
const hasError6 = ref(false)
const hasError7 = ref(false)
const hasError8 = ref(false)
const hasError9 = ref(false)
const hasError10 = ref(false)
const hasError11 = ref(false)
const isOpen = ref(false);
const interval = ref("");
const countDown = ref(30);
const first = ref("");
const second = ref("");
const third = ref("");
const four = ref("");
const five = ref("");
const six = ref("");
const timeout = ref(null);
const show_sendotp_button = ref(false)
const show_verifyotp_button = ref(false)
const show_register_button = ref(false)
const workexp_error = ref(false)
const selected = ref(null);
const timeOut = ref('')
const disable_button = ref(false)
const codes = [
  {"code":"+91"},
  {"code":"+97"},
  {"code":"+968"},
  {"code":"+1"},
  {"code":"+355"},
  {"code":"+61"},
  {"code":"+93"},
  {"code":"+376"},
  {"code":"+1684"},
  {"code":"+244"},
  {"code":"+1264"},
  {"code":"+1268"},
  {"code":"+54"},
  {"code":"+374"},
  {"code":"+297"},
  {"code":"+43"},
  {"code":"+994"},
  {"code":"+1242"},
  {"code":"+973"},
  {"code":"+880"},
  {"code":"+1246"},
  {"code":"+375"},
  {"code":"+32"},
  {"code":"+501"},
  {"code":"+229"},
  {"code":"+1441"},
  {"code":"+975"},
  {"code":"+591"},
  {"code":"+387"},
  {"code":"+267"},
  {"code":"+55"},
  {"code":"+246"},
  {"code":"+673"},
  {"code":"+1284"},
  {"code":"+226"},
  {"code":"+257"},
  {"code":"+855"},
  {"code":"+237"},
  {"code":"+238"},
  {"code":"+599"},
  {"code":"+1345"},
  {"code":"+236"},
  {"code":"+235"},
  {"code":"+56"},
  {"code":"+86"},
  {"code":"+61"},
  {"code":"+57"},
  {"code":"+269"},
  {"code":"+977"},
  {"code":"+0046"},
  {"code":"+256"},
  {"code":"+64"},
  {"code":"+44"},
  {"code":"+47"},
  {"code":"+49"},
]
onMounted(async () => {
 

  
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

const pageLoading = ref(false);
const oldPassShowHideClicked = ref(true)
const newPassShowHideClicked = ref(true)


const oldToggleEye = () =>{
  return( oldPassShowHideClicked.value = !oldPassShowHideClicked.value);
}
const fetchstate = async (query) => {
  let selectstates = await collector.getstudentState(query);
  return selectstates
};

const fetchcity = async (query) => {
  let courses = await collector.getstudentcity(query);

  return courses;
};

const getstudentcountry = async (query) => {
  let courses = await collector.getstudentcountry(query);

  return courses;
};

const studentcountry = computed(() => {
  return collector.country
})



const countrychange = async(data) => {
  form.state_id=null
  if(data&&data.id){

    await collector.getstudentState(data.id);
  }
}
const statechange = async(data) => {
  form.location=null
  if(data&&data.id){
    await collector.getstudentcity(data.id);
  }
}

const districtchange = async(data) => {
  //form.pincode=null
  if(data&&data.id){
    await collector.getstudentpincode(data.id);
  }
}

const studentstate = computed(() => {
  return collector.statess
})


const studentcity = computed(() => {
  return collector.locations
})

const studentpincode = computed(() => {
  return collector.pincodes
})

function  countDownTimer(count){
     if(count > 0) {
            timeOut.value = setTimeout(() => {
              count -= 1
                countDown.value = count
                countDownTimer(count)
            }, 1000)

        }
    }

const newToggleEye = () =>{
  return( newPassShowHideClicked.value = !newPassShowHideClicked.value);
}

const nanfunc = async () => {
  if(form.email){
    if(form.email.length===1){
      hasError4.value =false
    }
    else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)){
      hasError4.value ="Please add valid Email ID"
    }
    else{
      hasError4.value =false
      const myInput = document.getElementById('myInput');
      myInput.onpaste = e => e.preventDefault();   
    }

  }
};

const nanfunc6 = async () => {
  if(form.confirm_email){
    if(form.confirm_email!=form.email){
      hasError10.value ="Confirm email should match with the original mail"
    }
    else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.confirm_email)){
      hasError10.value ="Please add valid Email ID"
    }
    else{
      hasError10.value =false
    }

  }
};

const nanfunc1 = async () => {
  // if(form.password){
  //   if(form.password.length===1){
  //     hasError1.value =false
  //   }
  //   else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()~])[A-Za-z\d@$!%*?&#^()~]{8,}$/.test(form.password)){
  //     hasError1.value ="Please enter valid password"
  //   }
  //   else{
  //     hasError1.value =false
  //   }
  // }
  if (form.password) {
    if (form.password.length === 1) {
      hasError1.value = false
    }
    else if (!form.password.replace(/\s/g, '').length) {
      hasError1.value = "Please enter valid password"
    }
    else if (form.password.length < 6) {
      hasError1.value = "Please enter valid password"
    }
    else if (form.password.length > 15) {
      hasError1.value = "Please enter valid password"
    }
    else {
      hasError1.value = false
    }

  }
};

const nanfunc2 = async () => {
  // if(form.confirmed_password){
  //   if(form.confirmed_password.length===1){
  //     hasError.value =false
  //   }
  //   else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()~])[A-Za-z\d@$!%*?&#^()~]{8,}$/.test(form.confirmed_password)){
  //     hasError.value ="Please add valid password"
  //   }
  //   else{
  //     hasError.value =false
  //   }
  // }
  if (form.confirmed_password) {
    if (form.confirmed_password.length === 1) {
      hasError.value = false
    }
    else if (!form.confirmed_password.replace(/\s/g, '').length) {
      hasError.value = "Please enter valid password"
    }
    else if (form.confirmed_password.length < 6) {
      hasError.value = "Please enter valid password"
    }
    else if (form.confirmed_password.length > 15) {
      hasError.value = "Please enter valid password"
    }
    else {
      hasError.value = false
      const myInput2 = document.getElementById('myInputt');
      myInput2.onpaste = e => e.preventDefault();
    }

  }
};

const nanfunc4 = async () => {
  if(form.number){
    if(form.number.length===1){
      hasError5.value =false
    }
    else if(form.number.length!=10 || isNaN(form.number) || /\s/g.test(form.number)){
      hasError5.value ="Please add valid contact number"
 
    }
    else{
      show_sendotp_button.value=true
      hasError5.value =false      
        }
  }

};

const delay = async () => {
  clearTimeout(interval.value)
  clearTimeout(timeOut.value)
  // await code.send_otp(selected.value['code']+""+form.number); 
      isOpen.value = false
      countDown.value = 30
      interval.value = setTimeout(() => {
                        isOpen.value = true 

                        }, 30000)                
      countDownTimer(countDown.value)
      show_verifyotp_button.value=true 
      firebase.auth().signInWithPhoneNumber(selected.value['code']+""+form.number, window.recaptchaVerifier)
        .then((confirmationResult) => {

          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          conResult.value = confirmationResult;
          theme.pushMessage("OTP sent successfully to your mobile number");
          // ...
        }).catch((error) => {
          code.error_otp_send = ""
          clearTimeout(interval.value)
          clearTimeout(timeOut.value)
          // router.push("/login")
          window.recaptchaVerifier.clear()
          window.recaptchaVerifier.render().then(function(widgetId) {
            grecaptcha.reset(widgetId);
          });
        })

};


const nanfunc3 = async () => {
  if(form.name){
    if(form.name.length===1){
      hasError2.value =false
    }
    else if(!/^[a-zA-Z\s\.]+$/.test(form.name)){
      hasError2.value ="Add valid name"
    }
    else{
      hasError2.value =false
    }

  }
};

const edit = async () =>{
  clearTimeout(interval.value)
  clearTimeout(timeOut.value)
  show_verifyotp_button.value=false
  show_sendotp_button.value = false
  form.number=""
  // location.reload()
}


function ValidatePassKey(currentid) {
              let currentval = document.getElementById(currentid)
              if (currentval) {
                currentval.onkeyup = function(e) {
                  var target = e.srcElement || e.target;
                  var maxLength = parseInt(target.attributes["maxlength"].value, 10);
                  var myLength = target.value.length;
                  if (myLength >= maxLength) {
                    var next = target;
                    while (next = next.nextElementSibling) {
                      if (next == null)
                        break;
                      if (next.tagName.toLowerCase() === "input") {
                        next.focus();
                        break;
                      }
                    }
                  }
                  else if (myLength === 0) {
                    var previous = target;
                    while (previous = previous.previousElementSibling) {
                      if (previous == null)
                        break;
                      if (previous.tagName.toLowerCase() === "input") {
                        previous.focus();
                        break;
                      }
                    }
                  }
                }
              }
            }

onBeforeMount(async () => {
  fb.initiateFirebase()
  fb.initiateAuth()
  selected.value = codes[0]
  await collector.getstudentcountry()
   if(route.query.regcode)
  {
    reg_code.value = route.query.regcode
  }     
});
const cardClassAddon = computed(() => hasError.value ? 'animate-shake' : '')
  
const pass =(value) =>{ 
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()~])[A-Za-z\d@$!%*?&#^()~]{8,}$/.test(value))
        {
            return  form.password;
        } 
    }

const submit = async () => {
  pageLoading.value = true
  hasError2.value=false
  if(form.name === ""){
    hasError2.value = true
  }
  else if(!form.name.replace(/\s/g, '').length){
    hasError2.value = "Add valid name"
    pageLoading.value = false
    theme.pushMessage("Add valid name")
  }
  else if((/^[\.]+$/.test(form.name))){
    hasError2.value = true
    pageLoading.value = false
    theme.pushMessage("Add valid name")
  }
  else if(!(/^[a-zA-Z\s\.]+$/.test(form.name))){
    pageLoading.value = false
    hasError2.value = "Add valid name"
  }
  else if(form.highestyop===null){
    pageLoading.value = false
    hasError3.value = "Add Highest Yop"
  }
  else if(form.country===null){
    pageLoading.value = false
    hasError7.value = "Add Country"
  }
  else if(form.state_id===null){
    pageLoading.value = false
    hasError8.value = "Add State"
  }
  else if(form.location===null && form.country&&form.country.id===1){
    pageLoading.value = false
    hasError9.value = "Add District"
  }
  //else if(form.pincode===null){
   // pageLoading.value = false
   // hasError11.value = "Add Pincode"
  //}
  else if(form.email==""){
    pageLoading.value = false
    hasError4.value = true
    theme.pushMessage("Email field is required")
  }
  else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)){
    pageLoading.value = false
    hasError4.value = true
    theme.pushMessage("Add valid email")
  }
  else if(form.confirm_email!=form.email){
    pageLoading.value = false
      hasError10.value ="Confirm email should match with the original mail"
      theme.pushMessage("Confirm email should match with the original mail");
    }
  else if(form.password === "" ||!form.password.replace(/\s/g, '').length){
    pageLoading.value = false
    hasError1.value = true
    theme.pushMessage("Add valid password");
  }
  // else if(form.password !=pass(form.password)){
  //   pageLoading.value = false
  //   return hasError1.value = "Password should contain more than  8 characters"
  // }
  else if (form.password.length < 6) {
    pageLoading.value = false
    theme.pushMessage("Password should contain more than  6 characters");
    return hasError1.value = "Password should contain more than  6 characters"

  }
  else if (form.password.length > 15) {
    pageLoading.value = false
    theme.pushMessage("Password should contain less than  15 characters");
    return hasError1.value = "Password should contain less than  15 characters"

  }
  else if(form.password!=form.confirmed_password)
  {
    pageLoading.value = false
    theme.pushMessage("Both Password and Confirm Password should be identical");
  }
  
  else{
    try{
      if(route.query&&route.query.regcode){
        await collector.registration({ name: form.name, email:[{"email":form.email}], contact:[{"code":selected.value['code'],"number":form.number}], password: form.password,personaldetails:{highestyop:form.highestyop,city:form.location,state:form.state_id,country:form.country},regcode:route.query.regcode.replaceAll("-",'')});
         pageLoading.value = false
      }
      else{
        await collector.registration({ name: form.name, email:[{"email":form.email}], contact:[{"code":selected.value['code'],"number":form.number}], password: form.password,personaldetails:{highestyop:form.highestyop,city:form.location,state:form.state_id,country:form.country},regcode:form.regcode.replaceAll("-",'')});
         pageLoading.value = false
      }
        if(collector.reg_value){
          theme.pushMessage("Registration done successfully");
          pageLoading.value = true
          // value.value = false
          router.push(`/scourselist?email=${form.email}`);
          setTimeout(function(){
              location.reload()            
            }, 500);
          pageLoading.value = false
        }
        else{
          theme.pushMessage(collector.error);
          collector.error=""
        }
    }
    catch(err){
      theme.pushMessage("Something went wrong in registration");
    }
  }
  
};

const element = ref("")
const send = async ()  => {
  pageLoading.value = true
  first.value=""
  second.value=""
  third.value=""
  four.value=""
  five.value=""
  six.value=""                                                                                         
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", {
    'size': 'invisible',
    'callback': (response) => {

    }
    
  });
  appVerifier.value = window.recaptchaVerifier

  try{
      if(selected.value===null){
        hasError6.value="country code is required"
        pageLoading.value = false
      }
      else if(form.number===""){
        hasError5.value="This field is required"
        pageLoading.value = false
      }
      else if(form.number.length!=10){
        hasError5.value="Please add valid contact number"
        pageLoading.value = false
      }
      else if(isNaN(form.number)){
        hasError5.value="Please add valid contact number"
        pageLoading.value = false
      }
      else if(!form.number.replace(/\s/g, '').length){
      hasError5.value = "Please add valid contact number"
      pageLoading.value = false
      theme.pushMessage("Please add valid contact number")
      }
      else if((/^[\.]+$/.test(form.number))){
        hasError5.value = true
        pageLoading.value = false
        theme.pushMessage("Please add valid contact number")
      }
      else{
        hasError6.value=false
        clearTimeout(interval.value)
        clearTimeout(timeOut.value)
          await collector.getstudentnumbercheck(form.number)

          if(collector.check_number ==false){
            firebase.auth().signInWithPhoneNumber(selected.value['code']+""+form.number, window.recaptchaVerifier)
            .then((confirmationResult) => {
              isOpen.value = false
              countDown.value = 30
              interval.value = setTimeout(() => {
                                isOpen.value = true   
                                }, 30000)                
              countDownTimer(countDown.value)
              window.confirmationResult = confirmationResult;
              conResult.value = confirmationResult;
              show_verifyotp_button.value=true 
              pageLoading.value = false
              theme.pushMessage("OTP sent successfully to your mobile number");
           
              // ...
            }).catch((error) => {
              clearTimeout(interval.value)
              clearTimeout(timeOut.value)
              window.recaptchaVerifier.render().then(function(widgetId) {
                grecaptcha.reset(widgetId);
              });
              theme.pushMessage("Some technical error occured so please wait for some time or contact help team");
              pageLoading.value = false
              router.push("/login")
            });
          }
          else {
            theme.pushMessage("Number already exists");
            setTimeout(function(){
              location.reload()            
            }, 500);
          }
  }
      }
  
    catch(err){
      theme.pushMessage("something went wrong in send otp");
    }
}

const verifyotp = async ()  => {
  
     
  const data1=first.value+second.value+third.value+four.value+five.value+six.value
  if(first.value==""&&second.value==""&&third.value==""&&four.value==""&&five.value==""&&six.value=="")
    {
      theme.pushMessage("Enter the OTP!!")
    } 
  else
  {
  try{     
      window.confirmationResult.confirm(data1).then((result) => {
        const user = result.user;

        theme.pushMessage("OTP has been verified to the number" + "   "+ form.number + "   "+ "Please do register");
        show_sendotp_button.value=false
        show_register_button.value = true
        show_verifyotp_button.value=false
        disable_button.value=true
        clearTimeout(interval.value)
        clearTimeout(timeOut.value)
      }).catch((error) => {

        theme.pushMessage("You have entered wrong OTP...Please enter valid OTP");
      });
          
    }
    catch(err){
      theme.pushMessage("Something went wrong");
    }
}
    }

const passShowHideClicked = ref(true)

</script>
