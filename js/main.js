// GLOBAL VARS
let COUNTRIES_BASE_URL = 'https://restcountries.com/v3.1';

// DOM ELEMENTS
const elCountriesForm = document.querySelector('.countries__form');
const elCountrySearchInput = document.querySelector('.js-search-input-country');
const elCountryFilter = document.querySelector('.js-filter-region');

const elCountryTemplateItem = document.querySelector('#country-template').content;
const elCountriesList = document.querySelector('.countries-list');

const elCountryModal = document.querySelector('#country-modal');
const elCountryModalName = elCountryModal.querySelector('.info-country__name');

// FUNCTIONS
function getJSON(url, successFn, errorFn) {
  fetch(url)
    .then(response => response.json())
    .then((data) => {

      if (data.status !== 404) {
        successFn(data);
      } else {
        errorFn();
      }
    })
}

function showCountries(countries) {
  elCountriesList.innerHTML = '';
  const elCountriesFragment = document.createDocumentFragment();

  countries.forEach(country => {
    let elCountryItem = elCountryTemplateItem.cloneNode(true);
    elCountryItem.querySelector('img').src = country.flags.png;
    elCountryItem.querySelector('.country__name').textContent = country.name.common;
    elCountryItem.querySelector('.country__population').textContent = country.population;
    elCountryItem.querySelector('.country__region').textContent = country.region;
    elCountryItem.querySelector('.country__capital').textContent = country.capital;
    elCountryItem.querySelector('.country__more-btn').dataset.name = country.name.common;

    elCountriesFragment.appendChild(elCountryItem);
  });

  elCountriesList.appendChild(elCountriesFragment);

}

function showCountriesError() {
  elCountriesList.innerHTML = '';
  elCountriesList.textContent = 'Not found';
}

function onCounryFormSubmit(evt) {
  evt.preventDefault();

  let searchUrl = `${COUNTRIES_BASE_URL}/name/${elCountrySearchInput.value.trim()}`;
  getJSON(searchUrl, showCountries, showCountriesError);
}

function onClickCountryList(evt) {
  if (evt.target.matches('.country__more-btn')) {
    let modalUrl = `${COUNTRIES_BASE_URL}/name/${evt.target.dataset.name}`;
    getJSON(modalUrl, updateCountryModal, showCountriesError);
  }
}

function clearModal() {
  elCountryItem.querySelector('img').src = '';
  elCountryItem.querySelector('.country__name').textContent = '';
  elCountryItem.querySelector('.country__population').textContent ='' ;
  elCountryItem.querySelector('.country__region').textContent = '';
  elCountryItem.querySelector('.country__capital').textContent = '';
  elCountryItem.querySelector('.country__more-btn').dataset.name = '';
}

function updateCountryModal(data) {
  elCountryModalName.textContent = data[0].name.common;
  elCountryModal.querySelector('.info-country__img').src = data[0].flags.svg;
  elCountryModal.querySelector('.country__details-region').textContent = data[0].region;

  // elCountryModal.querySelector('.country__details-currency').textContent = Object.keys(data[0].currencies).join(', ');


  //Asrorxo'ja aka bu variant ham bor aka "Abdulaziz" //
  elCountryModal.querySelector('.country__details-currency').textContent = Object.values(data[0].currencies)[0].name;

  // elCountryModal.querySelector('.country__details-currency').textContent = data[0].languages.join(', ');
  elCountryModal.querySelector('.country__details-borders').textContent = data[0].borders.join(', ');
}

getJSON(`${COUNTRIES_BASE_URL}/all`, showCountries, showCountriesError);

// EVENT LISTENERS
if (elCountriesForm) {
  elCountriesForm.addEventListener('submit', onCounryFormSubmit);
}

if (elCountryModal) {
  elCountryModal.addEventListener('hide.bs.modal', clearModal)
}

if (elCountriesList) {
  elCountriesList.addEventListener('click', onClickCountryList);
}