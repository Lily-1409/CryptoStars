const Urls = {
  UsersData: 'https://cryptostar.grading.pages.academy/user',
  СounterpartiesData: 'https://cryptostar.grading.pages.academy/contractors',
};

export const sendRequest = ({ url, onSuccess, onError }) => {
  fetch (Urls[url]) //Возвращение Promise- спецобъекта, хранящего свое состояние, для получения ответа необходимо вызвать then два раза
    .then(response => response.json()) //происходит получение объекта Response, который хранит в себе состояние нашего запроса для получения тела ответа, нужно воспользоваться методом Response. Нам надо преобразовать ответ в JSON формат
    .then(data => onSuccess(data))  //получение тела запроса
    .catch(error => onError(error))
}
