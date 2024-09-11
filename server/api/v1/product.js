const axios = require('axios');
const { Sequelize, Op } = require('sequelize');

module.exports = {
    post: async (data) => {
        let { req, res, path, sequelize } = data
        const Product = await require(`${path}/models/productModel.js`)(sequelize).sync()
        const newProduct = await Product.create(req.body);
        await axios.post('https://gamesggge.ru:1445/actions', {
            action_type: 'create',
            product_id: newProduct.id,
            plu: newProduct.plu,
            details: { name: newProduct.name }
        });
        return await res.status(201).json({ message: 'Создано успешно', data: newProduct });
    },
    get: async (data) => {
        let { req, res, path, sequelize } = data
        const Product = (await require(`${path}/models/productModel.js`))(sequelize);

        const searchConditions = {};

        if (req.query.name) {
            searchConditions.name = {
                [Op.iLike]: `%${req.query.name}%`
            };
        }
        if (req.query.plu) {
            searchConditions.plu = {
                [Op.iLike]: `%${req.query.plu}%`
            };
        }

        if (req.query.id) {
            // Один продукт по ID
            const productId = parseInt(req.query.id, 10);
            const product = await Product.findByPk(productId);

            if (!product) return res.status(404).json({ message: 'Продукт не найден' });

            return res.status(200).json({ data: product });
        } else {
            // Поиск по условиям
            const products = await Product.findAll({
                where: searchConditions,
            });

            return res.status(200).json({ data: products });
        }
    },
    put: async (data) => {
        let { req, res, path, sequelize } = data
        const Product = await require(`${path}/models/productModel.js`)(sequelize).sync()
        const productId = parseInt(req.query.id);
        const updated = await Product.update(req.body, { where: { id: productId }, returning: true });

        if (!updated || updated === 0) return await res.status(404).json({ message: 'Продукт не найден' });

        const updatedProduct = updated[1][0].dataValues;

        await axios.post('https://gamesggge.ru:1445/actions', {
            action_type: 'update',
            product_id: productId,
            plu: updatedProduct.plu,
            details: { name: updatedProduct.name, updatedFields: req.body }
        });

        return await res.status(200).json({ data: updatedProduct });
    },
    delete: async (data) => {
        let { req, res, path, sequelize } = data
        const Product = await require(`${path}/models/productModel.js`)(sequelize).sync()
        const productId = parseInt(req.query.id);
        let deletedRows = await Product.destroy({ where: { id: productId } }).catch(async () => {
            const Stock = await require(`${path}/models/stockModel.js`)(sequelize).sync()
            deletedRows = await Stock.destroy({ where: { product_id: productId } })
        })

        if (!deletedRows || deletedRows === 0) return await res.status(404).json({ message: 'Продукт не найден' });

        await axios.post('https://gamesggge.ru:1445/actions', {
            action_type: 'delete',
            product_id: productId,
            details: { message: 'Продукт удален' }
        });

        return await res.status(204);
    }
}