(function(){
    'use strict';

    const typeahead = typeahead || {};
    const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
    const cities = [];
    const searchInput = document.querySelector('.js-search');
    const suggestions = document.querySelector('.js-suggestions');

    fetch(endpoint)
        .then(blob => blob.json())
        .then(data => cities.push(...data));


    typeahead.findMatches = (wordToMatch, places) => {
        return places.filter(place => {
            const regex = new RegExp(wordToMatch, 'gi');

            return place.city.match(regex) || place.state.match(regex);
        });
    };

    typeahead.displayMatches = (e) => {
        const value = e.target.value;
        const matchArray = typeahead.findMatches(value, cities);

        const html = matchArray.map(place => {
            const regex = new RegExp(value, 'gi');
            const cityName = place.city.replace(regex, `<span class="h-hl">${value}</span>`);
            const stateName = place.state.replace(regex, `<span class="h-hl">${value}</span>`);

            if (value.length >= 2) {
                return `
                    <li>
                        <span class="name">${cityName}, ${stateName}</span>
                        <span class="population">${place.population}</span>
                    </li>
                `;
            }
        }).join('');

        suggestions.innerHTML = html;
    };

    typeahead.init = () => {
        searchInput.addEventListener('change', typeahead.displayMatches);
        searchInput.addEventListener('keyup', typeahead.displayMatches);
    };

    typeahead.init();
}());
