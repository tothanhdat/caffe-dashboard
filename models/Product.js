const PRODUCT_MODEL = require('../database/Product-coll');
module.exports = class Product extends PRODUCT_MODEL {
    static insert({ nameProduct, idProduct, idCategory, avatar }) {
        return new Promise(async resolve => {
            try {
                let checkExist = await Product.findOne({ idProduct });
                if (checkExist) return resolve ({ error: true, message: 'product_existed'});
                let newPorduct = new Product({ nameProduct, idProduct, idCategory, avatar });
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
    static updateProduct({ id, nameProduct, idProduct, idCategory, avatar }) {
        return new Promise(async resolve => {
            try {
                console.log({ id, nameProduct, idProduct, idCategory, avatar });
                // let checkID = await SinhVien.findById({ _id: id });
                // if (!checkID) return resolve({ error: true, message: 'cannot_search_id_sinh_vien' });
                let updateProduct = await SinhVien.findByIdAndUpdate(id, { nameProduct: nameProduct, idProduct, idCategory, avatar}, { new: true });
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
