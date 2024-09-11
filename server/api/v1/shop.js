module.exports = {
    post: async (data) => {
        let { req, res, path, sequelize } = data;
        const Shop = await require(`${path}/models/shopModel.js`)(sequelize).sync();
        const newShop = await Shop.create(req.body);
        return await res.status(201).json({ message: 'Магазин создан успешно', data: newShop });
    },
    get: async (data) => {
        let { req, res, path, sequelize } = data;
        const Shop = await require(`${path}/models/shopModel.js`)(sequelize).sync();
        if (req.params.id) {
            // Получение одного магазина
            const shopId = parseInt(req.params.id);
            const shop = await Shop.findByPk(shopId);

            if (!shop) return await res.status(404).json({ message: 'Магазин не найден' });

            return await res.status(200).json({ data: shop });
        } else {
            // Получение всех магазинов
            const shops = await Shop.findAll();
            return await res.status(200).json({ data: shops });
        }
    },
    put: async (data) => {
        let { req, res, path, sequelize } = data;
        const Shop = await require(`${path}/models/shopModel.js`)(sequelize).sync();
        const shopId = parseInt(req.params.id);
        const updated = await Shop.update(req.body, { where: { id: shopId }, returning: true });

        if (!updated || updated === 0) return await res.status(404).json({ message: 'Магазин не найден' });

        const updatedShop = updated[1][0].dataValues;
        return await res.status(200).json({ message: 'Магазин обновлен', data: updatedShop });
    },
    delete: async (data) => {
        let { req, res, path, sequelize } = data;
        const Shop = await require(`${path}/models/shopModel.js`)(sequelize).sync();
        const shopId = parseInt(req.params.id);
        const deletedRows = await Shop.destroy({ where: { id: shopId } });

        if (!deletedRows || deletedRows === 0) return await res.status(404).json({ message: 'Магазин не найден' });

        return await res.status(204).json({ message: 'Магазин удален успешно' });
    }
};
