const express=require("express");
const app=express();
const cors=require("cors");
require('./db/config');
const User=require('./db/User');
app.use(express.json());
app.use(cors());
app.post("/data",async (req,resp)=>{
    let user=new User(req.body)
    let result=await user.save();
    resp.send(result);
    console.log(req.body);
});
app.listen(3000);