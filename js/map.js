let map;
let markerGroup;

// создание не штатной иконки
const pinIcon = L.icon({ //создание иконки, чтобы затем добавить ее на сайт
  iconUrl: './img/pin.svg',
  iconSize: [52, 52],
  iconAnhor: [26, 52],
});

const verifiedPinIcon = L.icon({
  iconUrl: './img/pin-verified.svg',
  iconSize: [52, 52],
  iconAnhor: [26, 26],
});

const createCustomPopup = (data) => {
  const { userName, isVerified, balance: { currency, amount }, exchangeRate, minAmount, paymentMethods} = data;

  const balloonTemplate = document.querySelector('#map-baloon__template').content.querySelector('.user-card');
  const popupElement = balloonTemplate.cloneNode(true);

  const sellerName = popupElement.querySelector('.user-card__user-name span');
  const star = popupElement.querySelector('.user-card__user-name svg');
  const sellerCurrency = popupElement.querySelector('.user-card__currency');
  const exhangeRate = popupElement.querySelector('.user-card__exchangerate');
  const cashLimit = popupElement.querySelector('.user-card__cashlimit');
  const paymentsList = popupElement.querySelector('.user-card__badges-list');

  sellerName.textContent = userName;

  if(!isVerified) {
    star.remove();
  };

  sellerCurrency.textContent = currency;
  exhangeRate.textContent = exchangeRate.toLocaleString() + ' ₽';
  cashLimit.textContent = minAmount + ' - ' + Math.round(amount * exchangeRate).toLocaleString() + ' ₽';

  const paymentSystems = paymentMethods.map((item) => item.provider);
  paymentsList.innerHTML = '';

  paymentSystems.forEach(item => {
    const template = document.createElement(`li`);

    template.textContent = item;
    template.classList.add('user-card__badges-item', 'badge');

    paymentsList.appendChild(template);
  })

  return popupElement;
};

const createMarker = (data) => {
  const { coords: { lat, lng }, isVerified } = data;

  const marker = L.marker (
    {
      lat,
      lng,
    },
    {
      icon: isVerified === true ? verifiedPinIcon : pinIcon
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(createCustomPopup(data))
}

export const drawMap = (data) => {
  const Map = {
    TILE: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    COPYRIGHT: '&copy: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ZOOM: 12.45,
  };

  const lat = 59.92749;
  const lng = 30.31127;

  map = L.map('map').setView([lat, lng], 15);
  markerGroup = L.layerGroup().addTo(map);
  L.tileLayer(
    Map.TILE, {
      attribution: Map.COPYRIGHT,
    }).addTo(map);

  data.forEach(item => createMarker(item))
}

const removeMapPins = () => {

  if (markerGroup) {
    markerGroup.clearLayers();
  }
};

export const updateMap = (data, isVerified) => {
  removeMapPins();

  const newData = data.filter(item => item.coords !== undefined);

  if (isVerified === true) {
    const result = newData.filter(item => item.isVerified);

    result.forEach(item => createMarker(item))
  } else {
    newData.forEach(item => createMarker(item))
  }
}
