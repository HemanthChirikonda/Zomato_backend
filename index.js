const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const mongodb= require('mongodb');
let bcrypt= require('bcryptjs');
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
// const shortId= require('shortid');
const mongodbClint= mongodb.MongoClient;
const url = 'mongodb+srv://hemanth:OHoCYn9ztyvAKrdH@cluster0.v7ugo.mongodb.net?retryWrites=true&w=majority';
const cors= require('cors');



app.use(express.urlencoded({extended:false}));


'use strict';

app.use(cors({
    //origin:"https://suspicious-brattain-5c36ee.netlify.app"
    origin:"*"

}));
app.use(bodyParser.json());
const port=3030;

app.get("/",(req,res)=>{
    res.send("hello")
})




let authenticate= function(req,res,next){
    //check if token present
    if(req.headers.authorization){
  // check if token valid
  let verifyResult= jwt.verify(req.headers.authorization,"mnbvcxsertyuiolknb");
  // if valid then allow user
  if(verifyResult){
      next();
  }else{
      res.status(401).json({
          "message":"invalid authorization"
      })
  }
    }else{
        res.status(401).json({
            "message":"no token present"
        })
    }
  }

  app.post("/register", async (req,res)=>{
    try {
////console.log(req.body);
let client = await mongodbClint.connect(url);
let db= client.db('trimurlapp');
let email= await db.collection('users').findOne({'Email':req.body.Email});
if(email){
    res.json({
        "message":"user alredy present"
    })
}else{
    let salt= await bcrypt.genSalt(10);
    let hash= await bcrypt.hash(req.body.Password,salt);
    req.body.Password= hash;
  //  //console.log(hash);
    let user = await db.collection('users').insertOne({
               "Email": req.body.Email,
               'FullName':re.body.FullName
            }
    );
 
}
client.close();
res.json({
    "message":"user created"
}) 
    } catch (error) {
        res.json({
            "message":error
        })
    }

});




app.post('./login',async(req,res)=>{
try {
    let client = await mongodbClint.connect(url);
    let db= client.db('Zomato');
    let user= await db.collection('user').findOne({Email:req.body.Email});
    if(user){
        var result= await bcrypt.compare(req.body.Password,user.Password);
        if(result){
            let token= jwt.sign({Email:user.Email},"mnbvcxsertyuiolknb");
            ////console.log(token);
            res.json({
                "message":"Allow",
                token
            });
        }else{
           res.json({
               "message":" Password or email is incorrect"
           })
        }
      
      }else{
         res.json({
             "message":"invalid user"
         });
       
      }
      client.close();
      
  } catch (error) {
      res.json({
          "message":error
      })
  }

});

app.post('./gencode',async(req,res)=>{
    try {
       let client = await mongodbClint.connect(url);
       let db= client.db('Zomato');
       let user=db.collection('users').findOne({'Email':req.body.Email});
       if(user){
         let code= Math.ceil(Math.random()*(999999-100000)+100000);
         //genarete salt
         let salt= await bcrypt.genSalt(10);
         //hash the salt
        let hash= await bcrypt.hash(`${code}`,salt); ;
        //set hash password
        let user2= await db.collection('users').findOneAndUpdate({'Email':req.body.Email},{$set:{"Password":hash}});
        client.close();
         // create reusable transporter object using the default SMTP transport
         let transporter = nodemailer.createTransport({
            service: "gmail", // true for 465, false for other ports
            auth: {
                user: "zomatocloneh@gmail.com", // generated ethereal user
                pass:'11409196Hs!' // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "test.shorturlapp@gmail.com", /// sender address
            to: `${user.Email}`, // list of receivers
            subject: `shorturlapp verification code ${code}`, // Subject line
            text: `Dear user,
              Your verification code is ${code}.
            `, // plain text body
            //html: "<b>Hello world?</b>", // html body
        }); 
        res.json({
            "message":"Email sent"
        });  

       }else{
           res.json({
               message:'user invalid'
           })
       }

        
    } catch (error) {
        res.json({
            message:error
        })
    }
});

app.listen(process.env.PORT || port,()=>{
    console.log('server started')
});