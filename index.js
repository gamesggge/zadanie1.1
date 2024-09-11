const Server = require('./server.js')
const config = require('./config.json')[process.env.NODE_ENV || 'development'];
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config);
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение установленно!');
    const Product = await require('./models/productModel')(sequelize).sync()
    const Shop = await require('./models/shopModel')(sequelize).sync()
    const Stock = await require('./models/stockModel')(sequelize).sync()
    await sequelize.sync();
    console.log('Все таблицы синхронизированы');
    Server(__dirname, sequelize)
  } catch (error) {
    console.error('ошибка подключения к бд ', error);
  }
})();