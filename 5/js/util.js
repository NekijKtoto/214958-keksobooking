'use strict';

window.util = (function () {

  var KEYS = {
    ESC: 27,
    ENTER: 13
  };

  return {
    /**
     * @param {number} min
     * @param {number} max
     * @return {number} Рандомное число от min до max
     */
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },

    /**
     * @param {array} array
     * @return {*} Рандомный элемент массива
     */
    getRandomArrayElem: function (array) {
      return array[window.util.getRandomNumber(0, array.length - 1)];
    },

    /**
     * Создаёт массив, состоящий из сгенерированных объектов
     * @param {number} length
     * @param {function} getItem
     * @param {boolean} uniq - Если true, элементы в массиве будут уникальными
     * @return {array}
     */
    getRandomArray: function (length, getItem, uniq) {
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
    },

    /**
     * Обрабатывает событие нажатия клавиши enter
     * @param {Event} evt
     * @param {Function} action
     */
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === KEYS.ENTER) {
        action();
      }
    },

    /**
     * Удаляет класс
     * @param {NodeList} elems - Элементы для поиска удаляемого класса
     * @param {string} className - Удаляемый класс
     */
    removeClass: function (elems, className) {
      for (var i = 0; i < elems.length; i++) {
        elems[i].classList.remove(className);
      }
    },

    /**
     * Обрабатывает событие нажатия клавиши escape
     * @param {Event} evt
     * @param {Function} action
     */
    isEscEvent: function (evt, action) {
      if (evt.keyCode === KEYS.ESC) {
        action();
      }
    },

    /**
     * Заполняет блок DOM-элементами на основе массива JS-объектов
     * @param {array} array
     * @param {function} fn
     * @return {DocumentFragment}
     */
    getFragment: function (array, fn) {
      var fragment = document.createDocumentFragment();

      array.forEach(function (elem, index) {
        fragment.appendChild(fn(elem, index));
      });

      return fragment;
    }

  };
})();
