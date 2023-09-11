// const form = document.querySelector('.location-form')
// const locationInfo = document.querySelector('.location-list')
  
//   form.addEventListener('submit', async (event) => {
//     event.preventDefault()
    
//     const formData = new FormData(event.target)
//     const searchLocation = formData.get('location')
    
//     try {
//       const response = await fetch(`https://restcountries.com/v3.1/name/${searchLocation}?fullText=true`)
//       const data = await response.json()
// 			console.log(data[0])
      
//       const country = data[0]
//       const flagImage = country.flags.png
//       const locationName = country.name.common
//       const shield = country.coatOfArms.png
//       const capital = country.capital
      
//       locationInfo.innerHTML = `
//           <img src="${flagImage}" alt="">
//           <h1>${locationName}</h1>
//           <img src="${shield}" alt="" class='shield'>
//           <h1>Capital: ${capital}</h1>
// 					<h1><a class='input-route>Check ${locationName} out!</a></h1>
//       `
//     } catch (error) {
//       console.error(error)
//     }
//   })