<script setup>
import { computed, ref } from 'vue'
import {
  mdiForwardburger,mdiTable,mdiFormSelect,mdiBank,mdiAccountCash,mdiCreditCard,mdiCheckboxMarkedCircle,mdiViewList,mdiFileChart,mdiBackburger,mdiClose,mdiDotsVertical,mdiMenu,mdiLockReset,mdiCashMultiple,mdiAccountSearch,mdiAccount,mdiText,mdiCash,mdiCloseThick,mdiAccountPlus,mdiPlusBox,mdiLogout,mdiBell} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import NavBarItemLabel from '@/components/NavBarItemLabel.vue'
import NavBarMenu from '@/components/NavBarMenu.vue'
import Divider from '@/components/Divider.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import Icon from '@/components/Icon.vue'
import LogoutModal from '@/components/LogoutModal.vue'
import ChangePwd from '@/components/ChangePwd.vue'
import JbButton from '@/components/JbButton.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import Tip from '@/components/Tip.vue';
import { themeStore } from "../stores/theme"
import { sessionStore } from "../stores/session";
const theme = themeStore();
const user = sessionStore();
const isAsideRightActive = computed(() => theme.isAsideRightActive)

const isNavBarVisible = computed(() => !theme.isFormScreen)

const isAsideMobileExpanded = computed(() => theme.isAsideMobileExpanded)

const isAsideCompact = computed(() => theme.isAsideCompact)

const isAsideHiddenLayout = computed(() => theme.isAsideHiddenLayout)

const isModalDangerActive = ref(false)
const isChangepwd = ref(false)
const isregisterform = ref(false)

const searchTipOn = ref(false)
const registerTipOn = ref(false)

// const viewprofileTipOn = ref(false)
// const passwordTip = ref(false)
// const mobileTip = ref(false)
// const emailTip = ref(false)
const pageTitle = computed(() => theme.pageTitle)

const userName = computed(() => {
  if(user.user)
  {
    return user.user.username
  }
  })

const menuToggleMobileIcon = computed(() => isAsideMobileExpanded.value ? mdiBackburger : mdiForwardburger)

const menuToggleMobile = () => theme.asideMobileToggle()

const menuToggleIcon = computed(() => {
  if (isAsideHiddenLayout.value) {
    return mdiMenu
  }

  return isAsideCompact.value ? mdiForwardburger : mdiBackburger
})

const menuToggle = () => {
  if(isAsideHiddenLayout.value){
    theme.asideVisibilityToggle()
  }
  else{
    theme.asideCompactToggle()
  }
  
  
}

const asideRightToggle = () => {
  updatesClicked.value = true
  // theme.asideRightToggle()
}

const isMenuNavBarActive = ref(false)

const menuNavBarToggleIcon = computed(() => isMenuNavBarActive.value ? mdiClose : mdiDotsVertical)

const menuNavBarToggle = () => {
  isMenuNavBarActive.value = !isMenuNavBarActive.value
}

const updatesClicked = ref(false)

const updatesUpdateMark = computed(() => !updatesClicked.value && theme.updatesStatus ? 'warning' : null)

const toggleLightDark = () => {
  theme.darkModeTrigger()
}
</script>

<template>
<logout-modal
    v-model="isModalDangerActive"
    large-title="Please confirm"
    button="danger"
    has-cancel
  >
    <p>Are you sure,You want to Logout?</p>
  </logout-modal>

  <change-pwd v-model="isChangepwd" title="Change Password" ></change-pwd>
  <registration-form v-if="isregisterform == true" v-model="isregisterform" title="Student Registration form" ></registration-form>
  <nav
    v-show="isNavBarVisible"
    id="nav"
    class="top-0 left-0 right-0 fixed flex bg-white h-14 border-b border-gray-100 z-30 w-screen transition-position lg:transition-none lg:w-auto lg:items-stretch dark:bg-gray-900 dark:border-gray-800"
  >
    <!-- <div class="flex-1 items-stretch flex h-14">
      <nav-bar-item type="flex lg:hidden" p-x="pl-3 pr-0" @click.prevent="menuToggleMobile">
        <icon :path="menuToggleMobileIcon" size="24" />
      </nav-bar-item>
      <nav-bar-item type="hidden lg:flex" p-x="pl-3 pr-0" @click.prevent="menuToggle">
        <icon :path="menuToggleIcon" size="24" />
      </nav-bar-item>
      <nav-bar-item>
       {{pageTitle}}
      </nav-bar-item>
    </div> -->
    <div class="flex-1 items-stretch flex h-14">
       <nav-bar-item >
         <router-link :to="`/`">
      <!-- <span >QSpiders</span> -->
       <b class="font-black">Collector</b>
      </router-link>
         </nav-bar-item>
      <nav-bar-item type="flex lg:hidden" p-x="pl-0 pr-0" @click.prevent="menuToggleMobile">
        <icon :path="menuToggleMobileIcon" size="24" />
      </nav-bar-item>
      <nav-bar-item type="hidden lg:flex" p-x="pl-0 pr-0">
        <icon :path="mdiText" size="24" />
      </nav-bar-item>
      
      <nav-bar-item>
       {{pageTitle}}
      </nav-bar-item>
    </div>
    <div class="flex-none items-stretch flex h-14 lg:hidden">
      <nav-bar-item :active="isAsideRightActive" @click="asideRightToggle">
        <icon :path="mdiBell" :update-mark="updatesUpdateMark" size="20" />
      </nav-bar-item>
      <nav-bar-item @click.prevent="menuNavBarToggle">
        <icon :path="menuNavBarToggleIcon" size="20" />
      </nav-bar-item>
      
    </div>
    
    <div
      class="absolute w-screen top-14 left-0 bg-white shadow lg:w-auto lg:items-stretch lg:flex lg:grow lg:static lg:border-b-0 lg:overflow-visible lg:shadow-none dark:bg-gray-900"
      :class="{ 'hidden': !isMenuNavBarActive, 'block': isMenuNavBarActive }"
    >
      <div
        class="max-h-screen-menu overflow-y-auto lg:overflow-visible lg:flex lg:items-stretch lg:justify-end lg:ml-auto"
      >

        <nav-bar-menu has-divider :hasDropdown="false">
          <nav-bar-item to="/addenquiry" desktop-icon-only @click="isMenuNavBarActive = !isMenuNavBarActive">
            <small class="text-gray-500 dark:text-gray-300 mr-1">
              <jb-button color="orange" :icon="mdiPlusBox" label="Enquiry" small />
            </small>
          </nav-bar-item>
        </nav-bar-menu>

        <nav-bar-item to="/searchpay" @click="isMenuNavBarActive = !isMenuNavBarActive" @mouseover="searchTipOn = !searchTipOn.value" @mouseleave="searchTipOn = false" has-divider desktop-icon-only>
          <Tip :bottom="true" tip="Search & Pay" v-if="searchTipOn"/>
          <icon :path="mdiAccountSearch" size="18" class="text-green-300 hover:text-green-500" />
        </nav-bar-item>


      <!-- <nav-bar-menu has-divider :hasDropdown="false">
        <nav-bar-item to="/searchpay" @mouseover="searchTipOn = !searchTipOn.value" @mouseleave="searchTipOn = false">
        <Tip :bottom="true" tip="Search & Pay" v-if="searchTipOn"  />
          <nav-bar-item-label
            :icon="mdiAccountSearch"
            label=""
          />
      </nav-bar-item> 
     </nav-bar-menu>  -->

    <!-- <nav-bar-menu has-divider :hasDropdown="false">
      <nav-bar-item @click="isregisterform = true" @mouseover="registerTipOn = !registerTipOn.value" @mouseleave="registerTipOn = false">
        <Tip :bottom="true" tip="Register Student" v-if="registerTipOn"  />
          <nav-bar-item-label
            :icon="mdiAccountPlus"
            label=""
          />
      </nav-bar-item>
    </nav-bar-menu>  -->

    <nav-bar-item @click="isregisterform = true" @mouseover="registerTipOn = !registerTipOn.value" @mouseleave="registerTipOn = false" has-divider desktop-icon-only>
          <Tip :bottom="true" tip="Register Student" v-if="registerTipOn"  />
          <icon :path="mdiAccountPlus" size="18" class="text-red-500 hover:text-red-600" />
        </nav-bar-item>

        <nav-bar-menu has-divider>     
       <nav-bar-item-label :icon="mdiBank" label="Deposit"/>    
          <template #dropdown >
            <nav-bar-item to="/depositform" @click="isMenuNavBarActive = !isMenuNavBarActive" >
              <nav-bar-item-label
                :icon="mdiFormSelect"
                label="Deposit Form"
              />
              </nav-bar-item>
            <divider nav-bar />
               <nav-bar-item to="/depositlist" @click="isMenuNavBarActive = !isMenuNavBarActive">
              <nav-bar-item-label
                :icon="mdiTable"
                label="Deposit List"
              />
              </nav-bar-item>        
          </template>
     </nav-bar-menu>

     <nav-bar-menu has-divider>  
       <nav-bar-item-label :icon="mdiCreditCard" label="Settlement" />   
       <!-- <span>Settlement</span> -->
          <template #dropdown >
            <nav-bar-item to="/devicesettlementform" @click="isMenuNavBarActive = !isMenuNavBarActive">
              <nav-bar-item-label
                :icon="mdiFormSelect"
                label="Settlement Form"
              />
              </nav-bar-item>
            <divider nav-bar />
               <nav-bar-item to="/settlementlist" @click="isMenuNavBarActive = !isMenuNavBarActive">
                <nav-bar-item-label
                  :icon="mdiTable"
                  label="Settlement List"
                />
              </nav-bar-item>
            <divider nav-bar />
               <nav-bar-item to="/card_payments" @click="isMenuNavBarActive = !isMenuNavBarActive">
                <nav-bar-item-label
                  :icon="mdiCreditCard"
                  label="Card Payment List"
                />
              </nav-bar-item>
            <divider nav-bar />
               <nav-bar-item to="/unsettled_payments" @click="isMenuNavBarActive = !isMenuNavBarActive">
                <nav-bar-item-label
                  :icon="mdiCloseThick"
                  label="Unsettle Payment List"
                />
              </nav-bar-item>        
          </template>
     </nav-bar-menu>

     <nav-bar-menu has-divider>     
       <!-- <span>Daywise Payment</span> -->
       <nav-bar-item-label :icon="mdiFileChart" label="Summary" />   
          <template #dropdown >
            <nav-bar-item to="/daywisepayment" @click="isMenuNavBarActive = !isMenuNavBarActive">
              <nav-bar-item-label
                :icon="mdiAccountCash"
                label="Daywise Cash Payment"
              />
              </nav-bar-item>
            <divider nav-bar />
            <nav-bar-item to="/carddaywisepayment" @click="isMenuNavBarActive = !isMenuNavBarActive">
              <nav-bar-item-label
                :icon="mdiCreditCard"
                label="Daywise Card Payment"
              />
              </nav-bar-item>
            <divider nav-bar />
            <nav-bar-item to="/wrongupdate" @click="isMenuNavBarActive = !isMenuNavBarActive">
              <nav-bar-item-label
                :icon="mdiTable"
                label="Wrongly Updated List"
              />
              </nav-bar-item>
            <!-- <divider nav-bar />
               <nav-bar-item to="/approve_update">
              <nav-bar-item-label
                :icon="mdiCheckboxMarkedCircle"
                label="Approve Wrong Updates"
              />
              </nav-bar-item>   -->
            <divider nav-bar />

            <nav-bar-item to="/invoice_list" @click="isMenuNavBarActive = !isMenuNavBarActive">
                <nav-bar-item-label
                  :icon="mdiViewList"
                  label="Invoice List"
                />
              </nav-bar-item>  
            <divider nav-bar />

              <nav-bar-item to="/regcode" @click="isMenuNavBarActive = !isMenuNavBarActive">
                <nav-bar-item-label
                  :icon="mdiViewList"
                  label="Batch Code List"
                />
              </nav-bar-item>  
            <divider nav-bar />

              <nav-bar-item to="/summary" @click="isMenuNavBarActive = !isMenuNavBarActive">
              <nav-bar-item-label
                :icon="mdiFileChart"
                label="Summary"
              />
              </nav-bar-item>    
          </template>
     </nav-bar-menu>

     <!-- <nav-bar-menu has-divider>     
       <nav-bar-item-label :icon="mdiCash" label="Concession"/>    
          <template #dropdown >
            <nav-bar-item to="/concession" @click="isMenuNavBarActive = !isMenuNavBarActive" >
              <nav-bar-item-label
                :icon="mdiFormSelect"
                label="Student Concession"
              />
              </nav-bar-item>
            <divider nav-bar />
               <nav-bar-item to="/concessionlist" @click="isMenuNavBarActive = !isMenuNavBarActive">
              <nav-bar-item-label
                :icon="mdiTable"
                label="Concession List"
              />
              </nav-bar-item>        
          </template>
     </nav-bar-menu> -->

      <nav-bar-menu has-divider >
          <nav-bar-item >
            <small class="text-gray-500 dark:text-gray-300 mr-1">
              <jb-button color="teal" :icon="mdiCash" label="Concession" small />
            </small>
          </nav-bar-item>
          <template #dropdown >
            <nav-bar-item to="/concession" @click="isMenuNavBarActive = !isMenuNavBarActive" >
              <nav-bar-item-label
                :icon="mdiFormSelect"
                label="Student Concession"
              />
              </nav-bar-item>
            <divider nav-bar />
               <nav-bar-item to="/concessionlist" @click="isMenuNavBarActive = !isMenuNavBarActive">
              <nav-bar-item-label
                :icon="mdiTable"
                label="Concession List"
              />
              </nav-bar-item>        
          </template>
        </nav-bar-menu>

        <nav-bar-menu icon="mdiAccount" has-divider>
          <div>
            <span>{{ userName }}</span>  
          </div>

          <template #dropdown>
            <nav-bar-item @click="isChangepwd = true">
              <nav-bar-item-label :icon="mdiLockReset" label="Change Password" />
            </nav-bar-item>
            <divider nav-bar />
            <nav-bar-item @click="isModalDangerActive = true">
              <nav-bar-item-label :icon="mdiLogout" label="Log Out"/>
            </nav-bar-item>
          </template>
        </nav-bar-menu>
      </div>
    </div>
  </nav>
</template>
