import { response } from 'express';
import Aluno from '../models/Aluno';

const axios = require('axios').default;

class AlunoController {
  async index(req, res) {
    
    const alunos = await Aluno.findAll()
  
    res.json(alunos);
  
  }

  async create(req, res) {

    const { nome, email, cep } = req.body;

    if (cep.length != 8) {
      return res.json("CEP inválido!")
    }
    
    const apiResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    
    if (apiResponse.data.erro) {
      return res.json("CEP inválido!")
    }

    const cidade = apiResponse.data.localidade;
    const estado = apiResponse.data.uf;
        
    await Aluno.create({
      nome,
      email,
      cep,
      cidade,
      estado,
    })

    return res.json("Aluno cadastrado!");
    
  }

  async update(req, res) { 

    const { id_aluno } = req.params;
    const { nome, email, cep } = req.body;
    
    const nomeUp = nome;
    const emailUp = email;
    const cepUp = cep;

    if (cepUp.length != 8) {
      return res.json("CEP inválido!")
    }

    const apiResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

    if (apiResponse.data.erro) {
      return res.json("CEP inválido!")
    }

    const cidadeUp = apiResponse.data.localidade;
    const estadoUp = apiResponse.data.uf;
        
    await Aluno.update({ 
      nome: nomeUp,
      email: emailUp, 
      cep: cepUp, 
      cidade: cidadeUp, 
      estado: estadoUp 
    }, {
      where: {
        id: id_aluno
      }
    })

    return res.json("Alterações salvas!");

  }

  async delete(req, res) {
    
    const { id_aluno } = req.params;
 
    const aux = await Aluno.findByPk(id_aluno);

    if (!aux) {
      
      return res.json("Aluno não encontrado!");

    }

    await aux.destroy();

    return res.json("Aluno excluído!");
    
  }
}

export default new AlunoController();
