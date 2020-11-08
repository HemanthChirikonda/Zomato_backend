var { url, mongodbClint, bcrypt, nodemailer } = require('../config');
var express = require('express');
var router = express.Router();

const path = require('path');

const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const app = require('../app');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



//Mongodb URI is {url}
const MongoURI = `${url}`
const conn = mongoose.createConnection(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let gfs;

conn.once('open', () => {

    //init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});


// create storage engine

const storage = new GridFsStorage({
    url: MongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });


// Get  /
//Description: loads form

router.get('/', (req, res) => {
    //res.send(`${upload}`)
});
router.post('/upload', upload.single('file'), async (req, res) => {

    res.json({
        success: 1,
        profile_url: `http://localhost:3000/images/${req.file.filename}`
    })


});


// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        return res.json(file);
    });
});


// @route GET /image/:filename
// @desc Display Image
router.get('/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            // const readstream = gfs.createReadStream(file.filename);
            // readstream.pipe(res);
            res.json(file.filename)
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
});
















module.exports = router;