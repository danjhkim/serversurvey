const requireCredits = (req, res, next) => {
	//requesting the user model
	if (req.user.credits < 1) {
		return res.status(403).send({ error: 'Not enough credits!' });
		//you can add more code here if u want something specific happen if you arent logged in.
		//Or error catching client side to pop up a modal.. up to you.
	}

	next();
};

module.exports = requireCredits;
