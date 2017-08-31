'use strict';

window.map = (function () {
  return {
    /**
     * Деактивирует активный пин и удаляет окно объявления
     * @param {Event} evt
     */
    deactivateDialogAndPin: function (evt) {
      window.util.isEscEvent(evt, function () {
        window.deactivateDialog();
        window.deactivatePin();
      });
    }
  };
})();
