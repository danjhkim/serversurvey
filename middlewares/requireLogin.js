const requireLogin = (req, res, next) => {
	if (!req.user) {
		return res.status(401).send({ error: 'You must log in!' });
		//you can add more code here if u want something specific happen if you arent logged in.
		//Or error catching client side to pop up a modal.. up to you.
	}

	next();
};

module.exports = requireLogin;
