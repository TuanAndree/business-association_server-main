const express = require('express')
const app = express();

const PORT = 4000;

// Connect to DB
const db = require('./src/config/db');
db.connect();


//cors
var cors = require('cors');
app.use(cors());


//xử lý post => trả data về body
app.use(express.urlencoded({extended:true}));
app.use(express.json())


//middleware xử lý restfull api

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

//router
const route = require('./src/routes')
route(app)
app.listen(PORT,()=>{console.log('server is running')})
