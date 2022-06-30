<template>
  <form 
    class="font-sans" 
    v-if="tableContent" 
    @submit.prevent="submitTable($event)"
  >
    <table class="mx-10 mt-10">
      <thead>
        <tr>
          <th 
            v-for="(column, index) in tableHeader" 
            :key="index" 
            class="border-2 p-2 text-blue-500" 
            :class="column.width"
          >
            <div 
              class="flex justify-center"
              @click="(column.sortable) ? changeSorting(column.value) : ''"
              :class="(column.sortable) ? 'cursor-pointer' : ''"
            >
              <p>{{ column.text }}</p>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(row, index) in sortTableData" 
          :key="index"
        >
          <input 
            type="hidden" 
            name="order_id" 
            :value="row.id"
          >
          <td class="border-2 p-2">
            {{ row.name }}
          </td>
          <td class="border-2 p-2">
            {{ row.onStock }}
          </td>
          <td class="border-2 p-2">
            <img :src="row.pictureMain" alt="image">
          </td>
          <td class="border-2 p-2" v-html="row.shortDescription"></td>
          <td class="border-2 p-2">
            {{ row.weight }}
          </td>
          <td class="border-2 p-2">
            <input 
              class="shadow appearance-none border border-blue-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              type="text" 
              value=0 
              @keyup="handleOrderCount($event)" 
              name="order_count" 
            />
          </td>
        </tr>
      </tbody>
    </table>
    <button 
      type="submit" 
      class="mx-10 my-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
      Submit Table
    </button>
  </form>
</template>


<script setup>
import { computed, ref } from 'vue';
import store from '../store/index.js';

// get Orders from API
store.dispatch('getOrders');
const tableHeader = computed(() => store.state.orders.columns);
const tableContent = computed(() => store.state.orders.rows);

const currentSort = ref('name');
const currentSortDir = ref('asc');

// handle and filter if input has only numbers
const handleOrderCount = (ev) => {
  const pattern = /^\d+\.?\d*$/;
  if(!pattern.test(ev.target.value)) return ev.target.value = '';
  else ev.target.value = ev.target.value;
};

// computed for sort XML
const sortTableData = computed(() => {
   return tableContent.value.sort((a,b) => {
      let modifier = 1;
      if(currentSortDir.value === 'desc') modifier = -1;
      if(a[currentSort.value] < b[currentSort.value]) return -1 * modifier;
      if(a[currentSort.value] > b[currentSort.value]) return 1 * modifier;
      return 0;
    });
});

// set up what column I want sorting and how
const changeSorting = (column) => {
  if(column === currentSort.value) {
      currentSortDir.value = (currentSortDir.value === 'asc') ? ('desc') : ('asc');
  }
  currentSort.value = column;
};

// Submit and send data to backend
const submitTable = (ev) => {
  const valuesToStore = [];
  const orderIds = document.getElementsByName('order_id');
  const orderCounts = document.getElementsByName('order_count');
  
  for (let i = 0; i < orderIds.length; i++) {
    valuesToStore[i] = {
      'order_id': orderIds[i].value,
      'order_count': parseInt(orderCounts[i].value)
    };
  }
  store.dispatch('storeTableData', valuesToStore);
};
</script>