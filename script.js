const body = document.querySelector('body');
const header = document.querySelector('header');
const input = document.querySelector('input');
const select = document.querySelector('select');
const where = document.querySelector('.where');
const footer = document.querySelector('footer');
const inputBlock = document.querySelector('#input-block');
const backBtn = document.querySelector('.back-btn');
const oneFlag = document.querySelector('.one-flag');
const info = document.querySelector('.info');
var col;


const byRegion = document.querySelector('#byRegion');
const modeBtn = document.querySelector('#mode');
const searchBy = document.querySelector('#searchBy');
const output = document.querySelector('#output');
const spinner = document.querySelector('#spinner-block');
const detailedBlock = document.querySelector('#detailed-block');
var modeStatus;
var ls = localStorage;

var allCountries;
const result = [];
const html = [];

const getModeStatus = () => {
	if(ls.getItem('mode')) {
		modeStatus = ls.getItem('mode');
	} else {
		modeStatus = ls.setItem('mode', 'light');
	}
};

const setModeStatus = () => {
	if (modeStatus === 'dark') {
		body.classList.toggle('dm');
	}
};

modeBtn.addEventListener('click', () => {
	modeStatus = modeStatus === 'light' ? 'dark' : 'light';
	ls.setItem('mode', modeStatus);
	body.classList.toggle('dm');
});

const getCountriesInfo = async () => {
	allCountries = await fetch('https://restcountries.eu/rest/v2/all?fields=name;capital;region;population;nativeName;flag;callingCodes')
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
		let code = item.callingCodes.toString();
		const country = `<div class="col">
											<img class="flag" src="${item.flag}">
											<div class="outPrc">
												<div class="h2 linking" data-callingcode="${code}">${item.name}</div>
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


backBtn.addEventListener('click', () => {
	oneFlag.innerHTML = '';
	info.innerHTML = '';
	detailedBlock.style.display = 'none';
	inputBlock.style.display = 'block';
	output.style.display = 'grid';
	wrapperTag(allCountries);
	getCountInfo();
});

async function detaileInfoCountry(callcode) {

	inputBlock.style.display = 'none';
	output.innerHTML = '';
	output.style.display = 'none';
	detailedBlock.style.display = 'block';

	let c = await fetch('https://restcountries.eu/rest/v2/callingcode/' + callcode)
								.then((response) => {
									return response.json()
								});

	let country = c[0];
	let quantityLang = country.languages.length;
	let i = 1;
	let borderCount = '';

	country.languages.forEach((item) => {
		let count = ` <span>${item.name}</span>`;
		borderCount += i === quantityLang ? count + '.' : count + ', ';
		i++;
	});


	// var inMap = L.map('inmap').setView(country.latlng, 13);

	// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXNrZW1hcCIsImEiOiJja2xybml1bnMwNG8zMnBwdjdicHkzczB1In0.5iNi_ki9OrDPDqplF5HSQg', {
	// 						attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	// 						maxZoom: 18,
	// 						id: 'mapbox/streets-v9',
	// 						tileSize: 512,
	// 						zoomOffset: -1,
	// 						accessToken: 'your.mapbox.access.token'
	// 					}).addTo(inMap);

	oneFlag.innerHTML = `<img src="${country.flag}">`;
	info.innerHTML = `<div class="h2">
											${country.name}
										</div>
										<div class="info-row">
											<div class="left">
												<p><span>Native Name: </span>${country.nativeName}</p>
												<p><span>Population: </span>${country.population}</p>
												<p><span>Region: </span>${country.region}</p>
												<p><span>Sub region: </span>${country.subregion}</p>
												<p><span>Capital: </span>${country.capital}</p>
												</div>
												<div class="right">
													<p><span>Top level domain: </span>${ country.topLevelDomain}</p>
													<p><span>Currencies: </span>${country.currencies[0].name}</p>
													<p><span>Languages: </span>${borderCount}</p>
												</div>
											</div>`;
										};



function getCountInfo() {
	const linking = document.querySelectorAll('.linking');
	linking.forEach((item) => {
		item.addEventListener('click', (event) => {
			detaileInfoCountry(event.target.dataset.callingcode);
		})
	});
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
	getCountInfo();
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
	getCountInfo();
});

function loader() {
	spinner.style.display = 'none';
	output.style.display = 'grid';
};


getCountriesInfo();
getModeStatus();
setTimeout(() => {
	setModeStatus();
	loader();
	getCountInfo();
}, 2000);
