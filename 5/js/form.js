'use strict';

(function () {
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
})();
