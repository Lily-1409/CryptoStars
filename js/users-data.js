import { sendRequest } from "./api.js";

export const getUserData = () => {
  return new Promise((resolve, reject) => {
    sendRequest({
      url: 'UsersData',
      onSuccess: (data) => {
        resolve(data)
      },
      onError: (e) => {
        reject(e)
      }
    });
  })
}

export const fillUserData = (data) => {
  const userCryptoBalance = document.querySelector('#user-crypto-balance');
  const userFiatBalance = document.querySelector('#user-fiat-balance');
  const userProfileName = document.querySelector('.user-profile__name');
  const keksBalance = data.balances.find(item => item.currency === 'KEKS');
  const rubBalance = data.balances.find(item => item.currency === 'RUB');

  userCryptoBalance.textContent = keksBalance.amount;
  userFiatBalance.textContent = rubBalance.amount;
  userProfileName.textContent = data.userName;
}

