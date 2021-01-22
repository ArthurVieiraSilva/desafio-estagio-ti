import { Model, DataTypes } from 'sequelize';

class Curso extends Model {

  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING
    }, {
      sequelize,
      timestamps: false,
      tableName: 'curso'
    });    
  }

  static associate(models) {

    this.belongsToMany(models.Aluno, { 
      foreignKey: 'id_curso', 
      through: 'curso_pessoa', 
      as: 'alunos' 
    });

  }

}

export default Curso;
