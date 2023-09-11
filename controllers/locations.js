const User = require('../models/User')
const Photo = require('../models/Photo')
const Album = require('../models/Album')


module.exports = {
	  // Clear the locationData from the session using the Express session middleware by setting the locationData property to null and render the locations.ejs file. After every click on the locations tab, the information from the previous search won't be saved and displayed
	locationsIndex: (req, res) => {
		req.session.locationData = null
		res.render('locations.ejs')
		
	},

  // Fetch and display location data and other information based on user input from RestCountries API.
	displayLocation: async (req, res) => {
		try {
			const searchLocation = req.body.location
			const response = await fetch(`https://restcountries.com/v3.1/name/${searchLocation}?fullText=true`)
			const data = await response.json()

			if (response.status === 200) {
				console.log(data[0])

				//Save the location data to the session
				req.session.locationData = {      
					flag: data[0].flags.png,
					location: data[0].name.common,
					coa: data[0].coatOfArms.png,
					cap: data[0].capital,
					cont: data[0].continents,
					time: data[0].timezones,
					lang: Object.values(data[0].languages).toString().split(',').join(', '),
					curr: Object.keys(data[0].currencies),
					currName: data[0].currencies[Object.keys(data[0].currencies)].name.toUpperCase(),
					currSym: data[0].currencies[Object.keys(data[0].currencies)].symbol

				}

				// Render the locations-results.ejs file to display the data.
				res.render('locations-results.ejs', {
					flagImage: req.session.locationData.flag,
					locationName: req.session.locationData.location,
					shield: req.session.locationData.coa,
					capital: req.session.locationData.cap,
					continent: req.session.locationData.cont,
					timezone: req.session.locationData.time,
					language: req.session.locationData.lang,
					currency: req.session.locationData.curr,
					currencyName: req.session.locationData.currName,
					currencySym: req.session.locationData.currSym

				})
			}	else {
					res.render('locations.ejs')
			}
			} catch (error) {
				console.error(error)
				res.render('locations.ejs')
			}
	},

	//Fetches photos from the Pexels API using the search query from the fetch from the RestCountries API after the user clicks the button on the Locations page
	clickLocation: async (req, res) => {
		try {
			const searchLocation = req.params.locationName  //This is the value that is provided for the URL in our routes and also a value to use in our API fetch 
			const page = req.query.page || 1
			
			//Fetch data from RestCountries API
			const response = await fetch(`https://restcountries.com/v3.1/name/${searchLocation}?fullText=true`)
			const data = await response.json()

			//Fetch data from Pexels API
			const responsePhoto = await fetch(`https://api.pexels.com/v1/search?query=${searchLocation}&per_page=40&page=${page}`, {
					headers: {
						Authorization: process.env.PEXEL_KEY,
					}
		})
			const dataPhoto = await responsePhoto.json()

			if (response.status === 200) {
				console.log(data[0])
				console.log(dataPhoto.photos)

				//Save location and photo data to the session
				req.session.locationData = {
					flag: data[0].flags.png,
					location: data[0].name.common,
					photos: dataPhoto.photos,
					next: dataPhoto.next_page,
					previous: dataPhoto.prev_page,
					currentPage: parseInt(page)
				}


				// Clear old photo data from the session
				req.session.photoData = null;

				//Renders the country.ejs file to display photos from Pexels and some data from RestCoutntries 
				res.render('country.ejs', {
					flagImage: req.session.locationData.flag,
					locationName: req.session.locationData.location,
					locationPhotos: req.session.locationData.photos,
					nextPage: req.session.locationData.next,
					prevPage: req.session.locationData.previous,
					currentPage: req.session.locationData.currentPage
				})
			}	else {
					res.render('locations.ejs')
			}
			
			
			} catch (error) {
				console.error(error)
				res.render('locations.ejs')
			}
	},
	

	//Directs user to a route where the user is viewing the photo after they clicked on the photo
	clickPhoto: async (req, res) => {
		try {
			const searchLocation = req.params.locationName
			let page = req.query.page || 1
			const photoID = req.params.id    //We will extract the id of the photo (idPhoto) and set it to this variable which will act as the value that is provided for the URL in our routes
			const userAlbums = await Album.find({user: req.user._id})    //Accesses the Album model to display a drop down list of saved albums
			
			const response = await fetch(`https://restcountries.com/v3.1/name/${searchLocation}?fullText=true`)
			const data = await response.json()

			let responsePhoto = await fetch(`https://api.pexels.com/v1/search?query=${searchLocation}&per_page=40&page=${page}`, {
					headers: {
						Authorization: process.env.PEXEL_KEY,
					}
		})

			const url = responsePhoto.url;
			console.log(url);
			let dataPhoto = await responsePhoto.json()

			if (response.status === 200) {
				
				//Grabs the photo id and turns into a number from a string to get other properties that are associated with the specific photo
				let idPhoto = dataPhoto.photos.find((num) => num.id === Number(photoID))
			
				console.log(idPhoto)
				console.log(page)

				//Saves the photo data into a session
				req.session.locationData = {
					location: data[0].name.common,
					photoId: idPhoto.id,
					photoWidth: idPhoto.width,
					photoHeight: idPhoto.height,
					photoURL: idPhoto.url,
					photoSRC: idPhoto.src.original,
					photoSRCMed: idPhoto.src.medium,
					photoSRCLge: idPhoto.src.large,
					photoSRCPort: idPhoto.src.portrait,
					photoSRCLand: idPhoto.src.landscape,
					photographer: idPhoto.photographer,
					footnote: idPhoto.alt,
					next: dataPhoto.next_page,
					previous: dataPhoto.prev_page,
					currentPage: parseInt(page)
			}
				console.log(req.session.locationData)

				//Render photo.ejs to display the photo data and albums
				res.render('photo.ejs', {
					albums: userAlbums,
					locationName: req.session.locationData.location,
					id: req.session.locationData.photoId,
					width: req.session.locationData.photoWidth,
					height: req.session.locationData.photoHeight,
					url: req.session.locationData.photoURL,
					src: req.session.locationData.photoSRC,
					srcMed: req.session.locationData.photoSRCMed,
					srcLge: req.session.locationData.photoSRCLge,
					srcPort: req.session.locationData.photoSRCPort,
					srcLand: req.session.locationData.photoSRCLand,
					photographer: req.session.locationData.photographer,
					footnote: req.session.locationData.footnote,
					nextPage: req.session.locationData.next,
					prevPage: req.session.locationData.previous,
					currentPage: req.session.locationData.currentPage
				})

				
				}	else {
					res.render('locations.ejs')
		}
			} catch (error) {
				console.error(error)
				res.render('locations.ejs')
			}
	},
	
	//Save a selected photo to one of the user's created albums
	savePhoto: async (req, res) => {
		
		//Extract all photo and album information
		try {
			const photoId = req.session.locationData.photoId
			const locationName = req.params.locationName
			const width = req.session.locationData.photoWidth
			const height = req.session.locationData.photoHeight
			const src = req.session.locationData.photoSRC
			const srcMed = req.session.locationData.photoSRCMed
			const srcLge = req.session.locationData.photoSRCLge
			const srcPort = req.session.locationData.photoSRCPort
			const srcLand = req.session.locationData.photoSRCLand
			const url = req.session.locationData.photoURL
			const photographer = req.session.locationData.photographer
			const footnote = req.session.locationData.footnote
			const userAlbums = await Album.find({user: req.user._id})
			const selectedAlbum = req.body.albumSelect


			//Create a new Photo document through our model to store in our database
			const photo = await Photo.create({
				id: photoId,
				location: locationName,
				width: width,
				height: height,
				url: url,
				src: src,
				srcMed: srcMed,
				srcLge: srcLge,
				srcPort: srcPort,
				srcLand: srcLand,
				photographer: photographer,
				footnote: footnote
			})

			//Updates the specific album by adding a new photo with all preferred properties
			await Album.findByIdAndUpdate(selectedAlbum, {
				$push: {
					photos: {
						id: photo.id,
						location: photo.location,
						width: photo.width,
						height: photo.height,
						url: photo.url,
						src: photo.src,
						srcMed: photo.srcMed,
						srcLge: photo.srcLge,
						srcPort: photo.srcPort,
						srcLand: photo.srcLand,
						photographer: photo.photographer,
						footnote: photo.footnote
					}
				}
			})
			
			
			console.log(userAlbums)
			console.log('Photo has been saved')
			req.flash('success', 'Photo saved to album!')		
			res.redirect('back')
		} catch (error) {
				console.error(error)
				res.status(500).send('Internal server error')
		}
	}
}
	



