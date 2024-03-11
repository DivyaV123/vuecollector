<script setup>
import Divider from '@/components/Divider.vue'
import TrendPill from '@/components/TrendPill.vue'
import IconRounded from '@/components/IconRounded.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  title1: {
    type: String,
    required: true
  },
  title2: {
    type: String,
    required: true
  },
  one_shot: {
    type: Number,
    required: true
  },
  partial_shot: {
    type: Number,
    required: true
  },
  divider: Boolean,
  trend: {
    type: String,
    default: null
  },
  trendType: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  iconType: {
    type: String,
    default: null
  }
})
</script>

<template>
  <div>
    <trend-pill
      v-if="trend"
      :trend="trend"
      :trend-type="trendType"
      small
    />
  </div>
  <div
    v-bind="$attrs"
    :class="{'flex justify-between items-center':icon}"
  >
    <div class="space-y-3">
      <h2 class="bg-black text-orange-500 py-3 font-bold text-md">
       <b>Course:</b>  {{ value }}
      </h2>
      <h4 class="text-orange-100 dark:text-orange-100 font-bold">
        <b>Branch:</b>  {{ title }}
      </h4>
      <h4 class="text-orange-100 dark:text-gray-400 font-bold text-xs">
        <b>Mode of class:</b>  {{ title1 }}
      </h4>
      <h5 class="text-orange-100 dark:text-gray-400 font-bold text-xs">
        <b>Class Timings:</b>  {{ title2 }}
      </h5>
      <h6 class="text-indigo-200 dark:text-indigo-200 font-bold text-sm">
        <b>One shot Amount:</b>  <b class="text-orange-400">{{ one_shot }}</b>
      </h6>
      <h6 class="text-indigo-200 dark:text-indigo-200 font-bold text-sm">
        <b>Partial shot Amount:</b>  <b class="text-orange-400">{{ partial_shot }}</b>
      </h6>
    </div>
    <icon-rounded
      v-if="icon"
      :icon="icon"
      :type="iconType"
      bg
    />
  </div>
  <divider v-if="divider" />
</template>
