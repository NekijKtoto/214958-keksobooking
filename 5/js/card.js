'use strict';

(function () {
  var offerDialog = document.querySelector('#offer-dialog');
  var dialogClose = offerDialog.querySelector('.dialog__close');
  var dialogPanel = offerDialog.querySelector('.dialog__panel');
  var lodgeTemplate = document.querySelector('#lodge-template').content;
  var HIDDEN_ELEMENT = 'hidden';

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

  /**
   * Создаёт DocumentFragment спанов с особенностями
   * @param {Array.<string>} features
   * @return {DocumentFragment}
   */
  var getFeaturesFragment = function (features) {
    return window.util.getFragment(features, function (feature) {
      var span = document.createElement('span');
      span.classList.add('feature__image');
      span.classList.add('feature__image--' + feature);
      return span;
    });
  };

  /**
   * Открывает окно диалога с информацией о текущем выбранном объекте
   * @param {Ad} ad
   */
  window.openDialog = function (ad) {
    dialogPanel.innerHTML = '';
    dialogPanel.appendChild(renderAd(ad));
    offerDialog.classList.remove(HIDDEN_ELEMENT);
  };

  /**
   * Удаляет окно объявления
   */
  window.deactivateDialog = function () {
    offerDialog.classList.add(HIDDEN_ELEMENT);
  };

  dialogClose.addEventListener('click', function () {
    window.deactivateDialog();
    window.deactivatePin();
  });
  document.body.addEventListener('keydown', window.map.deactivateDialogAndPin);
})();
