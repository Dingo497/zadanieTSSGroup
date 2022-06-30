import { createStore } from 'vuex';
import {functions} from '../xmlFunctions/index.js';

const apiUrl = 'https://old.tssgroup.sk/pricelisthandler.aspx?login=52713229&password=b219957d46535ae6afeaebb324afc451482b4768f64d161a3c8fb3040856b013b2d1eca95ccbc5dfb8c9dcdebf842de4ea205f8c7780579919214ae9bf0023c6&typxml=1';

const store = createStore({
  state: {
    orders: {
      rows: null,
      columns: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'On Stock', value: 'onStock', sortable: true },
        { text: 'Picture Main', value: 'pictureMain'},
        { text: 'Short Description', value: 'shortDescription'},
        { text: 'Weight', value: 'weight', sortable: true },
        // { text: 'How many orders', value: 'order_count', sortable: true },
        // eset pridat ich IDcka
      ]
    }
  },


  mutations: {
    setRows (state, data) {
      state.orders.rows = data;
    },
  },


  actions: {
    getOrders({commit}) {
      return fetch(apiUrl)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");

        const categories = xml.getElementsByTagName("Category");
        const rows = [];

        for (let i = 0; i < categories.length; i++) {
          if(categories[i].id === 'QI90000101') {
            const name = functions.getData(categories[i].nextElementSibling, 'Name');
            const shortDescription = functions.getData(categories[i].nextElementSibling, 'ShortDescription');
            const onStock = functions.getData(categories[i].nextElementSibling, 'OnStock');
            const pictureMain = functions.getData(categories[i].nextElementSibling, 'PictureMain');
            const weight = functions.getData(categories[i].nextElementSibling, 'WEIGHT');
            const id = functions.getData(categories[i].nextElementSibling, 'ID');
            rows.push({name, shortDescription, onStock, pictureMain, weight, id});
          }
        }
        console.log(rows);
        
        commit('setRows', rows);
      });
    } 
  }
});

export default store;