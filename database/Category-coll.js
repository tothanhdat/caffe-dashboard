const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var CategorySchema = new Shema ({
    idCategory: String,
    nameCategory: String,
    avatar: String
});
var CategoryModel = mongoose.model('category', CategorySchema);
module.exports = CategoryModel;