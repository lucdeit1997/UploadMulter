const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'))
//set storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let outputPath = path.resolve(__dirname, './files/');
      cb(null, outputPath)
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));// Date.now() is minis
    }    
})
// init upload
const upload_multiple = multer({
    storage: storage,
    fileFilter: function(req, file, cb)
    {
        checkFileType(file, cb);
    }

}).fields([
    { name: 'files' , maxCount: 10 },
    { name: 'images', maxCount: 10 },
    { name: 'audios', maxCount: 10 },
])

//check file tyle
function checkFileType(file, cb)
{
    //allowed ext
    const fileTyles =/jpeg|jpg|png|gif/;
    //check ext
    const extname = fileTyles.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = fileTyles.test(file.mimetype);
    if(mimetype && extname)
    {
        return cb(null, true);
    }
    else
    {
        cb('Erorr: Images Only')
    }
}

app.get('/', (req, res) =>{
    res.render('index');
})

app.post('/upload-multiple', upload_multiple, (req, res) =>{
   console.log(req.files);
})

app.listen('3000', ( req, res ) =>{
    console.log('server started on  port 3000')
})  