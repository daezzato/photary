const User = require('../models/User')
const Album = require('../models/Album')
const Photo = require('../models/Photo')

module.exports = {

  //Render the user's profile page with their created albums
  getProfile: async (req, res) => {
    try {
      const albums = await Album.find({ user: req.user.id})   //Search through the Album model to find the user id
      res.render('profile.ejs', {albums: albums, user: req.user})
    } catch (err) {
      console.log(err);
    }
  },

  //Creates new album
  createAlbum: async (req, res) => {
    const album = req.body.album
    try {
      await Album.create({   //Creates new album in the database through the model
        title: album,
        user: req.user.id,
      })
      console.log('Album created')
      req.flash('success', 'Album created!')		
      res.redirect('/profile')
    } catch (err) {
      console.log(err)
    }
  },

  //Deletes existing albums
  deleteAlbum: async (req, res) => {
    try {
      await Album.remove({ _id: req.params.id})    //Deletes album in the database by searching through the document id provided by the database
      console.log('Deleted Album')
      req.flash('success', 'Album deleted!')
      res.redirect('/profile')
    } catch (err) {
        res.redirect('/profile')
    }
  }, 
  
  //Renders specific album with its saved photos
  getAlbum: async (req, res) => {
    try {
      const album = await Album.findById(req.params.id)   //Finds the album by its id
      const albumPhotos = album.photos   //Will grab all photos saved in the album
      res.render('album.ejs', {album: album, albumPhotos: albumPhotos, user: req.user})
    } catch (err) {
        console.log(err)
    }
  },


  //Renders a specific photo within an album
  getAlbumPhoto: async (req, res) => {
    try {
      const album = await Album.findById(req.params.id)    //Finds the album by its id
      const albumPhoto = album.photos     //Will grab all photos saved in the album
      const albumPhotoID = albumPhoto.find(photo => photo._id.toString() === req.params.albumPhotoID.toString())   //Turn the album photo id to a string to pass in the URL
      const notes = albumPhotoID.notes
      res.render('albumPhoto.ejs', {album: album, albumPhoto: albumPhoto, albumPhotoID: albumPhotoID, notes: notes, user: req.user})
    } catch (err) {
        console.log(err)
    }
  },

  //Deletes a specific photo from an album
  deleteAlbumPhoto: async (req, res) => {
    try {
      const albumID = req.params.id    //Grabs the album id
      const albumPhotoID = req.params.albumPhotoID   //Grabs the photo id
      await Album.updateOne({_id: albumID},   //Updates the album in the database by targeting the database id for the album
        {$pull: 
          {photos: {_id: albumPhotoID}}   //In the photos property of the Album model, we target the specific photo id given by the database
        })
        console.log('Photo deleted')
      res.redirect(`/profile/albums/${albumID}`)
    } catch (err) {
        console.log(err)
    }
  },


  //Creates a note for a specific photo within an album
  createPhotoNote: async (req, res) => {
    try {
      const albumID = req.params.id   //Grabs the album id
      const albumPhotoID = req.params.albumPhotoID    //Grabs the photo id
      await Album.updateOne(
        {_id: albumID, 'photos._id': albumPhotoID},      //Updates the album in the database by targeting the database id for the album. Targets the specific photo's id within the album.
        {$push: {
            'photos.$.notes': {   //Uses the $push operator to add a new note to the photo's notes array
              text: req.body.note,   //Gets the note text from the request body
            completed: false   //Sets the note's completed status to false
					}
				}
			})
      req.flash('success', 'Note created!')		
      res.redirect(`/profile/albums/${albumID}/${albumPhotoID}`)
    } catch (err) {
        console.log(err)
    }
  },


  //Creates a note for a specific photo within an album
  deletePhotoNote: async(req, res) => {
    try {
      const albumID = req.params.id        //Grabs the album id
      const albumPhotoID = req.params.albumPhotoID           //Grabs the photo id
      const noteID = req.params.noteID    //Grabs the note id
      await Album.updateOne({_id: albumID, 'photos._id': albumPhotoID},          //Updates the album in the database by targeting the database id for the album. Targets the specific photo's id within the album.
        {$pull: 
          {'photos.$.notes': {_id: noteID}}   //Uses the $pull operator to remove a note form the photo's notes array
        })
        console.log('Note deleted')
        req.flash('success', 'Note deleted!')		
        res.redirect(`/profile/albums/${albumID}/${albumPhotoID}`)
    } catch (err) {
        console.log(err)
    }
  }

}
