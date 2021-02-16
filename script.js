const searchBy = document.querySelector('.searchBy');
const output = document.querySelector('.output');
const body = document.querySelector('body');
const byRegion = document.querySelector('#byRegion');

let allCountries;
const result = [];
const html = [];

const getCountriesInfo = async () => {
	allCountries = await fetch('https://restcountries.eu/rest/v2/all?fields=name;nativeName;flag;papulation;region;capital')
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		} else {
			return response.json();
		}
	}).catch(e => {
		console.log(`There has been a problem with your fetch operation: ${e.message}`);
	});
	wrapperTag(allCountries);
};

function wrapperTag(contentToWrap) {
	output.innerHTML = "";
	html.length = 0;
	contentToWrap.forEach((item) => {
		const country = `<div class="col">
											<img class="flag" src="${item.flag}">
											<div class="outPrc">
												<div class="h2">${item.name}</div>
												<div class="innerPrc">
													<p><span>Population:</span> ${item.population}</p>
													<p><span>Region:</span> ${item.region}</p>
													<p><span>Capital:</span> ${item.capital}</p>
												</div>
											</div>
										</div>`;
		html.push(country);
	});
	output.innerHTML = html.join('');
};

byRegion.addEventListener('change', (event) => {
	result.length = 0;
	let curRegion = event.target.value;
	allCountries.forEach((item) => {
		if (curRegion === item.region) {
			result.push(item);
		}
	});
	wrapperTag(result);
});

searchBy.addEventListener('input', (e) => {
	result.length = 0;
	output.innerHTML = '';
	let i = e.target.value.toLowerCase();
	allCountries.filter(country => {
		if(country.name.toLowerCase().includes(i)) {
			result.push(country);
		} else {
			console.log('No matches');
		};
	});
	wrapperTag(result);
});



getCountriesInfo();

// https://codepen.io/FlorinPop17/pen/qzNxGa/?editors=0010
// https://www.florin-pop.com/blog/2019/06/vanilla-javascript-instant-search/
