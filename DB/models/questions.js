"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Questions.init(
    {
      question_type: DataTypes.INTEGER,
      table_column: DataTypes.STRING,
      tamplate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Questions",
      tableName: "questions",
      underscored: true,
    }
  );
  return Questions;
};
