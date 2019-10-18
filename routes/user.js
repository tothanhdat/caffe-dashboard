const route = require('express').Router();
const USER_MODEL = require('../models/User');

route.get('/dang-ky', async (req, res) => {
    res.render('pages/register', { alertErrorRegister: false });
})

route.post('/register', async (req, res) => {
    let { username, password } = req.body;
    let infoUser = await USER_MODEL.register(username, password);
    if (infoUser.error && infoUser.message == 'username_existed')
        return res.render('pages/register', { alertErrorRegister: true });
    return res.redirect('/user/dang-nhap');
});

route.get('/dang-nhap', async (req, res) => {
    res.render('pages/login', { alertErrorLogin: false });
})

route.post('/login', async (req, res) => {
    let { username, password } = req.body;
    let infoUser = await USER_MODEL.signIn(username, password);
    if (infoUser.error && infoUser.message == 'username_not_exist')
        return res.render('pages/login', { alertErrorLogin: true })
    res.cookie('token', infoUser.data.token, { maxAge: 900000 });
    return res.json('HELLO DASHBOARD');
})

module.exports = route;