const express = require('express')
const router = express.Router()
const locationsController = require('../controllers/locations')

//Location Routes
router.get('/', locationsController.locationsIndex)
router.post('/', locationsController.displayLocation)
router.get('/country/:locationName', locationsController.clickLocation)
router.get('/country/:locationName/:id', locationsController.clickPhoto)
router.post('/country/:locationName/:id/savePhoto', locationsController.savePhoto)

module.exports = router


