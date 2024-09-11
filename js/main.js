const btn = document.querySelector('button')
const input = document.querySelector('input')
const list = document.querySelector('.results')
const schoolInfo = document.querySelector('.school-info')


btn.addEventListener('click', getSchools)

async function getSchools() {
    list.innerHTML = ''

    const value = input.value

    const res = await fetch(`https://api.data.gov/ed/collegescorecard/v1/schools?api_key=fdBYetUZF2CVd84OoqrvdYSCZar2Zdxxb8HkZyAy&school.name=${value}`)
    const data = await res.json()
    const schoolList = data.results
    schoolList.forEach((school) => {
        // console.log(school.latest.school.name)
        let schoolName = school.latest.school.name
        const liEl = document.createElement('li')
        list.appendChild(liEl)
        liEl.innerHTML = `${schoolName}`
        // liEl.addEventListener('click', getSchoolInfo)
    })
    console.log(schoolList)
}

// function getSchoolInfo() {
// }