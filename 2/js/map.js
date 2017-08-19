'use strict';

/**
 * Объявление
 * @typedef {object} Ad
 * @property {string} avatar - Аватар пользователя
 * @property {string} title - Заголовок
 * @property {string} address - Адрес
 * @property {number} price - Цена
 * @property {number} rooms - Количество комнат
 * @property {number} guests - Количество гостей
 * @property {string} checkin - Время заезда
 * @property {string} checkout - Время выезда
 * @property {Array.<string>} features - Особенности
 * @property {string} description - Описание
 * @property {array} photos - Фото
 * @property {number} x - Координата x метки на карте
 * @property {number} y - Координата y метки на карте
 */

var numberOfAds = 8;
var AD_TEMPLATE = {
  MIN_ROOMS: 1,
  MAX_ROOMS: 5,
  MIN_PRICE: 100,
  MAX_PRICE: 1000000,
  X_MIN: 300,
  X_MAX: 900,
  Y_MIN: 100,
  Y_MAX: 500,
  TITLE: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  TYPE: ['flat', 'house', 'bungalo'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  TIME: ['12:00', '13:00', '14:00']
};

/**
 * Возвращает рандомное число от min до max
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Возвращает рандомный элемент массива
 * @param {array} array
 * @return {*}
 */
var getRandomArrayElem = function (array) {
  return array[Math.round(Math.random() * (array.length - 1))];
};

/**
 * Создаёт массив, состоящий из сгенерированных объектов
 * @param {number} length
 * @param {function} getItem
 * @param {boolean} checkItem
 * @return {array}
 */
var getRandomArray = function (length, getItem, checkItem) {
  var items = [];
  while (items.length !== length) {
    if (checkItem) {
      var item = getItem();
      if (!items.includes(item)) {
        items.push(item);
      }
    } else {
      items.push(getItem());
    }
  }
  return items;
};

/**
 * Возвращает случайные координаты
 * @param {number} minX
 * @param {number} minY
 * @param {number} maxX
 * @param {number} maxY
 * @return {object}
 */
var getLocation = function (minX, minY, maxX, maxY) {
  return {
    x: getRandomNumber(minX, maxX),
    y: getRandomNumber(minY, maxY)
  };
};

/**
 * Создаёт массив номеров
 * @return {Array.<number>}
 */
var getImageAddress = function () {
  return getRandomArray(numberOfAds, function () {
    return getRandomNumber(1, numberOfAds);
  }, true);
};

/**
 * Создаёт массив заголовков
 * @return {Array.<string>}
 */
var getTitles = function () {
  return getRandomArray(numberOfAds, function () {
    return getRandomArrayElem(AD_TEMPLATE.TITLE);
  }, true);
};

/**
 * Создаёт массив строк случайной длины
 * @return {Array.<string>}
 */
var getFeatures = function () {
  return getRandomArray(getRandomNumber(1, AD_TEMPLATE.FEATURES.length - 1), function () {
    return getRandomArrayElem(AD_TEMPLATE.FEATURES);
  }, true);
};

var imageAddresses = getImageAddress();
var titles = getTitles();

/**
 * Создаёт рандомное объявление
 * @return {Ad}
 */
var createAd = function () {
  var location = getLocation(AD_TEMPLATE.X_MIN, AD_TEMPLATE.Y_MIN, AD_TEMPLATE.X_MAX, AD_TEMPLATE.Y_MAX);
  return {
    author: {
      avatar: 'img/avatars/user0' + imageAddresses.pop() + '.png',
    },
    location: {
      x: location.x,
      y: location.y
    },
    offer: {
      title: titles.pop(),
      address: location.x + ', ' + location.y,
      price: getRandomNumber(AD_TEMPLATE.MIN_PRICE, AD_TEMPLATE.MAX_PRICE),
      type: getRandomArrayElem(AD_TEMPLATE.TYPE),
      rooms: getRandomNumber(AD_TEMPLATE.MIN_ROOMS, AD_TEMPLATE.MAX_ROOMS),
      guests: getRandomNumber(1, 10),
      checkin: getRandomArrayElem(AD_TEMPLATE.TIME),
      checkout: getRandomArrayElem(AD_TEMPLATE.TIME),
      features: getFeatures(),
      description: '',
      photos: []
    }
  };
};

/**
 * Создаёт метку на карте
 * @param {Ad} ad
 * @return {HTMLDivElement}
 */
var createPin = function (ad) {
  var div = document.createElement('div');
  div.classList.add('pin');
  div.style.left = ad.location.x + 'px';
  div.style.top = ad.location.y + 'px';
  div.innerHTML = '<img src="' + ad.author.avatar + '" class="rounded" width="40" height="40">';
  return div;
};

/**
 * Заполняет блок DOM-элементами на основе массива JS-объектов
 * @param {array} array
 * @param {function} fn
 * @return {DocumentFragment}
 */
var getFragment = function (array, fn) {
  var fragment = document.createDocumentFragment();

  array.forEach(function (elem) {
    fragment.appendChild(fn(elem));
  });

  return fragment;
};

var ads = getRandomArray(numberOfAds, createAd, false);
var pinsList = getFragment(ads, createPin);
var pinMap = document.querySelector('.tokyo__pin-map');
pinMap.appendChild(pinsList);
var lodgeTemplate = document.querySelector('#lodge-template').content;
var offerDialog = document.querySelector('#offer-dialog');
var dialogPanel = offerDialog.querySelector('.dialog__panel');

/**
 * Создаёт DocumentFragment спанов с особенностями
 * @param {Array.<string>} features
 * @return {DocumentFragment}
 */
var getFeaturesFragment = function (features) {
  var fragment = document.createDocumentFragment();
  features.forEach(function (elem) {
    var span = document.createElement('span');
    span.classList.add('feature__image');
    span.classList.add('feature__image--' + elem);
    fragment.appendChild(span);
  });
  return fragment;
};

/**
 * Создаёт DOM-элемент на основе JS-объекта
 * @param {Ad} ad
 * @return {DocumentFragment}
 */
var renderAd = function (ad) {
  var adElement = lodgeTemplate.cloneNode(true);
  var lodgeType = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };

  adElement.querySelector('.lodge__title').textContent = ad.offer.title;
  adElement.querySelector('.lodge__price').innerHTML = ad.offer.price + ' &#x20bd;/ночь';
  adElement.querySelector('.lodge__address').textContent = ad.offer.address;
  adElement.querySelector('.lodge__type').textContent = lodgeType[ad.offer.type];
  adElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + ad.offer.guests + ' гостей в ' + ad.offer.rooms + ' комнатах';
  adElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  adElement.querySelector('.lodge__features').appendChild(getFeaturesFragment(ad.offer.features));
  adElement.querySelector('.lodge__description').textContent = ad.offer.description;
  offerDialog.querySelector('.dialog__title').children[0].src = ad.author.avatar;

  return adElement;
};

var adsList = getFragment(ads.slice(0, 1), renderAd);

dialogPanel.innerHTML = '';
dialogPanel.appendChild(adsList);
