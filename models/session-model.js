const { Schema, model } = require('mongoose');

const Session = new Schema({
    _id: {type: String},
    session: String
});

Session.statics.checkSession = async function(sessionID) {
    let documents = await this.find({_id: sessionID})
    console.log(documents);
        if (documents[0]) {
            return true;
        }
            return false;
};

module.exports = model('sessions', Session);