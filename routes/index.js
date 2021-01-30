var express = require('express');
var router = express.Router();

var journeyModel = require('../models/journey');
var userModel = require('../models/user')

// Data -----------------------------------------------------------------------------
var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2020-11-20","2020-11-21","2020-11-22","2020-11-23","2020-11-24"]



/* GET Login page. */
router.get('/', function(req, res, next) {

  if(req.session.user == undefined) {
    req.session.user = [];
  }

  res.render('login', {alertMessage:''});
});


/* GET Homepage page. */
router.get('/index', function(req, res, next) {

  if(req.session.user == undefined) {
    req.session.user = [];
  }

  res.render('index', {user:req.session.user });
});

/* GET Homepage page. */
router.get('/confirmReservation', async function(req, res, next) {


  //console.log('/confirmReservation : We have this user in session --> :', req.session.user)
  
  // We want to update our onGoingTicket for our user
  var user = await userModel.findById(req.session.user._id)
  
  //console.log(' /confirmReservation : we found the user --->',user);

  //console.log(' /confirmReservation : session --->',req.session.myTickets);

  for(i = 0; i<req.session.myTickets.length; i++){

    user.historyTickets.push({

      departure: req.session.myTickets[i].ticketDeparture,
      arrival: req.session.myTickets[i].ticketArrival,
      date: req.session.myTickets[i].ticketDate,
      departureTime: req.session.myTickets[i].ticketDepartureTime,
      price: req.session.myTickets[i].ticketPrice,

    })
  }

  await user.save()

  req.session.myTickets = []

  res.render('index', {user:req.session.user });
  
});

/* GET Last trips page. */
router.get('/myLastTrips', async function(req, res, next) {

  var historicTravel = [];

  var user = await userModel.findById(req.session.user._id)
  
  //console.log("On a bien le user suivant dans myLastTrips -->",user.historyTickets);
  res.render('myLastTrips', { title: 'Express',historicTravel:user.historyTickets });     
  
});



/* Post journeys */
router.post('/journeys', async function(req, res, next) {

  //console.log(' /journeys : result from the front --> : ',req.body)

  var departureCity = req.body.departureCity;
  var arrivalCity = req.body.arrivalCity; 
  var dateDeparture = req.body.journeyDate;
  
  var userId = req.body.userId

  var journey = await journeyModel.find( 
    { departure: departureCity,
      arrival:arrivalCity,
      date:dateDeparture
    }
  )

  req.session.journeyTab = []

  if(journey[0] == undefined){
              
    //console.log('/journeys : Oops, there is no tickets -->')
    res.render('noTrain', {journeyTab:req.session.journeyTab, userId });

  }else{

    // console.log(`Trajets au départ de ${journey[0].departure} : `, journey);

    for(var i = 0; i<journey.length; i++){

      req.session.journeyTab.push(journey[i])

    }

    //console.log(' /journeys : my journeyTab de mon back que je vais renvoyer au front -->', req.session.journeyTab)

    res.render('page1', {journeyTab:req.session.journeyTab, userId});
  }
  
});


router.post('/myTicket', async function(req, res, next) {

  //console.log('My ticket Choice --> : ', req.body)

  if(req.session.myTickets == undefined){
    req.session.myTickets = []
  }

  // We push in our myTicketsSession to create the basket
  req.session.myTickets.push(req.body)

  // We need to format into Number the price to be able to have a total basket
  for(var i = 0; i<req.session.myTickets.length; i++){
    req.session.myTickets[i].ticketPrice =  Number(req.session.myTickets[i].ticketPrice)
  }

  // console.log('My basket ---->', req.session.myTickets)
  res.redirect('/myTicket')
  
});

/* Post journeys */
router.get('/myTicket', async function(req, res, next) {

  res.render('myTickets', {myTickets:req.session.myTickets});
  
});







// --------------------------JUST ONCE-------------------------------------

// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newJourney = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       await newJourney.save();
    }

  }
  res.render('index', { title: 'Express' });
});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          //console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});



module.exports = router;
