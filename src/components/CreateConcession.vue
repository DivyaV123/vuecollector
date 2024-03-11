<template>
  <card-component
    card-class="w-11/12 md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl"
    card-rounded="rounded-lg"
    :class="[cardClassAddon]"
    form
    @submit.prevent="submit"
    class="pb-0"
  >
    <div
      v-if="pageLoading"
      wire:loading
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
    >
      <div
        class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
      ></div>
      <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="w-1/3 text-center text-white">
        This may take a few seconds, please wait.
      </p>
    </div>
    <div class="flex flex-wrap md:justify-center sm:gap-3 gap-2">
      <field :error="hasError1">
        <control
          v-model="form1.number"
          :error="hasError1"
          :icon-left="mdiCellphone"
          name="number"
          type="number"
          placeholder="Enter contact number"
          @click="hasError1 = false"
        />
      </field>
      <field :error="hasError">
        <control
          v-model="form1.email"
          :error="hasError"
          :icon-left="mdiMail"
          name="email"
          placeholder="Enter Email id here"
          autocomplete="email"
          @click="hasError = false"
        />
      </field>
      <jb-buttons class="mt-0 -mb-0">
        <jb-button
          label="Search"
          type="submit"
          color="info"
          class="mb-0 pt-1 pb-1"
        />
        <jb-button
          label="Clear"
          @click="clear()"
          color="danger"
          class="mb-0 pt-1 pb-1"
        />
      </jb-buttons>
    </div>
  </card-component>

  <div v-if="searchdata === false">
    <h1 class="text-xl text-red-600 text-center pr-[83px]">
      Search student with proper Contact Number or Email Id
    </h1>
  </div>

  <card-component v-if="searchdata === true" class="p-1 pt-0 pb-0">
    <div
      v-if="pageLoading"
      wire:loading
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
    >
      <div
        class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
      ></div>
      <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="w-1/3 text-center text-white">
        This may take a few seconds, please wait.
      </p>
    </div>
    <div v-if="items.result" class="">
      <div
        class="lg:flex-wrap flex gap-1 md:pb-0 items-start lg:gap-3 flex-wrap"
      >
        <div
          class="md:w-[35%] xl:w-[37%] 2xl:w-[33%] w-full mb-3 md:mb-0 mt-9 lg:[35.8%]"
        >
          <!-- <h1 class="text-base text-gray-200 font-semibold mb-3 bg-slate-700 border-b border-white sm:px-2">Student Details</h1> -->
          <div
            class="border-2 border-gray-700 rounded-lg shadow-md ml-0 overflow-x p-3 md:p-1 lg:p-2"
          >
            <card-component class="items-center w-full lg:m-auto" flex-column>
              <div>
                <div class="flex gap-3">
                  <div class="w-[80%] lg:w-[51%] items-center">
                    <figure class="justify-start">
                      <img
                        v-if="items.result.image"
                        :src="`https://gotest.qspiders.com/thumbnails/${items.result.thumbnail}`"
                        class="lg:h-28 h-28 md:h-auto rounded-lg mr-auto lg:w-full xl:w-full w-full"
                      />
                      <img
                        v-else
                        src=""
                        alt="Student has not added the image"
                        class="h-28 rounded-lg mr-auto lg:w-full xl:w-full w-full"
                      />
                    </figure>
                  </div>

                  <div class="ml:0 w-full">
                    <p
                      class="text-white text-base font-normal tracking-wide mb-2 flex gap-1 items-center flex-wrap"
                    >
                      <span>
                        <jb-button :icon="mdiAccount" small color="info">
                        </jb-button>
                      </span>

                      <span class="text-gray-200 text-sm">
                        {{ items.result.name }}<span v-if="items.result.incubation==true" class="border border-gray-600 ml-2 p-1 bg-blue-800">Incubation</span>
                        <span v-if="items.result.campusconnect==true" class="border border-gray-600 ml-2 p-1 bg-red-800">Campus Connect</span>
                      </span>
                    </p>

                    <p
                      class="text-white text-base font-normal tracking-wide mb-2 flex gap-1 items-center flex-wrap"
                    >
                      <span>
                        <jb-button :icon="mdiIdentifier" small color="info">
                        </jb-button>
                      </span>

                      <span class="text-gray-200 text-sm">
                        {{ items.result.id }}</span
                      >
                    </p>
                    <div class="flex flex-row flex-wrap">
                      <jb-button
                        color="info"
                        :icon="mdiMail"
                        small
                        class="mr-1 mb-2"
                      />
                      <div
                        v-for="mail in items.result.email"
                        :key="mail"
                        class="mb-2 flex gap-1 items-center mr-2"
                      >
                        <span class="text-gray-200 text-sm">
                          {{ mail.email }}
                        </span>
                      </div>
                    </div>

                    <div class="flex gap-1 items-center flex-wrap">
                      <jb-button
                        color="info"
                        :icon="mdiPhone"
                        small
                        class="mr-1"
                      />
                      <div
                        v-for="num in items.result.contact"
                        :key="num"
                        class="mr-1"
                      >
                        <a class="" :href="'tel:' + num.number">
                          <span>
                            <span class="text-gray-200 text-sm">
                              <!-- {{ maskNumber(num.number) }} -->
                              {{  (num.number)}}
                              </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <!-- </level> -->
              </div>
            </card-component>
          </div>
        </div>

        <!-- second column -->

        <div
          v-if="isBatchConcession === true"
          class="lg:w-[63%] 2xl:w-[66%] xl:w-[61%] bg-gray-900 w-full -mt-3 md:w-[63.9%]"
        >
          <!-- <h1 class="text-xl text-yellow-400 font-semibold mb-4  leading-[0]">Concession Form</h1> -->
          <card-component
            class="p-0"
            card-class="w-15/12 md:w-5/12 lg:w-5/12 xl:w-5/12 shadow-2xl"
            card-rounded="rounded-lg"
          >
            <div
              v-if="pageLoading"
              wire:loading
              class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
            >
              <div
                class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
              ></div>
              <h2 class="text-center text-white text-xl font-semibold">
                Loading...
              </h2>
              <p class="w-1/3 text-center text-white">
                This may take a few seconds, please wait.
              </p>
            </div>
            <p class="mt-4 mb-1 font-semibold text-yellow-500">
              Course : <span class="text-sky-300">{{ concession.name }}</span>
            </p>
            <div class="border-2 border-gray-700 p-2 pt-1 pb-1 rounded-lg">
              <div>
              <field class="text-white text-sm">
                <div>
                  <label class="cursor-pointer label" for="aadhyes">
                    <span class="label-text font-bold pr-1 text-white text-sm"
                      >Make Balance Zero</span
                    >
                    <input
                      type="radio"
                      id="aadhyes"
                      name="aadhar"
                      :value="true"
                      :native-value="true"
                      v-model="form.target"
                      @click="oneshot()"
                      class="w-5 h-5 align-middle pl-1 radio radio-info radio-sm"
                    />
                  </label>
                  <label class="cursor-pointer label" for="aadhno">
                    <span
                      class="label-text font-bold pl-4 pr-1 text-white text-sm"
                      >Concession</span
                    >
                    <input
                      type="radio"
                      id="aadhno"
                      name="aadhar"
                      :value="false"
                      :native-value="false"
                      v-model="form.target"
                      class="w-5 h-5 align-middle pl-1 radio radio-info radio-sm"
                      @click="oneshot()"
                    />
                  </label>
                </div>
               
               <div>
            <label class="cursor-pointer label" for="passyes">
              <span class="label-text font-bold pr-1 text-white text-sm">Oneshot</span> 
              <input type="radio"
                    id="passyes"
                    name="passport"
                    :value="true"
                    :native-value="true"
                    v-model="form.oneshot" class="radio radio-info radio-md w-5 h-5 align-middle pl-1">
            </label>
            <label class="cursor-pointer label" for="passno">
              <span class="label-text font-bold pl-4 pr-1 text-white text-sm">Partial</span> 
              <input type="radio"
                    id="passno"
                    name="passport"
                    :value="false"
                    :native-value="false"
                    v-model="form.oneshot" class="w-5 h-5 align-middle pl-1 radio radio-info radio-sm">
            </label> 
          </div> 
       </field>
              </div>

                            
              <div
                class="grid md:grid-cols-2 sm:grid-cols-2 gap-x-2 lg:grid-cols-3"
                v-if="form.target === false"
              >
         <field  vertical   help="Select reason" :error="form.reason!==null? false : 'Select concession reason'">
          <Multiselect class="border border-success h-8" v-model="form.reason" :options="conc_reason"
            :reduce="(name) => name" placeholder="Search concession here" name="name" label="name"
            :object="true" valueProp="id" searchable trackBy="name" :classes="selectClasses"
             />
         </field>

                <field
                  :error="
                    form.amount !== null && form.amount >= 0 ? false : 'Amount'
                  "
                  help="Enter the Amount Paid"
                  class="box-border w-50"
                >
                  <control
                    v-model="form.amount"
                    :icon-left="mdiCashMultiple"
                    name="amount"
                    placeholder="Enter amount here"
                    type="number"
                    small
                  />
                </field>

                <field
                  :error="
                    form.amount !== null &&
                    form.amount >= 0 &&
                    form.re_amount !== null &&
                    form.re_amount >= 0
                      ? false
                      : 'Confirm Amount'
                  "
                  help="Confirm Amount"
                  class="box-border w-50"
                >
                  <control
                    v-model="form.re_amount"
                    :icon-left="mdiCashCheck"
                    name="camount"
                    placeholder="Enter confirm amount here"
                    @click="number"
                    onpaste="return false"
                    type="password"
                    autocomplete="new-password"
                  />
                </field>

                <field
                  class="box-border w-50"
                  :error="
                    form.concessionimg !== null
                      ? false
                      : 'Concession attachment/img'
                  "
                  help="Concession attachment/image"
                >
                  <div class="flex h-[34px]">
                    <input
                      class="h-9 border border-gray-700 py-1 placeholder-gray-200 text-gray-200 bg-gray-800 rounded text-sm outline-white focus:outline-white focus:ring w-full pl-6"
                      id="file"
                      ref="file"
                      type="file"
                      name="file"
                      accept="image/*"
                      v-on:change="onFileChange"
                      onchange="document.getElementById('img-show').src = window.URL.createObjectURL(this.files[0]); document.getElementById('img-show').style.height = '36px'; document.getElementById('img-show').style.width = '30%'"
                    />
                    <img id="img-show" v-if="isSaveOpen" class="ml-2" />
                  </div>
                </field>
                <input
                  type="textarea"
                  v-model="form.comment"
                  :icon-left="mdiComment"
                  class="box-border w-50 text-sm bg-gray-800 rounded border-gray-700 border h-[32px] px-2"
                  rows="5"
                  help="Comment"
                  placeholder="Comment"
                />

                <!-- <control
          v-model="form.comment"
          type="textarea"
          :icon-left="mdiComment"
          help="Comment"
          placeholder="Comment"
          row="5"
          class="box-border w-50 text-sm h-[32px]"/> -->
                <!-- <div class="hidden lg:block"></div> -->
                <div class="lg:justify-self-end justify-self-start">
                  <jb-button
                    label="Submit"
                    @click="concessionform()"
                    type="submit"
                    color="info"
                    small
                    class="mt-2 px-3"
                  />
                </div>
              </div>

              <div
                v-if="form.target === true"
                class="mt-2 flex justify-between items-end"
              >
                <div
                  class="grid md:grid-cols-2 sm:grid-cols-2 gap-2 lg:grid-cols-2"
                  :error="form1.comment != '' ? false : 'Confirm Amount'"
                >
                  <control
                    v-model="form1.comment"
                    type="textarea"
                    :icon-left="mdiComment"
                    :error="form1.comment != '' ? false : 'Confirm Amount'"
                    help="Comment"
                    placeholder="Comment"
                    class="box-border w-80 text-sm mt-3 "
                  />

                  <span class="mx-[20px] text-sm"
                    ><p class="underline text-red-500">Note :</p>
                    This feature is applicable only for the student who has
                    negative balance.</span
                  >
                </div>
                <div>
                  <jb-button
                    label="Submit"
                    @click="concessionform()"
                    type="submit"
                    color="info"
                    small
                    class="mt-2 px-3"
                  />
                </div>
              </div>

              <!-- <div v-if="form.target!=null">
          <jb-button label="Submit" @click="concessionform()" type="submit" color="info"  small class="mt-2 px-3"/>
    </div>
    -->
            </div>
          </card-component>
        </div>
      </div>
    </div>

    <div v-else class="p-3 text-red-400 text-2xl">
      <span class="p-3 flex justify-center">{{ collector.error_data }}</span>
    </div>
  </card-component>

  <card-component v-if="searchdata === true" class="pt-0">
    <div
      v-if="pageLoading"
      wire:loading
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
    >
      <div
        class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
      ></div>
      <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="w-1/3 text-center text-white">
        This may take a few seconds, please wait.
      </p>
    </div>
    <div
      v-if="items.result && items.result.student_course !== null"
      class="pt-0"
    >
      <h1
        class="text-base text-sky-300 font-semibold mb-1 bg-black border-b border-white sm:px-2 mt-0 py-1 text-center"
      >
        Student Course Details
      </h1>

      <table class="mt-2">
        <thead class="sticky top-[53px] z-[9] bg-gray-900">
          <tr>
            <th>Course</th>
            <th>Branch</th>
            <th>OneShot Amount</th>
            <th>Installment Amount</th>
            <th>Paid</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(client, index) in items.result.student_course"
            :key="client.id"
            :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
          >
            <td data-label="Courses">
              <span v-if="client.booleans.incubation==true" class="text-blue-500">INC</span>
              &nbsp;
              <small>
                {{ client.name }}
              </small>
            </td>

            <td data-label="Branch">
              <small v-if="client.branch && client.branch.branchname">
                {{ client.branch.branchname }}
              </small>
            </td>

            <td data-label="OnShot Amount">
              <small>
                <span class="text-white font-semibold text-sm">Target</span> :
                <span class="text-orange-500">{{ client.oneshot }}</span
                ><br />
                <span class="text-white font-semibold text-sm">Balance</span> :
                <span class="text-orange-500">
                  {{ client.oneshot_balance }}</span
                >
              </small>
              <!-- v-if="client.disable_one_shot_pay === false"<small v-else>
                <jb-button
                  color="danger"
                  label="Disabled"
                  :icon="mdiCancel"
                  small
              /></small> -->
            </td>

            <td data-label="Installment Amount">
              <small>
                <span class="text-white font-semibold text-sm">Target</span> :
                <span class="text-orange-500">{{ client.partial }}</span
                ><br />
                <span class="text-white font-semibold text-sm">Balance</span> :
                <span class="text-orange-500">
                  {{ client.partial_balance }}</span
                >
              </small>
            </td>

            <td data-label="Paid">
              <small>
                {{ client.paid }}
              </small>
            </td>

            <td
              data-label="Actions"
              v-if="
                (client.oneshot_balance == 0 &&
                  client.booleans.disable_one_shot_pay === false) ||
                (client.booleans.disable_one_shot_pay === true &&
                  client.partial_balance == 0)
              "
            >
            <jb-button
                color="danger"
                label="Not Applicable"
                :icon="mdiCash"
                small
                class="cursor-not-allowed"
              />
              
            </td>
            <td data-label="Actions" v-else>
              <jb-button
                color="success"
                label="Give Concession"
                :icon="mdiCash"
                small
                @click="onconcession(items.result.id, client.id, client.course,client.name)"
              />
            </td>
            <!-- @click="onpay(client.id, client.name,client.paid, client.branch,client.oneshot, client.oneshot_balance, client.partial, client.partial_balance)" -->
          </tr>
        </tbody>
      </table>
    </div>
  </card-component>

  <card-component v-if="searchdata === true">
    <div
      v-if="pageLoading"
      wire:loading
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
    >
      <div
        class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
      ></div>
      <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="w-1/3 text-center text-white">
        This may take a few seconds, please wait.
      </p>
    </div>
    <div v-if="items.result && items.result.student_batches" class="p-1">
      <h1
        class="text-center text-teal-300 py-1 font-semibold bg-black border-b border-white"
      >
        Student Batch Details
      </h1>
      <table class="mt-2">
        <thead class="sticky top-[53px] z-[9] bg-gray-900">
          <tr>
            <th>BatchCode</th>
            <th>Branch</th>
            <th>course</th>
            <th>Subject</th>
            <th>Trainer</th>
            <th>Mode of class</th>
            <!-- <th>Attendance Type</th> -->
            <th>Tentative Start</th>
          </tr>
        </thead>
        <tbody  v-if="items.result.student_batches.length <= 3">
          <tr
            v-for="(client, index) in items.result.student_batches"
            :key="client.id"
            :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
          >
            <!-- {{client}} -->

            <td data-label="BatchCode">
              <small>
                {{ client.batchplan.name }}
              </small>
            </td>

            <td data-label="Branch">
              <small>
                {{ client.branch.name }}
              </small>
            </td>

            <td data-label="Course">
              <small>
                {{ client.batchplan.course.name }}
              </small>
            </td>

            <td data-label="Subject">
              <small>
                {{ client.subject.name }}
              </small>
            </td>

            <td data-label="Trainer">
              <small>
                {{ client.trainer.name }}
              </small>
            </td>

            <td data-label="Mode of Class">
              <small>
                {{ client.mode_of_class.name }}
              </small>
            </td>

            <!--v-for="(client) in client.attendance"
 :key="client.id" -->
            <!-- <td data-label="Attendance Type">
              <small>
                {{ client.attendance[0].Atttype.name }}
              </small>
            </td> -->

            <td data-label="Tentative start">
              <small v-if="client.tentative_start">
                {{ dayjs(client.tentative_start).format("DD-MM-YYYY HH:mm") }}
              </small>
              <small v-else class="p-4">---</small>
            </td>
          </tr>
        </tbody>

        <tbody v-if="items.result.student_batches.length > 3">
          <tr
            v-for="(client, index) in items.result.student_batches.slice(0,3)"
            :key="client.id"
            :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
          >
            <!-- {{client}} -->

            <td data-label="BatchCode">
              <small>
                {{ client.batchplan.name }}
              </small>
            </td>

            <td data-label="Branch">
              <small>
                {{ client.branch.name }}
              </small>
            </td>

            <td data-label="Course">
              <small>
                {{ client.batchplan.course.name }}
              </small>
            </td>

            <td data-label="Subject">
              <small>
                {{ client.subject.name }}
              </small>
            </td>

            <td data-label="Trainer">
              <small>
                {{ client.trainer.name }}
              </small>
            </td>

            <td data-label="Mode of Class">
              <small>
                {{ client.mode_of_class.name }}
              </small>
            </td>

            <!--v-for="(client) in client.attendance"
 :key="client.id" -->
            <!-- <td data-label="Attendance Type">
              <small>
                {{ client.attendance[0].Atttype.name }}
              </small>
            </td> -->

            <td data-label="Tentative start">
              <small v-if="client.tentative_start">
                {{ dayjs(client.tentative_start).format("DD-MM-YYYY HH:mm") }}
              </small>
              <small v-else class="p-4">---</small>
            </td>
          </tr>
        </tbody>


        <tbody v-if="isModalPaymentActive && items.result.student_batches.length>3">
          <tr
            v-for="(client, index) in items.result.student_batches.slice(3)"
            :key="client.id"
            :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
          >
            <!-- {{client}} -->

            <td data-label="BatchCode">
              <small>
                {{ client.batchplan.name }}
              </small>
            </td>

            <td data-label="Branch">
              <small>
                {{ client.branch.name }}
              </small>
            </td>

            <td data-label="Course">
              <small>
                {{ client.batchplan.course.name }}
              </small>
            </td>

            <td data-label="Subject">
              <small>
                {{ client.subject.name }}
              </small>
            </td>

            <td data-label="Trainer">
              <small>
                {{ client.trainer.name }}
              </small>
            </td>

            <td data-label="Mode of Class">
              <small>
                {{ client.mode_of_class.name }}
              </small>
            </td>

            <!--v-for="(client) in client.attendance"
 :key="client.id" -->
            <!-- <td data-label="Attendance Type">
              <small>
                {{ client.attendance[0].Atttype.name }}
              </small>
            </td> -->

            <td data-label="Tentative start">
              <small v-if="client.tentative_start">
                {{ dayjs(client.tentative_start).format("DD-MM-YYYY HH:mm") }}
              </small>
              <small v-else class="p-4">---</small>
            </td>
          </tr>
        </tbody>
     
      </table>
      <div v-if="items.result.student_batches.length > 3" class="flex items-center pt-2 justify-end pr-3">
 <jb-button @click="isModalPaymentActive =! isModalPaymentActive" :label="isModalPaymentActive ? 'Show Less' : 'Show More'" small type="submit" class="bg-cyan-600  text-sm" :icon="mdiMore"/> 
      </div>
    </div>
  </card-component>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import MainSection from "@/components/MainSection.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import {
  mdiCellphone,
  mdiMail,
  mdiAccount,
  mdiPhone,
  mdiSchool,
  mdiCancel,mdiComment,mdiCashCheck,mdiCash,mdiCashMultiple,mdiIdentifier
} from "@mdi/js";
import CardComponent from "@/components/CardComponent.vue";
import { themeStore } from "../stores/theme";
import { sessionStore } from "../stores/session";
import { collectorStore } from "@/stores/collector";
import dayjs from "dayjs";
import Multiselect from "@vueform/multiselect";
import { selectClasses } from "../selectcss";

const isModalPaymentActive=ref(false)
const route = useRoute();
const router = useRouter();
const theme = themeStore();
const user = sessionStore();
const collector = collectorStore();
const searchdata = ref(false);
const form1 = reactive({
  email: "",
  number: "",
  comment: "",
});

const lightBorderStyle = computed(() => theme.lightBorderStyle)
const lightBgStyle = computed(() => theme.lightBgStyle)
const tableTrStyle = computed(() => theme.tableTrStyle)
const tableTrOddStyle = computed(() => theme.tableTrOddStyle)

const concession_type = [{ type: "increment" }, { type: "decrement" }];
const conc_reason = computed(() => {
  return collector.con_reason.items;
});
// form
const isSaveOpen = ref(true);
let form = reactive({
  type: null,
  amount: null,
  re_amount: null,
  concessionimg: null,
  comment: "",
  target: null,
  reason:null,
  oneshot:""
});
const image_error = ref(false);
const image_size = ref(false);
function onFileChange(e) {
  var files = e.target.files || e.dataTransfer.files;
  for (const name in files) {
    if (files.hasOwnProperty(name)) {
      form.concessionimg = files[name];
      if (form.concessionimg.size >= 5242880) {
        alert("Image size should be less than 5MB");
        image_size.value = true;
      }
      // else if(form.upload.size <= 50000){
      //   alert("Image size should be greater than 50KB");
      //   image_size.value=true
      // }
      else {
        form.concessionimg = files[name];
      }
    }
  }
}
const concessionform = async () => {
  let valid = true;
  let formValues = JSON.parse(JSON.stringify(form));
  try {
    if (form.target === false) {
      for (const key in formValues) {

        if (key === "reason" && formValues[key] === null) {
          valid = false;
          theme.pushMessage("Concession reason is required ");
        }
        if (key === "amount" && formValues[key] === null) {
          valid = false;
          theme.pushMessage(" Amount is required ");
        }

        if (
          key === "amount" &&
          formValues[key] !== null &&
          formValues[key] <= 0
        ) {
          valid = false;
          theme.pushMessage(" Amount should be gretaer than 0");
        }
        if (
          key === "amount" &&
          formValues[key] !== null &&
          formValues[key] > 5000
        ) {
          valid = false;
          theme.pushMessage(
            "Amount is Exceeded.You don't have permission to give more than 5000"
          );
        }
        if (key === "re_amount" && formValues[key] === null) {
          valid = false;
          theme.pushMessage("Confirm  Amount is required");
        }

        if (key === "concessionimg" && formValues[key] === null) {
          valid = false;
          theme.pushMessage("img is required");
        }
      }
      if (formValues["amount"] != formValues["re_amount"]) {
        valid = false;
        theme.pushMessage(" Amount and Confirm  Amount is not Matching");
      }
      if (form.oneshot ==="") {
        valid = false;
        theme.pushMessage("Select oneshot or partial");
      }
    
      if (
        form.concessionimg &&
        form.concessionimg.type != "image/png" &&
        form.concessionimg.type != "image/jpeg" &&
        form.concessionimg.type != "image/jpg" &&
        form.concessionimg.type != "image/jfif" &&
        form.concessionimg.type != "image/PNG" &&
        form.concessionimg.type != "image/JPEG" &&
        form.concessionimg.type != "image/JPG" &&
        form.concessionimg.type != "image/JFIF"
      ) {
        image_error.value = true;
        theme.pushMessage(
          "Uploaded image should be of type png/jpeg/jpg/jfif/PNG/JPEG/JPG/JFIF"
        );
        valid = false;
      }
      if (form.concessionimg && form.concessionimg.size >= 5242880) {
        theme.pushMessage("Image size should be lesser than 5MB");
        document.getElementById("file").value = "";
        document.getElementById("img-show").src = "";
        form.concessionimg = null;
        valid = false;
      }

      if (valid) {
        form.amount = parseFloat(formValues["amount"]);
        if (form.concessionimg && form.concessionimg.name) {
          pageLoading.value = true;
          let data = new FormData();
          data.append("type", "concession");
          data.append("id", concession.bid);
          data.append("course", concession.course);
          data.append("course_id", concession.course_id);
          data.append(
            "image",
            form.concessionimg,
            form.concessionimg.name
          );
          data.append("amount", form.amount);
          data.append("comment", form.comment);
          data.append("oneshot",form.oneshot);
          data.append("reason", JSON.stringify({
                      "id":form.reason.id,
                       "name":form.reason.name
              }));
    
          await collector.postconcession(data);
          if (JSON.parse(JSON.stringify(collector.$state.con)).length != 0) {
          //   if(form.concessionimg.size <= 5242880){
          //     let data1 = new FormData();
          // data1.append("type", "concession");
          // data1.append("id", batchplan.$state.con.id);
          // data1.append("upload",  form.concessionimg,
          //   form.concessionimg.name );

          //   }
          // await batchplan.postconcession(data);
            router.push("/concessionlist");
            pageLoading.value = false;
            theme.pushMessage(collector.$state.con, true);
            collector.$state.con = [];
          } else if (collector.$state.error_con) {
            pageLoading.value = false;
            theme.pushMessage(collector.$state.error_con, false);
            collector.$state.error_con = "";
          }
        }
      }
    }

    if (form.target === true) {
      if (form1.comment === "") {
        valid = false;
        theme.pushMessage("Comment is mandatory");
      }
      if(form.oneshot===""){
          valid = false;
          theme.pushMessage("Select oneshot or partial"); 
        }
      if (valid) {
        pageLoading.value = true;
        let data1 = new FormData();
        data1.append("type", "balancezero");
        data1.append("id", concession.bid);
        data1.append("course", concession.course);
        data1.append("comment", form1.comment);
        data1.append("course_id", concession.course_id);
        data1.append("oneshot",form.oneshot);
        await collector.postconcession(data1);
        if (JSON.parse(JSON.stringify(collector.$state.con)).length != 0) {
          pageLoading.value = false;
          theme.pushMessage(collector.$state.con, true);
          router.push("/concessionlist");
          collector.$state.con = [];
        } else if (collector.$state.error_con) {
          theme.pushMessage(collector.$state.error_con, false);
          pageLoading.value = false;
          collector.$state.error_con = "";
        }
      }
    }
  } catch {
    // theme.pushMessage("Form Error, please fill out mandatory fields");
  }
};

const maskNumber = (number) => {
  return number.replace(/\d(?=\d{4})/g, "*");
};

const isBatchConcession = ref(false);
// \s+/g
const hasError = ref(false);
const hasError1 = ref(false);
const pageLoading = ref(false);
const items = computed(() => collector.batch_list);
const cardClassAddon = computed(() =>
  hasError.value || hasError1.value ? "animate-shake" : ""
);

const email = (value) => {
  // if (/(?=^[a-z0-9.]+@[a-z0-9.-]+\.[a-zA-Z]{2,6}$)(?=^.{1,240}$)/.test(value)) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)){
    return form1.email;
  }
};

// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const concession = reactive({
  bid: "",
  course: "",
  name: "",
  course_id:""
});

const onconcession = (bid, course,course_id, name) => {
  (concession.bid = bid),
    (concession.course = course),
    (concession.course_id = course_id),
    (concession.name = name),
    (isBatchConcession.value = true);
  (form.type = null),
  form.reason=null,
    (form.amount = null),
    (form.re_amount = null),
    (form.concessionimg = null),
    (form.comment = ""),
    (form1.comment = ""),
    (form.oneshot = ""),
    (form.target = null);
};

onBeforeMount(async () => {
  await user.checkUser();
  await collector.getconcessionreason()
  theme.setPageTitle("Student Concession");
  //  await batchplan.getbatchlist()
});

const clear = async () => {
  (form1.email = ""),
    (form1.number = ""),
    (searchdata.value = false),
    (isBatchConcession.value = false),
    (collector.batch_list = []),
    (form.type = null),
    (form.amount = null),
    (form.re_amount = null),
    (form.concessionimg = null),
    (form.comment = ""),
    form.oneshot = "",
    (form.target = null),
    form.reason=null,
    (form1.comment = "");
  isSaveOpen.value = false;
  isModalPaymentActive.value=false
};

// console.log(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form1.number))
const submit = async () => {
  if (form1.email === "" && form1.number === "") {
    hasError.value = true;
    hasError1.value = true;
    theme.pushMessage("Please fill either Email or Number");
  } 
  else if (form1.email && email(form1.email) === undefined) {
    hasError.value = true;
    theme.pushMessage("Email is Invalid");
  } 

  else {
    try {
      if(form1.email != "" && form1.number != ""){
        form1.number = ""
      }
      if (form1.email || form1.number) {
        if (form1.number) {
          // let contact = String(form.number.replace("+", "%2B"))
          pageLoading.value = true;
         await collector.getbatchlist({ number: form1.number });
          //   router.push(`/batch_concession?number=${form.number}`);
          pageLoading.value = false;
        }
        if (form1.email) {
          pageLoading.value = true;
          await collector.getbatchlist({ email: form1.email });
          //   router.push(`/batch_concession?email=${form.email}`);
          pageLoading.value = false;
        }
      }
      searchdata.value = true;
      isBatchConcession.value = false;
    } 
    catch (error) {
      console.log("vue error", error);
    }
  }
};


const oneshot=()=>{
  form.oneshot=''
}
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>
