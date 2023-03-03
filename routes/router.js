const express =require("express");
const router =new express.Router();
const Products =require("../models/ProductSchema");
const User = require("../models/userSchema");
const bcrypt =require("bcryptjs");
const USER = require("../models/userSchema");
const authenticate=require("../middleware/authenticate")


 // get productsdata api
router.get("/getproducts", async(req,res) =>{
    try{
        const productsdata =await Products.find()
        // console.log("console the data"+productsdata);

        res.status(201).json(productsdata);
    }
    catch(error){
        console.log("error" + error.message);
    }
});

//get individual data

router.get("/getproductsone/:id", async(req,res) =>{
    try{
         const {id} = req.params;
          console.log(id);

        const individualdata = await Products.findOne({id:id});

        // console.log(individualdata + "individual data");
        res.status(201).json(individualdata);


    }
    catch(error){ 
        res.status(400).json(individualdata);
        console.log("error" + error.message);

        
    }
})


// register data

router.post("/register",async(req,res) =>{
    // console.log(req.body);

    const {fname,email,mobile,password,cpassword} =req.body; 

    if(!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({error:"please fill the all data"});
        console.log("no data is available");
    };

    try {
        const preuser =await User.findOne({ email:email });

        if(preuser) {
            res.status(422).json({error: "this user is already present"})
        }else if (password !== cpassword) {
            res.status(422).json({error:"password and cpassword are not matching"})

        }
        else {
            const finaluser =new User({
                fname,email,mobile,password,cpassword

            });

            // harsh -> encrypt hujug ->>decrypt ->harsh 
            // bcryptjs 
            
            //yahan hogi password hashing process
            


            const storedata = await finaluser.save();
            console.log(storedata);

            res.status(201).json(storedata);
        }

    }catch(error) {
        console.log("error the bhai catch ma for registratoin time" + error.message);
        res.status(422).send(error);

    }

})


//login user api

router.post("/login", async(req,res) => {
    const {email ,password} = req.body;

    if(!email || !password) {
        res.status(400).json({error:"fill all the data"});
    };
    try {
        const userlogin =await USER.findOne({email:email});
        console.log(userlogin);

        if(userlogin) {
            const isMatch =await bcrypt.compare(password, userlogin.password);
             console.log(isMatch + "pass match");


            //token generate  jaise hi user login hua

            const token =await userlogin.generateAuthToken();
            // console.log(token);

            res.cookie("Amazonweb",token,{
                expires:new Date(Date.now()+900000),
                httpOnly:true

            })

        if (!isMatch) {
            res.status(400).json({error:"invalid detail"})
        } else {
            res.status(201).json(userlogin);
        }
    }
        else {
            res.status(400).json({error:"invalid details"})
        }

    } catch (error) {
        res.status(400).json({error :"invalid detail"})


    }
})

//adding the data into cart 

router.post("/addcart/:id",authenticate,async(req,res) =>{
    try {
        const {id} =req.params;
        const cart = await Products.findOne({id:id});
        console.log(cart +"cart value");

        const UserContact =await USER.findOne({_id:req.userId});
        console.log(UserContact);


        if(UserContact){
            const cartData =await UserContact.addcartdata(cart);
            await UserContact.save();
            console.log(cartData);
            res.status(201).json(UserContact);
        } else {
            res.status(401).json({error:"invalid user"});
        }

    }
    catch(error) {

        res.status(401).json({error:"invalid user"});

    }
})

// get cart details

router.get("/cartdetails",authenticate ,async(req,res)=>{
    try {

        const buyuser =await USER.findOne({_id:req.userId});
        res.status(201).json(buyuser);

    } catch (error) {
        console.log("error" +error)

    }
})


//get valid user

router.get("/validuser",authenticate ,async(req,res)=>{
    try {

        const validuserone =await USER.findOne({_id:req.userId});
        res.status(201).json(validuserone);

    } catch (error) {
        console.log("error" +error)

    }
})


//remove item from cart

router.delete("/remove/:id",authenticate,async(req,res) =>{
    try {
        const {id} =req.params;

        req.rootUser.carts =req.rootUser.carts.filter((cruval) =>{
            return cruval.id !=id;
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item remove");

    } catch(error) {
        console.log("error"+ error);
        res.status(400).json(req.rootUser);
         
    }
})

//for user logout

router.get("/logout",authenticate,async(req,res) =>{
    try {

        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) =>{
            return curelem.token !== req.token
    
        });

        res.clearCookie("Amazonweb",{path:"/"});

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens)
        console.log("user logout");


    } catch(error) {
        // res.status(400).json(req.rootUser.tokens)
        console.log("error for user logout")

    }
})



module.exports =router;