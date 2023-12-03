const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 4500;
require('dotenv').config();
require('./db/config')
const User = require('./db/User')
const Product = require('./db/Product')

const app = express();

app.use(express.json())
app.use(cors())

app.post("/register", async (req, resp) => {
    let user = new User(req.body)
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    resp.send(result)
})

app.post('/login', async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password")
        if (user) {
            resp.send(user)
        }
        else { resp.send("No User found") }
    }
    else { resp.send("No User found") }

})

app.post('/add-product', async (req,resp)=>{
    let product = new Product(req.body)
    let result = await product.save();
    resp.send(result)
})

app.get('/products', async(req,resp)=>{
    let product = await Product.find();
    if(product.length!=0)
        resp.send(product)
    else
        resp.send("No product found")
})

app.get('/update/:id', async(req,resp)=>{
    let product = await Product.findOne({_id:req.params.id});
    if(product) resp.send(product)
    else resp.send("No Record Found")
})

app.delete("/product/:id",async(req,resp)=>{
    const result=await Product.deleteOne({_id:req.params.id})
    resp.send(result);
})

app.put("/update/:id", async(req,resp)=>{
    const result=await Product.updateOne({_id:req.params.id},{
        $set :req.body
    })
    resp.send(result)
})

app.get("/search/:key", async(req,resp)=>{
    let result= await Product.find({
        "$or" :[
            {
                name : {$regex : req.params.key}
            },
            {
                company : {$regex : req.params.key}
            },
            {
                category : {$regex : req.params.key}
            },
        ]
    })
    resp.send(result)
})
app.listen(port||5500)