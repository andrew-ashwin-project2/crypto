// Create Object Space
const cryptoApp = {}
cryptoApp.url = `https://api.coingecko.com/api/v3/coins/markets`
// // Define Function to Retrieve Information
cryptoApp.getCrypto = () => {
    // URL Constructor to Pass in Parameters
    const apiURL = new URL (cryptoApp.url);
    apiURL.search = new URLSearchParams({
        vs_currency: 'cad',  
        order: 'market_cap_desc',
        per_page: 250,
        page: 1,
        price_change_percentage: '1h,24h,7d,14d,30d,200d,1y'
    });
    // Fetch to Make API Request. Return Raw Data as JSON Data.
    fetch(apiURL).then((rawData) => {
        return rawData.json();
    }).then((jsonData) => {
        console.log(jsonData);
        // Call displayCrypto Function
        cryptoApp.displayCrypto(jsonData);
        cryptoApp.autoFill(jsonData);
    });
};
cryptoApp.autoFill = (arrayData) => {
    const searchInput = document.getElementById('submit');
    const suggestionsPanel = document.querySelector('.suggestions');
    searchInput.addEventListener('keyup', function () {
        // console.log(searchInput.value);
        const input = searchInput.value.toLowerCase();
        suggestionsPanel.innerHTML = '';
        const suggestions = arrayData.filter((specificCrypto) => {
            return specificCrypto.id.toLowerCase().startsWith(input) || 
            specificCrypto.name.toLowerCase().startsWith(input);
        });
        suggestions.forEach(function (suggested) {
            const coinSuggestion = document.createElement('li');
            coinSuggestion.innerHTML = `<img src="${suggested.image}" alt="Symbol for ${suggested.name}" class="searchSymbol">  ${suggested.name}`;
            suggestionsPanel.appendChild(coinSuggestion);
        });
        if (input === '') {
            suggestionsPanel.innerHTML = '';
        } 
    });
    suggestionsPanel.addEventListener('click', function (event) {
        const dC = event.target.innerText;
        searchInput.value = `${dC}`;
        suggestionsPanel.innerHTML = '';
        searchInput.focus();
        cryptoApp.displayCrypto(dC);
    })
    searchInput.addEventListener('keydown', function (event) {
        if (event.key == 'ArrowDown') {
            console.log('down arrow pressed');
            suggestionsPanel.focus();
        };
    });
};

// Define displayCrypto Function
cryptoApp.displayCrypto = function(dataFromAPI) {
    // Store form in a variable
    const form = document.querySelector('form');
    // Add event listener to listen for submit
    form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Define variables related to form and display
    const cryptoInfo = document.querySelector('#crypto-info');
    const inputArea = document.querySelector('input');
    const userInput = inputArea.value;
    console.log(dataFromAPI);
    // Loop Through Array. If userInput = Crypto, Add InnerHTML That Include Corresponding Values
    for (let individualCrypto in dataFromAPI) {
        if (userInput.toLowerCase() == dataFromAPI[individualCrypto].name.toLowerCase()){
            cryptoInfo.innerHTML = `
            <figure>
            <img src="${dataFromAPI[individualCrypto].image}" alt="Symbol for ${dataFromAPI[individualCrypto].name}">
            </figure>
            <h2>Crypto Name: ${dataFromAPI[individualCrypto].name} (${dataFromAPI[individualCrypto].symbol.toUpperCase()})</h2>
            <h2>Current Price: $${dataFromAPI[individualCrypto].current_price.toFixed(2)}</h2>
            <h3>24 Hour Low: $${dataFromAPI[individualCrypto].low_24h.toFixed(2)}</h3>
            <h3>24 Hour High: $${dataFromAPI[individualCrypto].high_24h.toFixed(2)}</h3>
            <h3>Change in Last 1 Hour: $${dataFromAPI[individualCrypto].price_change_percentage_1h_in_currency.toFixed(2)}</h3>
            <h4>Market Cap: $${dataFromAPI[individualCrypto].market_cap}</h4>
            <h4>Market Cap Rank: ${dataFromAPI[individualCrypto].market_cap_rank}/250</h4>
            <h5>Last Updated: ${dataFromAPI[individualCrypto].last_updated}</h5>
            `;   
            inputArea.value = '';
        } else if (userInput !== dataFromAPI[individualCrypto].name){
            inputArea.placeholder = `No results found for "${userInput}", please try again.`;
            inputArea.value = '';
    }; 
    };
    });
};
// Setup Init Function
cryptoApp.init = () => {
    cryptoApp.getCrypto();
}
// Call Init
cryptoApp.init();