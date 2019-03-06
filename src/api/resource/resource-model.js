import Sequelize from 'sequelize';
import sequelize from '../../util/sequelize';

const Resource = sequelize.define('Resource', {
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
  }
}, {
  createdAt: 'date_created',
  updatedAt: 'date_updated',
  tableName: 'resource',
  underscored: true
});

export default Resource;
