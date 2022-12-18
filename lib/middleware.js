const SessionModel = require('../models/session-model');

//this is checking if the sessionId exists, if it does, (req,res) will execute in the app.get.
//if it doesn't, we can render the log in page and an error to say log in before accessing the account page
exports.validateSession = async (req, res, next) => {
    if (await SessionModel.checkSession(req.sessionID)) {
        next();
        return;
    }

    res.render('login', {error: 'PLEASE LOG IN TO ACCESS THIS PAGE'})
};