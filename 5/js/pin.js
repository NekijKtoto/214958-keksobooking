'use strict';

(function () {
  var NUMBER_OF_ADS = 8;
  var ACTIVE_PIN = 'pin--active';
  var PIN_SIZE = {
    WIDTH: 56,
    HEIGHT: 75
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
    div.addEventListener('click', activatePin);
    div.addEventListener('keydown', pinEventHandler);
    return div;
  };

  /**
   * Активирует пин
   * @param {Event} evt
   */
  var activatePin = function (evt) {
    window.util.removeClass(pins, ACTIVE_PIN);
    var target = evt.currentTarget;
    target.classList.add(ACTIVE_PIN);
    window.openDialog(ads[target.dataset.ad]);
  };

  /**
   * Обрабатывает событие нажатия клавиши enter или клика на пин
   * @param {Event} evt
   */
  var pinEventHandler = function (evt) {
    window.util.isEnterEvent(evt, function () {
      activatePin(evt);
    });
  };

  /**
   * Деактивирует активный пин
   */
  window.deactivatePin = function () {
    window.util.removeClass(pins, ACTIVE_PIN);
  };

  var ads = window.util.getRandomArray(NUMBER_OF_ADS, window.createAd, false);
  var pinsList = window.util.getFragment(ads, createPin);
  var pinMap = document.querySelector('.tokyo__pin-map');
  pinMap.appendChild(pinsList);
  var pins = pinMap.querySelectorAll('.pin:not(:first-child)');

})();
