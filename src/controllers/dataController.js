const database = require('../config/connection');
const {User} = require('../model/login/loginModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
console.log(User); // Should log a function, not an object
showCollections = async (req,res)=>{
    const dbCollectName = req.body.databaseName;
    try {
        const data = await database.getCollectionData(dbCollectName);
        if (!data) {
            return res.status(404).json({ error: "No collection data found" });
        }
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Error fetching collection data:', error);
        res.status(500).json({ error: "Failed to fetch collection data" });
    }
}

createRegister = async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword
        });
    
        await newUser.save();


        res.render('pages/login',{
            layout:false,
        })
      } catch (error) {
        res.status(400).send(error.message);
      }

}

module.exports={showCollections,createRegister};