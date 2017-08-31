'use strict';

(function () {
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

  /**
   * @param {object} location
   * @return {object} Случайные координаты
   */
  var getLocation = function (location) {
    return {
      x: window.util.getRandomNumber(location.X.MIN, location.X.MAX),
      y: window.util.getRandomNumber(location.Y.MIN, location.Y.MAX)
    };
  };

  /**
   * @return {Array.<number>} Массив номеров
   */
  var getImageAddress = function () {
    return window.util.getRandomArray(NUMBER_OF_ADS, function () {
      var number = window.util.getRandomNumber(1, NUMBER_OF_ADS).toString();
      return number.length === 1 ? '0' + number : number;
    }, true);
  };

  /**
   * @return {Array.<string>} Массив заголовков
   */
  var getTitles = function () {
    return window.util.getRandomArray(NUMBER_OF_ADS, function () {
      return window.util.getRandomArrayElem(AD_TEMPLATE.TITLE);
    }, true);
  };

  /**
   * @return {Array.<string>} Массив строк случайной длины
   */
  var getFeatures = function () {
    return window.util.getRandomArray(window.util.getRandomNumber(1, AD_TEMPLATE.FEATURES.length - 1), function () {
      return window.util.getRandomArrayElem(AD_TEMPLATE.FEATURES);
    }, true);
  };

  /**
   * Создаёт рандомное объявление
   * @return {Ad}
   */
  window.createAd = function () {
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
        price: window.util.getRandomNumber(AD_TEMPLATE.PRICES.MIN, AD_TEMPLATE.PRICES.MAX),
        type: window.util.getRandomArrayElem(AD_TEMPLATE.TYPE),
        rooms: window.util.getRandomNumber(AD_TEMPLATE.ROOMS.MIN, AD_TEMPLATE.ROOMS.MAX),
        guests: window.util.getRandomNumber(1, 10),
        checkin: window.util.getRandomArrayElem(AD_TEMPLATE.TIME),
        checkout: window.util.getRandomArrayElem(AD_TEMPLATE.TIME),
        features: getFeatures(),
        description: '',
        photos: []
      }
    };
  };

  var imageAddresses = getImageAddress();
  var titles = getTitles();

})();
