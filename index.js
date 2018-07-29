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
    destination:'./public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));// Date.now() is minis
    }    
})
// init upload
const upload = multer({
    storage: storage,
    // limits: { 
    //     fieldSize: 10
    // },
    fileFilter: function(req, file, cb)
    {
        checkFileType(file, cb);
    }
}).single('myImage');

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

app.post('/upload',(req, res) =>{
    upload(req, res, (err) =>{
        if(err){
            res.render('index', {
                msg: err
            })
        }else
        {
            console.log(req.file);
            if(req.file === undefined)
            {
                res.render('index', {
                    msg: 'Erorr: No File Selected'
                })
            }else{
                res.render('index', {
                    msg: 'File Uploaded',
                    file: `uploads/${req.file.filename}`
                })
            }    
        }
    })
})
app.listen('3000', ( req, res ) =>{
    console.log('server started on  port 3000')
})  