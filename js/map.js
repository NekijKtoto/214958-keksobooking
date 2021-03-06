'use strict';

/**
 * Объявление
 * @typedef {object} Ad
 * @property {object} author - Автор объявления
 * @property {string} author.avatar - Аватар автора
 * @property {object} offer - Предложение
 * @property {string} offer.title - Заголовок
 * @property {string} offer.address - Адрес
 * @property {number} offer.price - Цена
 * @property {number} offer.rooms - Количество комнат
 * @property {number} offer.guests - Количество гостей
 * @property {string} offer.checkin - Время заезда
 * @property {string} offer.checkout - Время выезда
 * @property {Array.<string>} offer.features - Особенности
 * @property {string} offer.description - Описание
 * @property {array} offer.photos - Фото
 * @property {object} location - Локация
 * @property {number} location.x - Координата x метки на карте
 * @property {number} location.y - Координата y метки на карте
 */

var NUMBER_OF_ADS = 8;

var PIN_SIZE = {
  WIDTH: 56,
  HEIGHT: 75
};
var AD_TEMPLATE = {
  ROOMS: {
    MIN: 1,
    MAX: 5
  },
  PRICES: {
    MIN: 100,
    MAX: 1000000
  },
  LOCATION: {
    X: {
      MIN: 300,
      MAX: 900
    },
    Y: {
      MIN: 100,
      MAX: 500
    }
  },
  TITLE: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  TYPE: ['flat', 'house', 'bungalo'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  TIME: ['12:00', '13:00', '14:00']
};

var KEYS = {
  ESC: 27,
  ENTER: 13
};

var ACTIVE_PIN = 'pin--active';
var HIDDEN_ELEMENT = 'hidden';

/**
 * @param {number} min
 * @param {number} max
 * @return {number} Рандомное число от min до max
 */
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * @param {array} array
 * @return {*} Рандомный элемент массива
 */
var getRandomArrayElem = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

/**
 * Создаёт массив, состоящий из сгенерированных объектов
 * @param {number} length
 * @param {function} getItem
 * @param {boolean} uniq - Если true, элементы в массиве будут уникальными
 * @return {array}
 */
var getRandomArray = function (length, getItem, uniq) {
  var items = [];
  while (items.length !== length) {
    var item = getItem();
    if (uniq) {
      if (!items.includes(item)) {
        items.push(item);
      }
    } else {
      items.push(item);
    }
  }
  return items;
};

/**
 * @param {object} location
 * @return {object} Случайные координаты
 */
var getLocation = function (location) {
  return {
    x: getRandomNumber(location.X.MIN, location.X.MAX),
    y: getRandomNumber(location.Y.MIN, location.Y.MAX)
  };
};

/**
 * @return {Array.<number>} Массив номеров
 */
var getImageAddress = function () {
  return getRandomArray(NUMBER_OF_ADS, function () {
    var number = getRandomNumber(1, NUMBER_OF_ADS).toString();
    return number.length === 1 ? '0' + number : number;
  }, true);
};

/**
 * @return {Array.<string>} Массив заголовков
 */
var getTitles = function () {
  return getRandomArray(NUMBER_OF_ADS, function () {
    return getRandomArrayElem(AD_TEMPLATE.TITLE);
  }, true);
};

/**
 * @return {Array.<string>} Массив строк случайной длины
 */
var getFeatures = function () {
  return getRandomArray(getRandomNumber(1, AD_TEMPLATE.FEATURES.length - 1), function () {
    return getRandomArrayElem(AD_TEMPLATE.FEATURES);
  }, true);
};

/**
 * Создаёт рандомное объявление
 * @return {Ad}
 */
var createAd = function () {
  var location = getLocation(AD_TEMPLATE.LOCATION);
  return {
    author: {
      avatar: 'img/avatars/user' + imageAddresses.pop() + '.png',
    },
    location: {
      x: location.x,
      y: location.y
    },
    offer: {
      title: titles.pop(),
      address: location.x + ', ' + location.y,
      price: getRandomNumber(AD_TEMPLATE.PRICES.MIN, AD_TEMPLATE.PRICES.MAX),
      type: getRandomArrayElem(AD_TEMPLATE.TYPE),
      rooms: getRandomNumber(AD_TEMPLATE.ROOMS.MIN, AD_TEMPLATE.ROOMS.MAX),
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
 * Обрабатывает событие нажатия клавиши enter или клика на пин
 * @param {Event} evt
 */
var pinEventHandler = function (evt) {
  if (evt.keyCode === KEYS.ENTER || evt.type === 'click') {
    activatePin(evt);
  }
};

/**
 * Создаёт метку на карте
 * @param {Ad} ad
 * @param {number} index индекс элемента массива
 * @return {HTMLDivElement}
 */
var createPin = function (ad, index) {
  var div = document.createElement('div');
  div.classList.add('pin');
  div.setAttribute('tabindex', '0');
  div.dataset.ad = index;
  div.style.left = ad.location.x - PIN_SIZE.WIDTH / 2 + 'px';
  div.style.top = ad.location.y - PIN_SIZE.HEIGHT + 'px';
  div.innerHTML = '<img src="' + ad.author.avatar + '" class="rounded" width="40" height="40">';
  div.addEventListener('click', pinEventHandler);
  div.addEventListener('keydown', pinEventHandler);
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

  array.forEach(function (elem, index) {
    fragment.appendChild(fn(elem, index));
  });

  return fragment;
};

/**
 * Создаёт DocumentFragment спанов с особенностями
 * @param {Array.<string>} features
 * @return {DocumentFragment}
 */
var getFeaturesFragment = function (features) {
  return getFragment(features, function (feature) {
    var span = document.createElement('span');
    span.classList.add('feature__image');
    span.classList.add('feature__image--' + feature);
    return span;
  });
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
  offerDialog.querySelector('.dialog__title img:first-child').src = ad.author.avatar;

  return adElement;
};

var imageAddresses = getImageAddress();
var titles = getTitles();
var ads = getRandomArray(NUMBER_OF_ADS, createAd, false);
var pinsList = getFragment(ads, createPin);
var pinMap = document.querySelector('.tokyo__pin-map');
pinMap.appendChild(pinsList);
var lodgeTemplate = document.querySelector('#lodge-template').content;
var offerDialog = document.querySelector('#offer-dialog');
var dialogClose = offerDialog.querySelector('.dialog__close');
var dialogPanel = offerDialog.querySelector('.dialog__panel');
var pins = pinMap.querySelectorAll('.pin:not(:first-child)');

/**
 * Активирует пин
 * @param {Event} evt
 */
var activatePin = function (evt) {
  removeClass(pins, ACTIVE_PIN);
  var target = evt.currentTarget;
  target.classList.add(ACTIVE_PIN);
  openDialog(ads[target.dataset.ad]);
};

/**
 * Открывает окно диалога с информацией о текущем выбранном объекте
 * @param {Ad} ad
 */
var openDialog = function (ad) {
  dialogPanel.innerHTML = '';
  dialogPanel.appendChild(renderAd(ad));
  offerDialog.classList.remove(HIDDEN_ELEMENT);
};

/**
 * Удаляет класс
 * @param {NodeList} elems - Элементы для поиска удаляемого класса
 * @param {string} className - Удаляемый класс
 */
var removeClass = function (elems, className) {
  for (var i = 0; i < elems.length; i++) {
    elems[i].classList.remove(className);
  }
};

/**
 * Деактивирует активный пин и удаляет окно диалога
 * @param {Event} evt
 */
var deactivateDialogAndPin = function (evt) {
  if (evt.keyCode === KEYS.ESC || evt.type === 'click') {
    offerDialog.classList.add(HIDDEN_ELEMENT);
    removeClass(pins, ACTIVE_PIN);
  }
};

dialogClose.addEventListener('click', deactivateDialogAndPin);
document.body.addEventListener('keydown', deactivateDialogAndPin);

var PRICE = {
  'flat': 1000,
  'bungalo': 0,
  'house': 5000,
  'palace': 10000
};

var CAPACITY_NUMBER = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

var form = document.querySelector('.notice__form');
var titleField = form.querySelector('#title');
var timeInField = form.querySelector('#timein');
var timeOutField = form.querySelector('#timeout');
var flatTypeField = form.querySelector('#type');
var priceField = form.querySelector('#price');
var roomNumberField = form.querySelector('#room_number');
var capacityField = form.querySelector('#capacity');
var options = capacityField.querySelectorAll('option');
var formElems = form.querySelectorAll('input:not([type="submit"]), select');

/**
 * Синхронизирует цену с типом жилья
 */
var syncFlatWithPrice = function () {
  priceField.min = PRICE[flatTypeField.value];
};

/**
 * Синхронизирует количество гостей с количеством комнат
 */
var syncRoomsWithGuests = function () {
  for (var i = 0; i < options.length; i++) {
    options[i].disabled = !CAPACITY_NUMBER[roomNumberField.value].includes(options[i].value);
    if (!options[i].disabled) {
      capacityField.value = options[i].value;
    }

  }
};

/**
 * Синхронизирует время выезда со временем заезда
 */
var syncTimeIn = function () {
  timeOutField.selectedIndex = timeInField.selectedIndex;
};

/**
 * Синхронизирует время заезда со временем выезда
 */
var syncTimeOut = function () {
  timeInField.selectedIndex = timeOutField.selectedIndex;
};

titleField.addEventListener('input', function () {
  titleField.setCustomValidity(
      titleField.validity.patternMismatch ?
        'Пожалуйста, используйте не менее 30 символов' :
        ''
  );
});

timeInField.addEventListener('change', syncTimeIn);
timeOutField.addEventListener('change', syncTimeOut);

roomNumberField.addEventListener('change', syncRoomsWithGuests);

flatTypeField.addEventListener('change', syncFlatWithPrice);

form.addEventListener('invalid', function () {
  formElems.forEach(function (elem) {
    elem.classList.toggle('invalid', !elem.validity.valid);
  });
}, true);
