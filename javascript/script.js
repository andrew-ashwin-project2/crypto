// Create Object Space
const cryptoApp = {}
cryptoApp.url = `https://api.coingecko.com/api/v3/coins/markets`
// // Define Function to Retrieve Information
cryptoApp.getCrypto = () => {
    // URL Constructor to Pass in Parameters
    const apiURL = new URL(cryptoApp.url);
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
            specificCrypto.name.toLowerCase().startsWith(input) 
        });
        
        suggestions.forEach(function (suggested) {
            const coinSuggestion = document.createElement('li');
            coinSuggestion.setAttribute('tabindex', '0');
            coinSuggestion.innerHTML = `<img src="${suggested.image}" alt="Symbol for ${suggested.name}" class="searchSymbol">  ${suggested.name}`;
            suggestionsPanel.appendChild(coinSuggestion);
        });
        if (input === '') {
            suggestionsPanel.innerHTML = '';
        };
    });
    suggestionsPanel.addEventListener('click', function (event) {
        let dC = event.target.innerText;
        searchInput.value = `${dC}`;
        suggestionsPanel.innerHTML = "";
        searchInput.focus();
        cryptoApp.displayCrypto(dC);
        // console.log(dC);
    })
    suggestionsPanel.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            let dC = event.target.innerText;
            searchInput.value = `${dC}`;
            suggestionsPanel.innerHTML = "";
            searchInput.focus();
            cryptoApp.displayCrypto(dC);    
        }
    })
    searchInput.addEventListener('keydown', function (event) {
        if (event.key == 'ArrowDown') {
            console.log('down arrow pressed');
            suggestionsPanel.focus();
        };
    });
};
// Define displayCrypto Function
cryptoApp.displayCrypto = function (dataFromAPI) {
    // Define variables related to form and display
    const form = document.querySelector('form');
    const cryptoInfo = document.querySelector('#crypto-info');
    const inputArea = document.querySelector('input');
    const userInput = inputArea.value;
    // Add event listener to listen for submit
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Loop Through Array. If userInput = Crypto, Add InnerHTML That Include Corresponding Values
        dataFromAPI.forEach( (individualCrypto) => {
                if (userInput.toLowerCase() == individualCrypto.name.toLowerCase()) {
                    cryptoInfo.innerHTML = `
                        <figure id="">
                        <img src="${individualCrypto.image}" alt="Symbol for ${individualCrypto.name}">
                        </figure>
                        <h2>${individualCrypto.name} (${individualCrypto.symbol.toUpperCase()})</h2>
                        <h2>Current Price: $${individualCrypto.current_price.toFixed(2)}</h2>
                        <h3>24 Hour Low: $${individualCrypto.low_24h.toFixed(2)}</h3>
                        <h3>24 Hour High: $${individualCrypto.high_24h.toFixed(2)}</h3>
                        <h3>Change in Last 1 Hour: $${individualCrypto.price_change_percentage_1h_in_currency.toFixed(2)}</h3>
                        <h4>Market Cap: $${individualCrypto.market_cap}</h4>
                        <h4>Market Cap Rank: ${individualCrypto.market_cap_rank}/250</h4>
                        <h5>Last Updated: ${individualCrypto.last_updated}</h5>
                        `;   
                        inputArea.value = '';
                } else if (cryptoInfo.childElementCount == 0) {
                    cryptoInfo.innerHTML = `No results found for "${userInput}", please try again.`;
                    inputArea.value = '';
                };
        })  
    });
};

// Setup Init Function
cryptoApp.init = () => {
    cryptoApp.getCrypto();
    // cryptoApp.displayCrypto();
}
// Call Init
cryptoApp.init();