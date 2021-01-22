import { response } from 'express';
import Curso from '../models/Curso';
import Aluno from '../models/Aluno';
import CursoAluno from '../models/CursoAluno';


class CursoController {

    async index(req, res) {

        const cursos = await Curso.findAll();

        res.json(cursos);

    }

    async list(req, res) {

        const { id_aluno } = req.params;
        
        const aux = await CursoAluno.findAndCountAll({
            where: {
                id_pessoa: id_aluno
            }
        });

        if (aux.count == 0) {
            return res.json(0)
        }

        let cursos_aluno = aux.rows.map((v)=>v.id_curso);

        let cursos_nome = []

        for(var i = 0; i < cursos_aluno.length; i++) {
            cursos_nome[i] = await Curso.findOne({
                where: {
                    id: cursos_aluno[i]
                }
            })
        }

        res.json(cursos_nome);

    }

    async store(req, res) {

        const { id_aluno } = req.params;

        const { nome } = req.body;

        const nome_curso = nome;

        const aluno = await Aluno.findByPk(id_aluno);

        if (!aluno) {
            return res.json("Erro!")
        }

        const curso = await Curso.findOne({
            where: {
                nome: nome_curso
            }
        })

        const aux = await CursoAluno.findAndCountAll({
            where: {
                id_pessoa: aluno.id,
                id_curso: curso.id
            }
        })

        if(aux.count != 0) {
            return res.json("Aluno já cadastrado no curso!")
        }

        await CursoAluno.create({
            id_pessoa: aluno.id,
            id_curso: curso.id
        })

        return res.json("Aluno cadastrado no curso!");

    }

    async delete(req, res) {

        const { id_aluno, id_curso } = req.params;

        const cursoAluno = await CursoAluno.findOne({
            where: {
                id_pessoa: id_aluno,
                id_curso: id_curso
            }
        })

        const cursoAluno_id = cursoAluno.dataValues.id;
    
        const aux = await CursoAluno.findByPk(cursoAluno_id);
    
        if (!aux) {
          
          return res.json("Erro!");
    
        }
    
        await aux.destroy();
    
        return res.json("Aluno removido do curso!");

    }
}

export default new CursoController();