var { url, mongodbClint, bcrypt, nodemailer } = require('../config');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { response } = require('express');
const { route } = require('.');
const auth = require('../auth');
const app = require('../app');
const authenticate = require('../auth');
const { ObjectId } = require('mongodb');

const adminrootauthenticate = require('../adminAuth')
/* GET home page. */


router.get('/resturants', async (req, res) => {
    try {

        console.log(req.params);
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const restaurants = await db.collection('restaurants').find().toArray();

        client.close();
        res.json({
            success: true,
            restaurants
        })


    } catch (err) {
        res.json({
            success: false,
            error: err
        })
    }
});



router.get('/resturants/:name', async (req, res) => {
    try {

        console.log(req.params);
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const restaurant = await db.collection('restaurants').find({ name: req.params.name }).toArray();

        client.close();
        res.json({
            success: true,
            restaurant
        })


    } catch (err) {
        res.json({
            success: false,
            error: err
        })
    }
});


router.get('/categories/:resid', async (req, res, next) => {
    try {
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const categories = await db.collection('MenuCategories').find({ resId: req.params.resid }).toArray();

        client.close();

        res.json({
            success: true,
            categories
        });
    } catch (err) {

        res.json({
            success: false,
            error: err
        })
    }
});






module.exports = router;