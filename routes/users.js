var { url, mongodbClint, bcrypt, nodemailer } = require('../config');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { response } = require('express');
const { route } = require('.');
const auth = require('../auth');

const authenticate = require('../auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ "message": 'hello' })
});



router.post("/register", async (req, res) => {
  try {
    // console.log(req.body);
    let client = await mongodbClint.connect(url);
    let db = client.db('Zomato');
    let email = await db.collection('users', { useUnifiedTopology: true }).findOne({ 'Email': req.body.Email }).catch(console.error());
    if (email === null) {
      let salt = await bcrypt.genSalt(10);
      console.log(salt);
      let hash = await bcrypt.hash(req.body.PassWord, salt);
      req.body.Password = hash;
      console.log(salt);
      console.log(email);
      let user = await db.collection('users', { useUnifiedTopology: true }).insertOne({
        "Email": req.body.Email,
        'FullName': req.body.FullName,
        'Password': hash
      }
      );
      client.close();
      console.log(user);
    } else {
      client.close();
      res.json({
        "message": "user alredy present"
      });

    }

    res.json({
      "message": "user created"
    })
  } catch (error) {
    res.json({
      "message": error
    })
  }

});


router.get('/login', async (req, res) => {
  try {

    let client = await mongodbClint.connect(url);
    let db = client.db('Zomato');
    let user = await db.collection('users', { useUnifiedTopology: true }).findOne({ 'Email': req.body.Email }).catch(console.error());
    if (user) {
      var result = await bcrypt.compare(req.body.PassWord, user.Password);
      if (result) {
        let token = jwt.sign({ Email: user.Email }, "mnbvcxsertyuiolknb");
        ////console.log(token);
        res.json({
          "message": "Allow",
          token
        });
      } else {
        res.json({
          "message": " Password or email is incorrect"
        })
      }
    }


  } catch (error) {
    console.error(error);
  }
})

router.get('/notifications', authenticate, async (req, res) => {
  try {

  } catch (error) {
    res.json(error);
  }
});




module.exports = router;
