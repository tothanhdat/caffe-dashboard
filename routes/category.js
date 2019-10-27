const route = require('express').Router();
const ROLE_ADMIN = require('../utils/checkRole');
const CATEGORY_MODEL = require('../models/Category');

route.get('/them', ROLE_ADMIN, async (req, res) => {
    res.render('pages/add-category', { alertError: false });
});
route.post('/add', ROLE_ADMIN, async (req, res) => {
    let { nameCategory, idCategory } = req.body;
    try {
        let result = await CATEGORY_MODEL.insert(nameCategory, idCategory);
        if (result.error && result.message == 'category_existed') return res.render('pages/add-category', { alertError: true });
        res.redirect('/danh-muc/danh-sach');
    } catch (error) {
        res.json(error.message);
    }
});
route.get('/danh-sach', ROLE_ADMIN, async (req, res) => {
    let result = await CATEGORY_MODEL.getList();
    res.render('pages/list-category', { result: result.data });
});
route.get('/tim-kiem', async (req, res) => {
    try {
        let { search } = req.query;
        const dataSearch = await CATEGORY_MODEL.find({
            $or: [
                { nameCategory: new RegExp(search, 'i') },
                { idCategory: new RegExp(search, 'i') },
            ]
        });
        res.json({ data: dataSearch });
    } catch (error) {
        res.json('Error');
    }
});
route.get('/:id?', ROLE_ADMIN, async (req, res) => {
    let { id } = req.params;
    //let { nameCategory, idCategory } = req.body;
    let result = await CATEGORY_MODEL.getID(id);
    res.json(result);
});
route.get('/cap-nhat/:id', ROLE_ADMIN, async (req, res) => {
    let { id } = req.params;
    let infoCategory = await CATEGORY_MODEL.getID(id);
    res.render('pages/edit-category', { infoCategory: infoCategory.data });
});
route.post('/update/:id', ROLE_ADMIN, async (req, res) => {
    let { id } = req.params;
    let { idCategory, nameCategory } = req.body;
    console.log({ id, idCategory, nameCategory });
    try {
        let result = await CATEGORY_MODEL.updateID(id, idCategory, nameCategory);
        res.redirect('/danh-muc/danh-sach');
    } catch (error) {
        res.redirect('/danh-muc/loi-cap-nhat-danh-muc');
    }
});

route.get('/xoa/:id', ROLE_ADMIN, async (req, res) => {
    let { id } = req.params;
    //console.log({id})
    try {
        let result = await CATEGORY_MODEL.deleteID(id);
        res.redirect('/danh-muc/danh-sach');
    } catch (error) {
        res.redirect('/danh-muc/loi-xoa-khoa');
    }

});

module.exports = route;