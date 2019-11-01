const route = require('express').Router();
const PRODUCT_MODEL = require('../models/Product');
const CATEGORY_MODEL = require('../models/Category');
const ROLE_ADMIN = require('../utils/checkRole');
const { uploadMulter } = require('../utils/config_multer');
const fs = require('fs');

route.get('/them', ROLE_ADMIN, async (req, res) => {
    let listCategory = await CATEGORY_MODEL.getList();
    res.render('pages/add-product', { listCategory: listCategory.data, alertInsertProductError: false });
});
route.post('/add', ROLE_ADMIN, uploadMulter.single('avatar'), async (req, res) => {
    try {
        let { nameProduct, idProduct, idCategory, price } = req.body;
        let infoFile = req.file;
        let listCategory = await CATEGORY_MODEL.getList();
        let infoProduct = await PRODUCT_MODEL.insert({ nameProduct, idProduct, idCategory, price, avatar: infoFile.originalname });
        console.log({ infoProduct });
        if (infoProduct.error && infoProduct.message == 'product_existed') return res.render('pages/add-product', { listCategory: listCategory.data, alertInsertProductError: true });
        res.redirect('/san-pham/danh-sach');
    } catch (error) {
        res.json(error.message);
    }
});
route.get('/danh-sach', ROLE_ADMIN, async (req, res) => {
    let result = await PRODUCT_MODEL.getList();
    // console.log( { result });
    res.render('pages/list-product2', { result: result.data });
});
route.get('/tim-kiem', async (req, res) => {
    try {
        let { search } = req.query;
        const dataSearch = await PRODUCT_MODEL.find({
            $or: [
                { nameProduct: new RegExp(search, 'i') },
                { idProduct: new RegExp(search, 'i') },
                { idCategory: new RegExp(search, 'i') },
                { price: new RegExp(search, 'i') },
            ]
        });
        res.json({ data: dataSearch });
    } catch (error) {
        res.json('Error');
    }
});

route.get('/cap-nhat/:id', ROLE_ADMIN, async (req, res) => {
    let { id } = req.params;
    let result = await PRODUCT_MODEL.getID(id);
    let listCategory = await CATEGORY_MODEL.getList();
    res.render('pages/edit-product', { infoProduct: result.data, listCategory: listCategory.data });
});
route.post('/update/:id', ROLE_ADMIN, uploadMulter.single('avatar'), async (req, res) => {
    try {
        let { id } = req.params;
        //let infoFile = req.file
        let infoFile;
        if(req.file){
            infoFile  = req.file.originalname;
        }else{
            let infoProduct = await PRODUCT_MODEL.getID(id);
            infoFile = infoProduct.data.avatar;
        }
        console.log(infoFile);
        let { nameProduct, idProduct, idCategory, price } = req.body;
        let result = await PRODUCT_MODEL.updateProduct({ id, nameProduct, idProduct, idCategory, price, avatar: infoFile });
        res.redirect('/san-pham/danh-sach');
    } catch (error) {
        res.redirect('/san-pham/loi-cap-nhat-san-pham');
    }
});
route.get('/xoa/:id', ROLE_ADMIN, async (req, res) => {
    try {
        let { id } = req.params;
        let result = await PRODUCT_MODEL.deleteProduct(id);
        console.log(result);
        fs.unlink(`./public/image/${result.data.avatar}`, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
        res.redirect('/san-pham/danh-sach');
    } catch (error) {
        res.redirect('/san-pham/loi-xoa-san-pham');
    }
});
route.get('/:id?', ROLE_ADMIN, async (req, res) => {
    let { id } = req.params;
    let result = await PRODUCT_MODEL.getID(id);
    res.json(result);
});

module.exports = route;