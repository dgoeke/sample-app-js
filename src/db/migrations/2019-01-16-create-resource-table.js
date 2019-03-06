module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable(
      'resource',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: Sequelize.STRING(300),
          allowNull: false
        },
        description: {
          type: Sequelize.STRING(1000),
          allowNull: false
        },
        createdAt: {
          field: 'date_created',
          type: Sequelize.DATE
        },
        updatedAt: {
          field: 'date_updated',
          type: Sequelize.DATE
        }
      }
    )
  ),
  down: queryInterface => queryInterface.dropTable('resource')
};
