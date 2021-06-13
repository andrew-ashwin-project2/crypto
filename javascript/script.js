const cryptoApp = {}
cryptoApp.url = `https://api.coingecko.com/api/v3/coins/markets`

cryptoApp.getCrypto = () => {
    const apiURL = new URL(cryptoApp.url);
    apiURL.search = new URLSearchParams({
        vs_currency: 'cad',
        order: 'market_cap_desc',
        per_page: 250,
        page: 1,
        price_change_percentage: '1h,24h,7d,14d,30d,200d,1y'
    });

    fetch(apiURL).then((rawData) => {
        return rawData.json();
    }).then((jsonData) => {
        cryptoApp.displayCrypto(jsonData);
        cryptoApp.autoFill(jsonData);
    });
};

// Suggestion Box Related Function 
cryptoApp.autoFill = (arrayData) => {
    const searchInput = document.getElementById('submit');
    const suggestionsPanel = document.querySelector('.suggestions');
    let prevValue = '';
    searchInput.addEventListener('keyup', function (event) {
        const input = searchInput.value.toLowerCase();
        if (input === '') {
            suggestionsPanel.innerHTML = '';
        } else if (input !== prevValue) {
            suggestionsPanel.innerHTML = '';
            const suggestions = arrayData.filter((specificCrypto) => {
                return specificCrypto.id.toLowerCase().startsWith(input) ||
                    specificCrypto.name.toLowerCase().startsWith(input) ||
                    specificCrypto.symbol.toLowerCase().startsWith(input)
            });

            suggestions.forEach(function (suggested, index) {
                const coinSuggestion = document.createElement('li');
                coinSuggestion.setAttribute('tabindex', '0');
                if (index === 0) {
                    coinSuggestion.classList.add('active');
                }
                coinSuggestion.innerHTML = `<img src="${suggested.image}" alt="Symbol for ${suggested.name}" class="searchSymbol">  ${suggested.name}`;
                suggestionsPanel.appendChild(coinSuggestion);
            });
        }
        prevValue = input;
    });

    function setSearchText (event) {
        searchInput.value = event.target.innerText;
        suggestionsPanel.innerHTML = "";
        searchInput.focus();
    }
    suggestionsPanel.addEventListener('click', setSearchText) 

    suggestionsPanel.addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            setSearchText(event);
        }
    });
    
    document.addEventListener('keyup', function (event) {
        const isArrowDown = event.key === "ArrowDown";
        if (event.key === "Escape") {
            suggestionsPanel.innerHTML = "";   
        } else if (isArrowDown || event.key === "ArrowUp") {
            const activeSuggestion = document.querySelector('.suggestions li.active');
            if (activeSuggestion) {
                const suggestions = activeSuggestion.parentNode.childNodes
                const activeIndex = Array.from(suggestions).indexOf(activeSuggestion);
                const direction = isArrowDown ? 1 : -1;
                const nextSuggestion = suggestions[activeIndex + direction]
                if (nextSuggestion) {
                    nextSuggestion.classList.add('active')
                    activeSuggestion.classList.remove('active')
                }
            }
        } 
    });
};

// Displaying Info on Page Related Function
cryptoApp.displayCrypto = function (dataFromAPI) {
    const form = document.querySelector('form');
    const cryptoInfo = document.querySelector('#crypto-info');
    const inputArea = document.querySelector('input');
    const suggestions = document.querySelector('.suggestions');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const activeSuggestion = suggestions.querySelector("li.active");
        const userInput = activeSuggestion ? activeSuggestion.innerText : inputArea.value;

        const individualCrypto = dataFromAPI.find( (crypto) => userInput.toLowerCase() == crypto.name.toLowerCase());
        cryptoInfo.classList.remove('animate');
        setTimeout(() => {
            cryptoInfo.classList.add('animate');
        }, 0);
        if (individualCrypto) {
            console.log(individualCrypto);
            cryptoInfo.innerHTML = `
                <figure class="icon">
                <img src="${individualCrypto.image}" alt="Symbol for ${individualCrypto.name}">
                </figure>
                <h2 class="name">${individualCrypto.name.toUpperCase()} </h2>
                <h2 class="price">Price: $${individualCrypto.current_price.toFixed(2)}</h2>
                <h3 class="percent">24 Hour Difference: ${individualCrypto.price_change_percentage_24h.toFixed(2)}%</h3>
                <h3 class="low24"> 24 Hour Low: $${individualCrypto.low_24h.toFixed(2)}</h3>
                <h3 class="high24">24 Hour High: $${individualCrypto.high_24h.toFixed(2)}</h3>
                <h3 class="change24">24 Hour Change: $${individualCrypto.price_change_24h.toFixed(2)}</h3>
                <h3 class="change1">1 Hour Change: $${individualCrypto.price_change_percentage_1h_in_currency.toFixed(2)}</h3>
                `;   

                // Requires separate functions. 24 hour and 1 hour change won't both be positive or negative.
                const dailyPriceChange = document.querySelector('.change24');
                if (dailyPriceChange.innerHTML.includes("$-")){
                    dailyPriceChange.style.color="red";
                } else {
                    dailyPriceChange.style.color="green";
                };
                

                const hourPriceChange = document.querySelector('.change1');
                if (hourPriceChange.innerHTML.includes("$-")){
                    hourPriceChange.style.color="red";
                } else {
                    hourPriceChange.style.color="green";
                };

                const percentChange = document.querySelector('.percent');
                if (percentChange.innerHTML.includes("-")){
                    percentChange.style.color="red";
                } else {
                    percentChange.style.color="green";
                };


                suggestions.innerHTML = "";
                inputArea.value = '';
        } else {
            cryptoInfo.innerHTML = `<p>No results found for "${userInput}", please try again.</p>`;
            inputArea.value = '';
            suggestions.innerHTML = "";
        };
    });
};

// Placeholder will be changed on load, not when resizing. That's the intended functionality.
cryptoApp.placeholderChanger = () => {
    const placeholderChange = document.querySelector('.search-input');
    if (screen.width < 960 && screen.width > 400) {
        placeholderChange.placeholder = "Search Crypto";
    } else if (screen.width <= 400) {
        placeholderChange.placeholder = "Search";
    }
    else {
        placeholderChange.placeholder = "Which Crypto Do You Want To Know About?";
    };
};

// Setup Init Function
cryptoApp.init = () => {
    cryptoApp.getCrypto();
    cryptoApp.placeholderChanger();
}
// Call Init
cryptoApp.init();