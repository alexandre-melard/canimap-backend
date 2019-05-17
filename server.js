'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost/users', { useMongoClient: true });
mongoose.Promise = global.Promise;

const User = mongoose.model('User', 
			    { 
				'email': { type: String, unique: true },
				'firstName': String,
				'lastName': String,
				'street': String,
				'city': String,
				'cp': String,
				'club': String,
				'helpers': 
				[
				    {  key: String,
				       visible: Boolean
				    }
				],
				'mapBoxes': 
				[
				    {
					'key': String,
					'opacity': Number,
					'visible': Boolean
				    }
				]
			    });

const alex = {
            'email': 'alexandre@melard.fr',
            'firstName': 'Alexandre',
            'lastName': 'Melard',
            'street': '117 rue du danet',
            'city': 'La Verpilliere',
            'cp': '38290',
            'club': 'CCCL'
        };

User.update({email: alex.email}, alex, {upsert: true}, function (err) {
  if (err) {
    console.log("[INIT] " + err);
  } else {
    console.log('[INIT] user alex updated');
  }
});


const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://canimap.eu.auth0.com/.well-known/jwks.json"
    }),
    aud: 'https://canimap.eu.auth0.com/api/v2/',
    issuer: "https://canimap.eu.auth0.com/",
    algorithms: ['RS256']
});

app.post('/api/logs', authCheck, (req, res) => {
    var log = req.body;  
    console.log("[CLIENT LOG][" + log.email + "]: " + log.content);
    res.json(log);
});

app.post('/api/users', authCheck, (req, res) => {
    var lUser = req.body;  
    console.log("[POST] request with user: " + JSON.stringify(lUser));
    const user = new User(lUser);
    user.save(function (err) {
	if (err) {
	    console.log("[POST] " + err);
	} else {
	    console.log('[POST] user created: ' + lUser.email);
	}
    });    
    res.json(lUser);
});

app.put('/api/users/:id', authCheck, (req, res) => {
    const id = req.params.id;  
    console.log("[PUT] user with id: " + id);

    const user = req.body;  
    console.log("[PUT] user: " + JSON.stringify(user));

    User.update({email: user.email}, user, function (err) {
	if (err) {
	    console.log("[PUT] " + err);
	    res.status(500).send(err);
	} else {
	    console.log('[PUT] user: ' + user.email + ' updated');
	    res.json(user);
	}
    });
});

app.get('/api/users/:id', authCheck, (req, res) => {
    var id = req.params.id;  
    console.log("[GET] user with id: " + id);
    User.findOne({ email: id },( err, user ) => {
	if (err) {
	    const errMsg = '[GET] error while retrieving user: ' + id + 'with error: ' + err;
	    console.log(errMsg);
	    res.status(404).send(errMsg);
	}
	res.json(user);
    });
});

app.listen(3001);
console.log('Listening on localhost:3001');
