const express=require('express')
const mongoose=require('mongoose')
const cors= require('cors')
const passport= require('passport')
const path= require('path')
const bodyParser=require('body-parser')

require('dotenv').config()
const connUri=process.env.MONGO_LOCAL_CONN_URL
const port=process.env.PORT || 3000
const app=express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())


mongoose.promise=global.Promise
mongoose.connect(connUri,{useNewUrlParser:true,useCreateIndex:true})

const connection=mongoose.connection
connection.once('open',()=>console.log('db connection on'))
connection.on('error',(err)=>{
    console.log('mongo db connection error' + err)
    process.exit()
})

app.use(passport.initialize())
require("./middlewares/jwt")(passport)


require('./routes/index')(app)


app.listen(port,()=>{
    console.log('server running on ' +port +'')
})