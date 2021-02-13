const searchBy = document.querySelector('.searchBy');
const output = document.querySelector('.output');
const body = document.querySelector('body');
const byRegion = document.querySelector('#byRegion');

const result = [];
const allCountries = [];

function getCountriesInfo() {
	fetch('https://restcountries.eu/rest/v2/all').then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		} else {
			return response.json();
		}
	}).then(listCount => {
		listCount.forEach((item) => {
			allCountries.push(item);
		});
		tagWrapper(listCount);
	}).catch(e => {
		console.log(`There has been a problem with your fetch operation: ${e.message}`);
	})
}

byRegion.addEventListener('change', (event) => {
	let curRegion = event.target.value;
	let regCount = [];
	allCountries.forEach((item) => {
		if (curRegion === item.region) {
			regCount.push(item);
		}
	});
	tagWrapper(regCount);
});

function tagWrapper(list) {
	result.length = 0;
	list.forEach((item) => {
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
		result.push(country);
	});
	output.innerHTML = "";
	output.innerHTML = result.join('');
};

getCountriesInfo();
