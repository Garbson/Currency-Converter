
const fromCur = document.getElementById("fromCur");
const toCur = document.getElementById("toCur");
const getBtn = document.getElementById("currencyConverter");
const exIcon = document.querySelector("form .reverse");
const amount = document.getElementById("amount");
const exRateTxt = document.getElementById("exRateTxt");
const fromSearch = document.getElementById("fromSearch");
const toSearch = document.getElementById("toSearch");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

// Function to populate currency options in the dropdowns
function populateCurrencyOptions(selectElement) {
  for (let curCode in Country_List) {
    selectElement.insertAdjacentHTML("beforeend", `<option value="${curCode}">${curCode}</option>`);
  }
}

// Event listener for currency dropdowns (select)
populateCurrencyOptions(fromCur);
populateCurrencyOptions(toCur);

[fromCur, toCur].forEach((select) => {
  select.addEventListener("change", () => {
    const code = select.value;
    const imgTag = select.nextElementSibling;
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
  });
});

// Function to get exchange rate from API
async function getExchangeRate() {
  const amountVal = amount.value || 1;
  exRateTxt.innerText = "Getting exchange rate...";
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/5d7daba3525a80e11e344073/latest/${fromCur.value}`);
    const result = await response.json();
    const exchangeRate = result.conversion_rates[toCur.value];
    const totalExRate = (amountVal * exchangeRate).toFixed(2);
    exRateTxt.innerText = `${amountVal} ${fromCur.value} = ${totalExRate} ${toCur.value}`;
  } catch (error) {
    exRateTxt.innerText = "Something went wrong...";
  }
}

// Event listener for form submission
getBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  getExchangeRate();
});

// Function to swap 'from' and 'to' currencies
function exchangeCurrencies() {
  const temp = fromCur.value;
  fromCur.value = toCur.value;
  toCur.value = temp;
  updateFlagImagesAndExchangeRate();
}

// Function to update flag images and get the exchange rate
function updateFlagImagesAndExchangeRate() {
  [fromCur, toCur].forEach((select) => {
    const code = select.value;
    const imgTag = select.nextElementSibling;
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
  });
  getExchangeRate();
}

// Function to filter currencies based on input letter
function filterCurrencies(currencyType) {
  const letter = (currencyType === "from" ? fromSearch.value : toSearch.value).trim().toUpperCase();
  const filteredOptions = Object.keys(Country_List).filter(curCode => curCode.includes(letter));

  const selectElement = (currencyType === "from" ? fromCur : toCur);
  const selectedValue = selectElement.value;

  // Clear the dropdown options
  selectElement.innerHTML = "";

  // Re-populate the dropdown options with the filtered currencies
  filteredOptions.forEach(curCode => {
    const selected = curCode === selectedValue ? "selected" : "";
    selectElement.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
  });

  // Update the flag images and get the new exchange rate
  updateFlagImagesAndExchangeRate();
}

// Initial update of flag images and exchange rate
updateFlagImagesAndExchangeRate();