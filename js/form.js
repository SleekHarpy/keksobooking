'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters-container');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFiltersSelects = mapFilters.querySelectorAll('select, fieldset');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var typeHousingSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var adFormResetButton = adForm.querySelector('.ad-form__reset');

  var enableElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    }
  };

  var enableForm = function () {
    adForm.classList.remove('ad-form--disabled');

    enableElements(adFormFieldsets);
    enableElements(mapFiltersSelects);
  };

  var disableElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }
  };

  var fillInAddress = function (pinCoord) {
    var address = document.querySelector('#address');

    address.value = pinCoord.x + ', ' + pinCoord.y;
  };

  var disableForm = function () {
    adForm.classList.add('ad-form--disabled');
    window.cleanChooser();
    adForm.reset();
    mapFiltersForm.reset();

    disableElements(adFormFieldsets);
    disableElements(mapFiltersSelects);

    fillInAddress(window.map.getCoordinatesPinMain(true));
  };

  disableForm();

  var validateGuestNumber = function () {
    var roomToGuestMessage = '';

    if (roomNumber.value !== '100' && capacity.value > roomNumber.value) {
      roomToGuestMessage = 'Извините, но количество гостей не должно превышать ' + roomNumber.value + '.';
    } else if (roomNumber.value !== '100' && capacity.value === '0') {
      roomToGuestMessage = 'Извините, но данная опция доступна только для аппартаментов со 100 комнатами.';
    } else if (roomNumber.value === '100' && capacity.value !== '0') {
      roomToGuestMessage = 'Извините, но аппартаменты на 100 комнат не предназначены для гостей.';
    }

    capacity.setCustomValidity(roomToGuestMessage);
  };

  validateGuestNumber();

  roomNumber.addEventListener('change', validateGuestNumber);
  capacity.addEventListener('change', validateGuestNumber);

  var validateHousingPrice = function () {
    if (typeHousingSelect.value === 'bungalo') {
      priceInput.min = 0;
      priceInput.placeholder = 0;
    } else if (typeHousingSelect.value === 'flat') {
      priceInput.min = 1000;
      priceInput.placeholder = 1000;
    } else if (typeHousingSelect.value === 'house') {
      priceInput.min = 5000;
      priceInput.placeholder = 5000;
    } else if (typeHousingSelect.value === 'palace') {
      priceInput.min = 10000;
      priceInput.placeholder = 10000;
    }
  };

  validateHousingPrice();

  typeHousingSelect.addEventListener('change', validateHousingPrice);
  priceInput.addEventListener('change', validateHousingPrice);

  var updateTimeIn = function (evt) {
    timeInSelect.value = evt.target.value;
  };

  var updateTimeOut = function (evt) {
    timeOutSelect.value = evt.target.value;
  };

  timeOutSelect.addEventListener('change', updateTimeIn);
  timeInSelect.addEventListener('change', updateTimeOut);

  adForm.addEventListener('submit', function (evt) {
    window.server.upload(new FormData(adForm), function () {
      window.map.disable();
      window.form.disable();
      window.message.showSuccessMessage();
    }, function () {
      window.message.showErrorMessage();
    });
    evt.preventDefault();
  });

  adFormResetButton.addEventListener('click', function () {
    window.map.disable();
    window.form.disable();
  });

  window.form = {
    enable: enableForm,
    disable: disableForm,
    fillInAddress: fillInAddress
  };
})();
