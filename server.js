const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const logger = require('morgan')
const flash = require('express-flash')
const locationsRoutes = require('./routes/locations')
const mainRoutes = require('./routes/main')
const profileRoutes = require('./routes/profile')
const connectDB = require('./config/database')

//Use .env file in the config folder
require('dotenv').config({path: './config/.env'})

//Passport
require('./config/passport')(passport)

//Connect to database
connectDB()

//EJS for views
app.set('view engine', 'ejs')

//Static folder
app.use(express.static('public'))

//Body parsing json
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Logging
app.use(logger('dev'))

//Use forms for put / delete
app.use(methodOverride('_method'))

//Setup sessions = stored in MongoDB
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
		})
	)

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Use flash messages for success/errors
app.use(flash());


//Setup routes for which the server is listening
app.use('/locations', locationsRoutes)
app.use('/', mainRoutes)
app.use('/profile', profileRoutes)

//Server running
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})