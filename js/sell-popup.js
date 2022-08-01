import './buy-popup.js';

const userNavTabs = document.querySelector('.tabs--toggle-buy-sell');
const buttonSeller = userNavTabs.querySelector('.tabs__control:first-child');
const buyPopup = document.querySelector('.modal--buy');
const sellPopup = document.querySelector('.modal--sell');
const paymentsList = document.querySelector('.js-paymentsListSell');
const bankCard = document.querySelector('.js-bankCardSell');
const cryptoField = document.querySelector('.js-cryptoFieldSell');
const paymentField = document.querySelector('.js-paymentFieldSell');
const keksField = document.querySelector('.js-keksFieldSell');
let selectedUser

const changePaymentMethod = (event) => {
  const value = event.target.value;

  if (value === 'Cash in person') {
    bankCard.value = ''
  } else {
    const paymentMethod = user.paymentMethods.find(item => item.provider === value)

    bankCard.value = paymentMethod.accountNumber
  }
}

export const drawSellerPopup = ({ user, selectedUserData }) => {
  const { userName, isVerified, balance: { amount }, exchangeRate } = selectedUserData;
  const { paymentMethods } = user;
  const name = sellPopup.querySelector('.js-transactionNameSell');
  const star = sellPopup.querySelector('.js-transactionStarSell');
  const exhangeRate = sellPopup.querySelector('.transaction-info__item--exchangerate');
  const exhangeRateInfo = exhangeRate.querySelector('.transaction-info__data');
  const cashLimit = sellPopup.querySelector('.transaction-info__item--cashlimit');
  const cashLimitInfo = cashLimit.querySelector('.transaction-info__data');

  selectedUser = selectedUserData

  name.textContent = userName;

  if (isVerified === false) {
    star.style.display = 'none'
  } else {
    star.style.display = 'block'
  }

  exhangeRateInfo.textContent = exchangeRate.toLocaleString() + ' ₽';
  cashLimitInfo.textContent = amount.toLocaleString() + ' ₽';

  const paymentSystems = paymentMethods.map((item) => item.provider);

  paymentsList.innerHTML = '<option selected disabled>Выберите платёжную систему</option>'

  paymentSystems.forEach((item) => {
    const template = document.createElement('option')

    template.textContent = item

    paymentsList.appendChild(template)
  })

  paymentsList.addEventListener('change', changePaymentMethod)

  cryptoField.value = selectedUserData.wallet.address

};

const calculateEnrollment = (event) => {
  const value = event.target.value
  const exchangeRate = selectedUser.exchangeRate
  let result = ''

  if (value) {
    result = value / exchangeRate
  }

  keksField.value = result
}

const calculateAmount = (event) => {
  const value = event.target.value
  const exchangeRate = selectedUser.exchangeRate
  let result = ''

  if (value) {
    result = (value * exchangeRate).toFixed(2)
  }

  paymentField.value = result
}

paymentField.addEventListener('input', calculateEnrollment);
keksField.addEventListener('input', calculateAmount);
