import { sendRequest } from "./api.js";

const templateFragment = document.querySelector('#user-table-row__template').content
const template = templateFragment.querySelector('.users-list__table-row');
const usersTable = document.querySelector('.users-list__table-body');


export const drawTable = (data, isVerified) => {
  usersTable.innerHTML = '';

  if (isVerified === true) {
    data = data.filter(item => item.isVerified === true);
  }

  data.forEach(item => {
    const { id, userName, isVerified, balance: { currency, amount }, exchangeRate, minAmount, paymentMethods, status} = item

    const row = template.cloneNode(true);
    const tableName = row.querySelector('.users-list__table-name span');
    const star = row.querySelector('.users-list__table-name svg');
    const tableCurrency = row.querySelector('.users-list__table-currency');
    const tableExhangeRate = row.querySelector('.users-list__table-exchangerate');
    const tableCashLimit = row.querySelector('.users-list__table-cashlimit');
    const paymentsList = row.querySelector('.users-list__badges-list');
    const button = row.querySelector('.btn--greenborder');

    button.dataset.id = id

    const paymentSystems = paymentMethods ? paymentMethods.map((item) => item.provider) : [];

    tableName.textContent = userName;
    if(!isVerified) {
      star.innerHTML = '';
    };

    tableCurrency.textContent = currency;
    tableExhangeRate.textContent = exchangeRate.toLocaleString() + ' ₽';

    if (status === 'seller') {
      tableCashLimit.textContent = minAmount + ' - ' + Math.round(amount * exchangeRate).toLocaleString() + ' ₽';
    } else {
      tableCashLimit.textContent = amount.toLocaleString() + ' ₽';
    };

    paymentsList.innerHTML = '';

    paymentSystems.forEach(item => {
      const template = document.createElement(`li`);

      template.textContent = item;
      template.classList.add('users-list__badges-item', 'badge');

      paymentsList.appendChild(template);
    })

    usersTable.appendChild(row);
  })
}

export const getCounterparties = () => {
  return new Promise((resolve, reject) => {
    sendRequest({
      url: 'СounterpartiesData',
      onSuccess: (data) => {
        const sellers = data.filter(item => item.status === 'seller');
        const buyers = data.filter(item => item.status === 'buyer');

        resolve({ sellers, buyers })
      },
      onError: (e) => {
        reject(e)
      }
    });
  })
}

