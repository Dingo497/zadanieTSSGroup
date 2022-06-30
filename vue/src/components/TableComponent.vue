<template>
  <div v-if="tableContent" >
    <Vue3EasyDataTable
      :headers="tableHeader"
      :items="tableContent"
      alternating
      header-font-color="#3a7cbc"
      even-row-font-color="#3a7cbc"
      row-font-color="#0a2131"
    > 
    </Vue3EasyDataTable>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import store from '../store/index.js';

store.dispatch('getOrders');
const tableHeader = computed(() => store.state.orders.columns);
const tableContent = computed(() => store.state.orders.rows);
</script>