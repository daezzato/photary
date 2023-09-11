module.exports = {

	//Ensures user is authenticated
	ensureAuth: function (req, res, next) {
		//If user is authenticated, continue to the next middleware or route handler
		if (req.isAuthenticated()) {
			return next()
		
		//If user is not authenticated, redirect back to the home page
		} else {
				res.redirect('/')
		}
	},

	//Ensures user is not authenticated
	ensureGuest: function (req, res, next) {

		//If user is not authenticated, go to the next middleware or route handler
		if (!req.isAuthenticated) {
			return next()

		//If user is authenticated, redirect them to the dashboard or another authenticated page
		} else {
				res.redirect('/dashboard')
		}
	}

}