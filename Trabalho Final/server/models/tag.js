'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Associação: Uma Tag pertence a muitos Conteúdos
      Tag.belongsToMany(models.Content, {
        through: 'Content_Tags',
        foreignKey: 'tag_id',
        as: 'contents'
      });
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};