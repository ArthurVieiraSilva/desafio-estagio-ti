import { Router } from 'express';

/** Controllers */
import AlunosController from '../app/controllers/AlunoController';
import CursosController from '../app/controllers/CursoController';
/**  * */

const routes = new Router();

routes.get('/alunos', AlunosController.index);
routes.post('/alunos', AlunosController.create);
routes.delete('/alunos/:id_aluno', AlunosController.delete);
routes.put('/alunos/:id_aluno', AlunosController.update);

routes.get('/cursos', CursosController.index);
routes.get('/alunos/:id_aluno/cursos', CursosController.list);
routes.post('/alunos/:id_aluno/cursos', CursosController.store);
routes.delete('/alunos/:id_aluno/cursos/:id_curso', CursosController.delete);

export default routes;
