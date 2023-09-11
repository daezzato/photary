const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profile')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

//Profile Routes
router.get('/', ensureAuth, profileController.getProfile)
router.get('/albums/:id', profileController.getAlbum)
router.get('/albums/:id/:albumPhotoID', profileController.getAlbumPhoto)
router.post('/createAlbum', profileController.createAlbum)
router.post('/albums/:id/:albumPhotoID/note', profileController.createPhotoNote)
router.delete('/deleteAlbum/:id', profileController.deleteAlbum)
router.delete('/albums/deleteAlbumPhoto/:id/:albumPhotoID', profileController.deleteAlbumPhoto)
router.delete('/albums/:id/:albumPhotoID/note/:noteID/delete', profileController.deletePhotoNote)

module.exports = router
