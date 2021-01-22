import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import Aluno from '../app/models/Aluno';
import Curso from '../app/models/Curso';
import CursoAluno from '../app/models/CursoAluno';

const connection = new Sequelize(databaseConfig);

Aluno.init(connection);
Curso.init(connection);
CursoAluno.init(connection);

Aluno.associate(connection.models);
Curso.associate(connection.models);

export default connection;
