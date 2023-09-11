
const mongoose = require('mongoose')

const PhotoSchema = new mongoose.Schema({
	id: {
		type:String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	width: {
		type: Number,
		required: true
	},
	height: {
		type: Number,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	src: {
		type: String,
		required: true
	},
	srcMed: {
		type: String,
		required: true
	},
	srcLge: {
		type: String,
		required: true
	},
	srcPort: {
		type: String,
		required: true
	},
	srcLand: {
		type: String,
		required: true
	},
	photographer: {
		type: String,
		required: true
	},
	footnote: {
		type: String,
		required: true
	},
	notes: [{
		text: {type: String, required: true},
		completed: {type: Boolean, default: false}
	}]

})

module.exports = mongoose.model('Photo', PhotoSchema)