const mongoose = require('mongoose');

// useNewUrlParser ;)
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true
 };

 var identifiants = {
   mdp: 'MOT DE PASSE',
   identifiant: 'IDENTIFIANT',
   nomCluster: 'CLUSTER'
 }

 

// --------------------- BDD -----------------------------------------------------
mongoose.connect('mongodb+srv://chris:bK19UGCSO0z0XaAI@cluster0.4z8nd.mongodb.net/ticettac?retryWrites=true&w=majority',
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Ticketac connection : Success ***');
    }
   }
);