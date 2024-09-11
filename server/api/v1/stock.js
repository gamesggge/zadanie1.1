const axios = require('axios');
const { Sequelize, Op } = require('sequelize');

module.exports = {
    post: async (data) => {
        let { req, res, path, sequelize } = data
        const Stock = await require(`${path}/models/stockModel.js`)(sequelize).sync()
        const newStock = await Stock.create(req.body);
        await axios.post('https://gamesggge.ru:1445/actions', {
            action_type: 'create',
            stock_id: newStock.id,
            product_id: newStock.product_id,
            shop_id: newStock.shop_id,
            details: {
                on_shelf: newStock.on_shelf,
                in_order: newStock.in_order
            }
        });
        return await res.status(201).json({ message: 'Создано успешно', data: newStock });
    },
    get: async (data) => {
        let { req, res, path, sequelize } = data
        const Stock = (await require(`${path}/models/stockModel.js`))(sequelize);

        const searchConditions = {};

        if (req.query.product_id) {
            searchConditions.product_id = parseInt(req.query.product_id, 10);
        }
        if (req.query.shop_id) {
            searchConditions.shop_id = parseInt(req.query.shop_id, 10);
        }
        if (req.query.on_shelf_from && req.query.on_shelf_to) {
            searchConditions.on_shelf = {
                [Op.between]: [
                    parseInt(req.query.on_shelf_from, 10),
                    parseInt(req.query.on_shelf_to, 10),
                ],
            };
        }
        if (req.query.in_order_from && req.query.in_order_to) {
            searchConditions.in_order = {
                [Op.between]: [
                    parseInt(req.query.in_order_from, 10),
                    parseInt(req.query.in_order_to, 10),
                ],
            };
        }

        if (req.query.id) {
            const stockId = parseInt(req.query.id, 10);
            const stock = await Stock.findByPk(stockId);

            if (!stock) return res.status(404).json({ message: 'Не найдено остатка' });

            return res.status(200).json({ data: stock });
        } else {
            // Поиск по условиям
            const stocks = await Stock.findAll({
                where: searchConditions,
            });

            return res.status(200).json({ data: stocks });
        }
    },
    put: async (data) => {
        let { req, res, path, sequelize } = data
        const Stock = await require(`${path}/models/stockModel.js`)(sequelize).sync()
        const stockId = parseInt(req.query.id);
        const updated = await Stock.update(req.body, { where: { product_id: stockId }, returning: true });

        if (!updated || updated === 0) return await res.status(404).json({ message: 'Не найдено остатка' });

        const updatedStock = updated[1][0].dataValues;
        await axios.post('https://gamesggge.ru:1445/actions', {
            action_type: 'update',
            stock_id: stockId,
            product_id: updatedStock.product_id,
            shop_id: updatedStock.shop_id,
            details: {
                on_shelf: updatedStock.on_shelf,
                in_order: updatedStock.in_order,
                updatedFields: req.body
            }
        });
        return await res.status(200).json({ data: updatedStock });
    },
    delete: async (data) => {
        let { req, res, path, sequelize } = data
        const Stock = await require(`${path}/models/stockModel.js`)(sequelize).sync()
        const stockId = parseInt(req.query.id);
        const deletedRows = await Stock.destroy({ where: { id: stockId } });

        if (!deletedRows || deletedRows === 0) return await res.status(404).json({ message: 'Не найдено остатка' });

        await axios.post('https://gamesggge.ru:1445/actions', {
            action_type: 'delete',
            stock_id: stockId,
            details: { message: 'Остаток удален' }
        });

        return await res.status(204);
    }
}