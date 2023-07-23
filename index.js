const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");
const getBtn = document.querySelector("form button");
const exIcon = document.querySelector("form .reverse");
const amount = document.querySelector("form input");
const exRateTxt = document.querySelector("form .result");

// Event listener for currency dropdowns (select)

[fromCur, toCur].forEach((select, i) => {
    for (let curCode in Country_List) {
        const selected = (i === 0 && curCode === "USD") || (i === 1 && curCode === "GBP") ? "selected" : "";
        select.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
    }
    select.addEventListener("change", () => {
        const code = select.value;
        const imgTag = select.parentElement.querySelector("img");
        imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
    });
});

// Function to get exchange rate from api

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

// Event listeners for button and exchange icon click

window.addEventListener("load", getExchangeRate);
getBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
});

exIcon.addEventListener("click", () => {
    [fromCur.value, toCur.value] = [toCur.value, fromCur.value];
    updateFlagImagesAndExchangeRate();
});

// Function to update flag images and get the exchange rate
function updateFlagImagesAndExchangeRate() {
    [fromCur, toCur].forEach((select) => {
        const code = select.value;
        const imgTag = select.parentElement.querySelector("img");
        imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
    });
    getExchangeRate();
}

// Function to filter currencies based on input letter
function filterCurrencies() {
    const letter = currencyInput.value.trim().toUpperCase();

    // Filter options based on the input letter
    const filteredOptionsFrom = Object.keys(Country_List).filter(curCode => curCode.includes(letter));
    const filteredOptionsTo = Object.keys(Country_List).filter(curCode => curCode.includes(letter));

    // Clear the dropdown options
    fromCur.innerHTML = "";
    toCur.innerHTML = "";

    // Re-populate the dropdown options with the filtered currencies
    filteredOptionsFrom.forEach(curCode => {
        const selected = curCode === fromCur.value ? "selected" : "";
        fromCur.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
    });

    filteredOptionsTo.forEach(curCode => {
        const selected = curCode === toCur.value ? "selected" : "";
        toCur.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
    });

    // Update the flag images and get the new exchange rate
    updateFlagImagesAndExchangeRate();
}

const currencyInput = document.querySelector("form input");
currencyInput.addEventListener("input", filterCurrencies);