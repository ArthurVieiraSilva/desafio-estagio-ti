import { Model, DataTypes } from 'sequelize';

class Aluno extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        cep: DataTypes.STRING,
        cidade: DataTypes.STRING,
        estado: DataTypes.STRING
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'aluno'
      }
    );
  }

  static associate(models) {

    this.belongsToMany(models.Curso, { 
      foreignKey: 'id_pessoa', 
      through: 'curso_pessoa', 
      as: 'cursos' 
    });

  }
}

export default Aluno;
