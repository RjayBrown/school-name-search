/*
DOM ELEMENTS
------------
*/

/* PAGES */
const homePage = document.querySelector('#home-page')
const moreResultsPage = document.querySelector('#results-page')

/* BUTTONS & LINKS */
const homeSearchBtn = document.querySelector('.top-search-btn')
const searchBtn = document.querySelector('.search-btn')
const resetBtn = document.querySelector('.clear')
const moreBtn = document.querySelector('.more')
const moreResultsLink = document.querySelector('.results-link')

/* TEXT */
const searchPrompt = document.querySelector('.prompt')
const top20ListTitle = document.querySelector('.top-20')

/* SEARCH RESULTS */
const homePageResults = document.querySelector('.top-three-container')
const list = document.querySelector('.results')
const schoolInfo = document.querySelector('.school-info')

/* BACKGROUND IMAGES */
const img = document.querySelector('.img')

/* USER INPUT */
const input = document.querySelector('input')


/*
EVENT LISTENERS
---------------
*/

if (homeSearchBtn) {
	homeSearchBtn.addEventListener('click', getFirstMatch)
}

if (searchBtn) {
	searchBtn.addEventListener('click', getSchools)
}

resetBtn.addEventListener('click', clearResults)


/*
FETCH BROWSER API SUMMARY
-------------------------

FETCH REVIEW
------------

Fetch is a method of the browser's 'window' object, and initiates the process of sending HTTP requests to a server (API). A url is passed into the method as an argument, and used as the interface to control where the request goes and what data is returned as a response.


URLS & SEARCH PARAMATERS
------------------------

We can include hard-coded search parameters in the url to guarantee the same data is returned for each request, or dynamically insert a value into the url by passing variables into a template literal, making the data returned dependent on that value.

The API hosted on the server sends a response object, and we store it in the 'res' variable (see examples below).

  Hard-Coded URL Example
  ----------------------

  This will always return list of schools that have 'Alabama' in the name

	const res = fetch('https://api.data.gov/ed/collegescorecard/v1/schools?api_key=fdBYetUZF2CVd84OoqrvdYSCZar2Zdxxb8HkZyAy&school.name=Alabama')


  Dynamic URL Example
  -------------------

  This will return a list of schools that include any name the user provides in the input field

	const value = document.querySelector('input').value
	const res = fetch(`https://api.data.gov/ed/collegescorecard/v1/schools?api_key=fdBYetUZF2CVd84OoqrvdYSCZar2Zdxxb8HkZyAy&school.name=${value}`)


USING FETCH
-----------

Next, we format the returned data using the .then() method, which accepts a response object (see res above) as an argument. This response object contains data and several methods we can use to format the data.

For this example, we will be using JavaScript Object Notation or JSON, a widely used method for handling data in the browser.

This line of code formats the data returned from the examples above into JSON

.then(res => res.json())


HANDLING DATA
--------------

JSON format consists of key value pairs, and can be accessed using dot notation or bracket notation (just like with objects!). The data held in each key can be in any data structure, typically in arrays of objects (see example below). The data can then be used in our web app.

const res = {
	"schools": [
		0: {"school": "Alabama A & M University"},
		1: {"school": "Alabama State University"},
		2: {"school": {
			"name": "Central Alabama Community College",
			"state": "Alabama",
			"two_year": true,
			"four_year": true
		}}
	]
}

In this example, we can get the name of the last school in the search results (Central Alabama Community College) using one line of code. Try to follow the path below to access the name in the 'res' example above.

const schoolName = schools[2].school.name

This is a basic example, but it doesn't matter how large the JSON data is or it's shape (how the data is arranged), if you follow the keys and values, you can access any data you find!

SEARCH & APPLY
  - JavaScript Object Notation (JSON)
*/


function getSchools(numOfSchools) {

	const value = input.value
	const url = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=fdBYetUZF2CVd84OoqrvdYSCZar2Zdxxb8HkZyAy&school.name=${value}`
	list.innerHTML = ''

	if (!value) {
		alert('Input required')
	} else if (value.length < 3) {
		alert('Input must be at least 3 characters long')
	} else {
		numOfSchools = typeof numOfSchools == 'object' ? 20 : numOfSchools
		console.log(numOfSchools)
		const res = fetch(url)
			.then(res => res.json())
			.then(data => {
				if (homePage) {
					hideElement(moreResultsLink)
					showElement(homePageResults)
				}
				if (moreResultsPage) {
					hideElement(searchPrompt)
					showElement(top20ListTitle)
				}
				if (img) {
					img.classList.add('expanded')
				}
				const schoolList = data.results
				schoolList.forEach((school, i) => {
					if (i < numOfSchools) {
						let schoolName = school.latest.school.name
						let schoolAddress = school.latest.school.address ? school.latest.school.address : 'N/A'
						let schoolCityState = school.latest.school.city ? `${school.latest.school.city}, ${school.latest.school.state}` : 'N/A'
						let schoolZip = school.latest.school.zip ? school.latest.school.zip.split('-')[0] : 'N/A'
						let schoolTuitionIn = school.latest.cost.tuition.in_state > 0 ? `$${school.latest.cost.tuition.in_state.toLocaleString()}` : 'N/A'
						let schoolTuitionOut = school.latest.cost.tuition.out_of_state > 0 ? `$${school.latest.cost.tuition.out_of_state.toLocaleString()}` : 'N/A'
						let schoolWebsite = school.latest.school.school_url ? school.latest.school.school_url : 'N/A'
						const liEl = document.createElement('li')
						list.appendChild(liEl)
						liEl.innerHTML = `
						<h3>${schoolName}</h3>
						<span class="arrow down"><i class="bi bi-caret-down-fill"></i></span>
						`
						liEl.classList.add('closed')
						liEl.addEventListener('click', toggleSchoolInfo)
						function toggleSchoolInfo() {
							if (liEl.classList.contains('closed')) {
								liEl.classList.remove('closed')
								liEl.classList.add('open')
								liEl.innerHTML =
									`
							<h3>${schoolName}</h3>
							<div class="school-card">
								<div class="data">
									<h4>Address</h4>
									<span>${schoolAddress}</span>
								</div>
								<div class="data">
									<h4>City, State ZIP</h4>
									<div>
										<span>${schoolCityState}</span>
										<span>${schoolZip}</span>
									</div>
								</div>
								<div class="data in-state">
									<h4>Tuition (in-state)</h4>
									<span>${schoolTuitionIn}</span>
								</div>
								<div class="data out-of-state">
									<h4>Tuition (out-of-state)</h4>
									<span>${schoolTuitionOut}</span>
								</div>
								<div class="data website">
									<h4>Website</h4>
									<a class="web-link" href="https://${schoolWebsite}" target="_blank">Go to School Website</a>
								</div>
							</div>
							<span class="arrow down"><i class="bi bi-caret-up-fill"></i></span>
							`
							} else if (liEl.classList.contains('open')) {
								liEl.classList.remove('open')
								liEl.classList.add('closed')
								liEl.innerHTML =
									`
									<h3>${schoolName}</h3>
									<span class="arrow down"><i class="bi bi-caret-down-fill"></i></span>
								`
							}
						}
					}
				})
				console.log(data)
			})
	}
}

function getFirstMatch() {
	getSchools(3)
}

/*
ES5 VS ES6+ FUNCTION DECLARATIONS

When using functions, The chosen syntax determines where the function can be called. ES5 and ES6 have one key difference in behavior to keep in mind.

ES5: Using the 'function' keyword
  - Can be called before the function is created (declared) in the same file

ES6: Arrow Functions
  - Follow the same rules as variables. Function must be declared first before it can be called

SEARCH & APPLY
ES5 & ES6+ Function Syntax
*/

/* Create your functions below */

function test() {
	console.log('It works!')
}

function hideElement(element) {
	element.classList.add('hidden')
}

function showElement(element) {
	element.classList.remove('hidden')
}

function clearResults() {
	if (homePage) {
		hideElement(homePageResults)
		showElement(moreResultsLink)
	}
	if (moreResultsPage) {
		hideElement(top20ListTitle)
		showElement(searchPrompt)
	}
	if (img) {
		img.classList.remove('expanded')
	}
	list.innerHTML = ''
}