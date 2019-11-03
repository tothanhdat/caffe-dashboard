const PRODUCT_MODEL = require('../database/Product-coll');
module.exports = class Product extends PRODUCT_MODEL {
    static insert({ nameProduct, idProduct, idCategory, avatar, price }) {
        return new Promise(async resolve => {
            try {
                let checkExist = await Product.findOne({ nameProduct });
                if (checkExist) return resolve ({ error: true, message: 'product_existed'});
                let newPorduct = new Product({ nameProduct, idProduct, idCategory, avatar, price });
                let savePorduct = await newPorduct.save();
                if (!savePorduct) return resolve({ error: true, message: 'cannot_insert_product' });
                resolve({ error: false, data: newPorduct });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getList() {
        return new Promise(async resolve => {
            try {
                let listProduct = await Product.find();
                if (!listProduct) return resolve({ error: true, message: 'cannot_get_list_product' });
                resolve({ error: false, data: listProduct })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getID(id) {
        return new Promise(async resolve => {
            try {
                let getID = await Product.findOne({ _id: id });
                if (!getID) return resolve({ error: true, message: 'cannot_get_id_product' });
                resolve({ error: false, data: getID });
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static updateProduct({ id, nameProduct, idProduct, idCategory, avatar, price }) {
        return new Promise(async resolve => {
            try {
                console.log({ id, nameProduct, idProduct, idCategory, avatar, price});
                
                let updateProduct = await Product.findByIdAndUpdate(id, { nameProduct, idProduct, idCategory, avatar, price}, { new: true });
                resolve({ error: false, data: updateProduct });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static deleteProduct(id) {
        return new Promise(async resolve => {
            try {
                let deleteProduct = await Product.findByIdAndDelete(id);
                resolve({ error: false, data: deleteProduct });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}
