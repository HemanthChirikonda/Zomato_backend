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



/* GET list of restaurants. */
router.get('/:id', async (req, res) => {
    try {

        console.log(req.params);
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const restaurants = await db.collection('restaurants').find({ admin: req.params.id }).toArray();;

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





// /* GET add a restaurant. */
// router.get('/addrestaurant', async function (req, res, next) {
//     try {
//         res.json('allow');
//     } catch (error) {
//         res.send(error);
//     }
// });



/* add a restaurant. */
router.post('/addrestaurant', async function (req, res, next) {
    try {
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const restaurant = await db.collection('restaurants').insertOne(req.body);
        client.close();
        res.json({
            success: true,
            id: restaurant.insertedId
        })

    } catch (err) {
        res.json({
            success: false,
            error: err
        })
    }
});





/* change the opening status of restaurant. */
router.post('/open/:name', async (req, res) => {
    try {
        console.log(req.params);
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const restaurants = await db.collection('restaurants').updateOne({ name: req.params.name }, { $set: { isOpen: req.body.isOpen } });
        client.close();
        res.json({
            success: true
        });

    } catch (err) {
        res.json({
            success: false,
            error: err
        });
    }
});


/* add a category to db. */
router.post('/addcategory', async (req, res) => {
    try {

        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const categories = await db.collection('MenuCategories').find({ name: req.body.name }, { resId: req.params.resid }).toArray().catch(console.error());
        console.log(categories);
        if (categories.length > 0) {
            client.close();
            res.json({
                success: false,
                message: 'category already exited'
            });
        } else {
            const item = await db.collection('MenuCategories').insertOne(req.body);
            const restaurant = await db.collection('restaurants').findOneAndUpdate({ _id: req.body.resId }, { $push: { categories: [ObjectId(item.insertedId)] } });
            client.close();
            res.json({
                success: true,
                id: item.insertedId
            });
        }

    } catch (err) {

        res.json({
            success: false,
            error: err
        })
    }
});




/* GET categories of particular admin */
router.get('/categories/:adid', async (req, res, next) => {
    try {
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const categories = await db.collection('MenuCategories').find({ admin: req.params.adid }).toArray();

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





/* delete the category by id */
router.post('/categories/delete/:categoryid', async (req, res, next) => {
    try {
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const categororyDelete = await db.collection('MenuCategories').deleteOne({ _id: ObjectId(req.params.categoryid) });

        client.close();

        res.json({
            success: true
        });
    } catch (err) {

        res.json({
            success: false,
            error: err
        })
    }
});



/* add a menuItem to db */
router.post('/menuItems/addmenuItem', async (req, res) => {
    try {

        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const categories = await db.collection('menuItems').find({ name: req.body.name }, { resId: req.params.resid }).toArray().catch(console.error());
        console.log(categories);
        if (categories.length > 0) {
            client.close();
            res.json({
                success: false,
                message: 'Item already exited'
            });
        } else {
            const item = await db.collection('menuItems').insertOne(req.body);
            // const restaurant = await db.collection('restaurants').findOneAndUpdate({ _id: req.body.resId }, { menuItems: { $push: [ObjectId(item.insertedId)] } });
            client.close();

            res.json({
                success: true,
                id: item.insertedId
            });


        }

    } catch (err) {

        res.json({
            success: false,
            message: err
        })
    }
});




/* GET all the menuitems of particular admin */
router.get('/menuItems/:adid', async (req, res, next) => {
    try {
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const menuItems = await db.collection('menuItems').find({ admin: req.params.adid }).toArray();

        client.close();

        res.json({
            success: true,
            menuItems
        });
    } catch (err) {

        res.json({
            success: false,
            error: err
        })
    }
});



/* update avilable status of the menuitem  */
router.post('/menuItems/update/:id', async (req, res, next) => {
    try {
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const menuItemupdate = await db.collection('menuItems').findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $set: { isavailable: req.body.isavailable } });

        client.close();
        console.log(menuItemupdate)
        res.json({
            success: true,

        });
    } catch (err) {

        res.json({
            success: false,
            error: err
        })
    }
});



/* delete the menuitem*/
router.post('/menuItems/delete/:id', async (req, res, next) => {
    try {
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        const menuItemdelete = await db.collection('menuItems').deleteOne({ _id: ObjectId(req.params.id) });

        client.close();

        res.json({
            success: true
        });
    } catch (err) {

        res.json({
            success: false,
            error: err
        })
    }
});

/*get teh oreder details of particular restaurant3*/
router.get('/Orders/:resid', async (req, res, next) => {
    try {
        const client = await mongodbClint.connect(url);
        const db = client.db('Zomato');
        console.log(req.params);
        const orders = await db.collection('Orders').find({ resId: { $gt: ObjectId(req.params.resid) } }).toArray();

        client.close();
        console.log(orders);
        res.json({
            success: true,
            orders
        });
    } catch (err) {

        res.json({
            success: false,
            error: err
        })
    }
});

module.exports = router;
