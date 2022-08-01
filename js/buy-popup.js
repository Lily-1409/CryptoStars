import { drawSellerPopup } from "./sell-popup.js";

const userNavTabs = document.querySelector('.tabs--toggle-buy-sell');
const buttonSeller = userNavTabs.querySelector('.tabs__control:first-child');
const buyPopup = document.querySelector('.modal--buy');
const sellPopup = document.querySelector('.modal--sell');
const paymentsList = buyPopup.querySelector('.js-paymentsList');
const bankCard = buyPopup.querySelector('.js-bankCard');
const cryptoField = buyPopup.querySelector('.js-cryptoField');
const paymentField = buyPopup.querySelector('.js-paymentField');
const keksField = buyPopup.querySelector('.js-keksField');
let selectedUser

const changePaymentMethod = (event) => {
  const value = event.target.value;

  if (value === 'Cash in person') {
    bankCard.value = ''
  } else {
    const paymentMethod = selectedUser.paymentMethods.find(item => item.provider === value)

    bankCard.value = paymentMethod.accountNumber
  }
}

const clearFields = () => {
  bankCard.value = ''
  cryptoField.value = ''
}

const isEscapeKey = (evt) => evt.key === 'Escape';

const keyDownEvent = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();

    buyPopup.style.display = "none";
    sellPopup.style.display = "none";

    document.removeEventListener('keydown', keyDownEvent);
    paymentsList.removeEventListener('change', changePaymentMethod);
    document.querySelector('body').style.overflow = 'auto';
    clearFields()
  }
};

export const openPopup = (selectedUser) => {
  if(buttonSeller.classList.contains('is-active')){
    buyPopup.style.display = "block";
    drawBuyerPopup(selectedUser);
  } else {
    sellPopup.style.display = "block";
    drawSellerPopup(selectedUser);
  }
  document.querySelector('body').style.overflow = 'hidden';
  document.addEventListener('keydown', keyDownEvent)
}

document.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('modal__close-btn')){
    buyPopup.style.display = "none";
    sellPopup.style.display = "none";
    document.querySelector('body').style.overflow = 'auto';

    document.removeEventListener('keydown', keyDownEvent);
    paymentsList.removeEventListener('change', changePaymentMethod);
    clearFields()
   }
});

document.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('modal__overlay')){
    buyPopup.style.display = "none";
    sellPopup.style.display = "none";
    document.querySelector('body').style.overflow = 'auto';

    document.removeEventListener('keydown', keyDownEvent);
    paymentsList.removeEventListener('change', changePaymentMethod);
    clearFields()
  }
});

const drawBuyerPopup = ({ user, selectedUserData }) => {
  const { userName, isVerified, balance: { amount }, exchangeRate, minAmount, paymentMethods} = selectedUserData;
  const name = buyPopup.querySelector('.js-transactionName');
  const star = buyPopup.querySelector('.js-transactionStar');
  const exhangeRate = buyPopup.querySelector('.transaction-info__item--exchangerate');
  const exhangeRateInfo = exhangeRate.querySelector('.transaction-info__data');
  const cashLimit = buyPopup.querySelector('.transaction-info__item--cashlimit');
  const cashLimitInfo = cashLimit.querySelector('.transaction-info__data');

  selectedUser = selectedUserData

  name.textContent = userName;

  if (isVerified === false) {
    star.style.display = 'none'
  } else {
    star.style.display = 'block'
  }

  exhangeRateInfo.textContent = exchangeRate.toLocaleString() + ' ₽';
  cashLimitInfo.textContent = minAmount + ' - ' + Math.round(amount * exchangeRate).toLocaleString() + ' ₽';

  const paymentSystems = paymentMethods.map((item) => item.provider);

  paymentsList.innerHTML = '<option selected disabled>Выберите платёжную систему</option>'

  paymentSystems.forEach((item) => {
    const template = document.createElement('option')

    template.textContent = item

    paymentsList.appendChild(template)
  })

  paymentsList.addEventListener('change', changePaymentMethod)

  cryptoField.value = user.wallet.address
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

