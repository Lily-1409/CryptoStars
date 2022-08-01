const userNavTabs = document.querySelector('.tabs--toggle-buy-sell');
const buttonSeller = userNavTabs.querySelector('.tabs__control:first-child');
const buttonBuyer = userNavTabs.querySelector('.tabs__control:last-child');
const checkBox = document.querySelector('#checked-users');
const usersList = document.querySelector('.users-list');
const mapContainer = document.querySelector('.map').closest('.container');
const switchTabListMap = document.querySelector('.tabs--toggle-list-map');
const buttonList = switchTabListMap.querySelector('.tabs__control:first-child');
const buttonMap = switchTabListMap.querySelector('.tabs__control:last-child');

let sellers = []
let buyers = []
let data = []
let user
let selectedUserId

import { getUserData, fillUserData } from './users-data.js';
import { getCounterparties, drawTable } from './counterparties-data.js';
import { drawMap, updateMap } from './map.js'
import { openPopup } from './buy-popup.js'
import './sell-popup.js'


getUserData().then(res => {
  fillUserData(res)

  user = res
})

const getSellersForMap = (data) => {
  return data.filter((item) => {
    const { paymentMethods } = item;
    const paymentMethodExist = paymentMethods.find(item => item.provider === 'Cash in person');

    return item.status === 'seller' && paymentMethodExist !== undefined;
  });
};

getCounterparties().then((res) => {
  sellers = res.sellers
  buyers = res.buyers

  data = sellers

  drawTable(data)
}).catch(e => {
  console.log(e)
})

buttonSeller.addEventListener('click', function() {
  buttonBuyer.classList.remove('is-active');

  this.classList.add('is-active');

  data = sellers;

  drawTable(sellers, checkBox.checked);
});

buttonBuyer.addEventListener('click', function() {
  buttonSeller.classList.remove('is-active');

  this.classList.add('is-active');

  data = buyers;

  drawTable(data, checkBox.checked);
});

checkBox.addEventListener('change', function(e) {
  drawTable(data, checkBox.checked);
  updateMap(sellers, checkBox.checked)
});

buttonList.addEventListener('click', function() {
  mapContainer.style.display = "none";
  usersList.style.display = "block";

  buttonMap.classList.remove('is-active');
  buttonList.classList.add('is-active');
});

buttonMap.addEventListener('click', function() {
  usersList.style.display = "none";
  mapContainer.style.display = "block";

  buttonList.classList.remove('is-active');
  this.classList.add('is-active');

  drawMap(getSellersForMap(data))
});

document.addEventListener('click',function(event){
  if (event.target && event.target.classList.contains('btn--greenborder')){
    const { id } = event.target.dataset
    const selectedUser = data.find(item => item.id === id)

    selectedUserId = id

    openPopup({ user, selectedUserData: selectedUser})
   }
});
