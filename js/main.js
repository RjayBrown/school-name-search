const btn = document.querySelector('button')
const input = document.querySelector('input')
const list = document.querySelector('.results')


btn.addEventListener('click', getSchools)

async function getSchools() {
    list.innerHTML = ''
    const value = input.value

    const res = await fetch(`https://api.data.gov/ed/collegescorecard/v1/schools?api_key=fdBYetUZF2CVd84OoqrvdYSCZar2Zdxxb8HkZyAy&school.name=${value}&fields=id,school.name,latest.student.size`)
    const data = await res.json()
    const schoolList = data.results
    schoolList.forEach((school) => {
        // console.log(school)
        const liEl = document.createElement('li')
        list.appendChild(liEl)
        liEl.innerHTML = `<a href="#">${Object.values(school)[1]}</a>`
    })
    console.log(schoolList)
}