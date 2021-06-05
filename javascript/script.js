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
    const cryptoInfo = document.querySelector('#crypto-info')
    const inputArea = document.querySelector('input');
    const userInput = inputArea.value;
    // Loop Through Array. If userInput = Crypto, 
    dataFromAPI.forEach( (individualCrypto) => {
        if (userInput == individualCrypto.name)
        console.log(individualCrypto);
        cryptoInfo.innerHTML = '';
        cryptoInfo.innerHTML = `
        Icon:
        <figure>
            <img src="${individualCrypto.image}" alt="Symbol for ${individualCrypto.name}">
        </figure>
        <h2>Crypto Name: ${individualCrypto.name} (${individualCrypto.symbol})</h2>
        <h2>Testing ID Value: ${individualCrypto.id}</h2>
        <h2>Current Price: ${individualCrypto.current_price.toFixed(5)}</h2>
        <h2>Change in Last 1 Hour: ${individualCrypto.price_change_percentage_1h_in_currency.toFixed(5)}</h2>
        <h2>24 Hour Low: ${individualCrypto.low_24h.toFixed(5)}</h2>
        <h2>24 Hour High: ${individualCrypto.high_24h.toFixed(5)}</h2>
        <h2>Market Cap: ${individualCrypto.market_cap}</h2>
        <h2>Market Cap Rank: ${individualCrypto.market_cap_rank}</h2>
        <h2>Last Updated: ${individualCrypto.last_updated}</h2>
        `
        inputArea.value = '';
    });
    });
};

// Setup Init Function
cryptoApp.init = () => {
    cryptoApp.getCrypto();
    cryptoApp.displayCrypto();
}

// Call Init
cryptoApp.init();