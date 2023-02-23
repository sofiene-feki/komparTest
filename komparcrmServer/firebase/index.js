var admin = require('firebase-admin');

var serviceAccount = require('../config/komparcrm-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
