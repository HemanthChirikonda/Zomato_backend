require('dotenv').config()

const url = process.env.DB_URL;
const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const mongodbClint = mongodb.MongoClient;



module.exports = { url, mongodbClint, bcrypt, nodemailer };

