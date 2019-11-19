const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const expressSession       = require('express-session');

const USER_ROUTER   = require('./routes/user');
const PRODUCT_ROUTER = require('./routes/product');
const CATEGORY_ROUTER = require('./routes/category');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(expressSession({
    secret: 'shopCaffe',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
}))

app.use('/user', USER_ROUTER);
app.use('/san-pham', PRODUCT_ROUTER);
app.use('/danh-muc', CATEGORY_ROUTER);


app.get('/', (req, res) => {
    res.render('pages/login');
}) 

const uri = 'mongodb://localhost/CaffeDB';
const PORT = process.env.PORT || 5000;


mongoose.set('useCreateIndex', true); //ẩn cảnh báo
mongoose.set('useUnifiedTopology', true); // ẩn cảnh báo


mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log('Server started at port 5000'));
});