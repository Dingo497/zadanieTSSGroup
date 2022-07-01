<template>
  <div>
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
  <!-- ALERT -->
    <div 
      v-if="succesStored" 
      class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mx-72 my-5" role="alert"
    >
      <span class="block sm:inline">{{ succesStored }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
      <svg 
        @click="succesStored = null"
        class="fill-current h-6 w-6 blue-blue-500" 
        role="button" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20"
      >
      <title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    </div>
  </div>
</template>


<script setup>
import { computed, ref } from 'vue';
import store from '../store/index.js';

// get Orders from API
store.dispatch('getOrders');
const tableHeader = computed(() => store.state.orders.columns);
const tableContent = computed(() => store.state.orders.rows);

let currentSort = ref('name');
let currentSortDir = ref('asc');
let succesStored = ref(null);

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
  store.dispatch('storeTableData', valuesToStore)
    .then((response) => {
      succesStored.value = response.status;
    });
};
</script>