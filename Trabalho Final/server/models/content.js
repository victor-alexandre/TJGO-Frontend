'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    static associate(models) {
      // Associação: Um Conteúdo pertence a um Usuário
      Content.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      // Associação: Um Conteúdo pertence a muitas Tags
      Content.belongsToMany(models.Tag, {
        through: 'Content_Tags',
        foreignKey: 'content_id',
        as: 'tags'
      });
    }
  }
  Content.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    texto: DataTypes.TEXT,
    status: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Content',
  });
  return Content;
};