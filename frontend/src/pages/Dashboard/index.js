import React, { useEffect, useState } from 'react';

// components
import { Table, Button, Popup, Modal, Header, Icon, Form, Select } from 'semantic-ui-react'

//services
import api from '../../services/api';

// styles
import { Container, InitialText } from './styles';

const Dashboard = () => {
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState([]);
  const [cursos_aluno, setCursos_aluno] = useState([]);
  const [currentInfo, setCurrentInfo] = useState([]);
  const [modalInfos, setModalInfos] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalAddCursos, setModalAddCursos] = useState(false);
  const [modalListCursos, setModalListCursos] = useState(false);

  useEffect(()=>{
    async function fetchData() {
      try{
        const alunosResponse = await api.get('/alunos');
        setAlunos(alunosResponse.data);        
        const cursosResponse = await api.get('/cursos');
        const auxArray = cursosResponse.data.map((curso) => (
          {
            key: curso.nome,
            value: curso.nome,
            text: curso.nome
          }
        ))
        setCursos(auxArray);
      } catch {
        alert('Confira a api');
      }
    }
    fetchData();
  }, []);
  
  async function refresh_list_alunos() {

    const response = await api.get('/alunos');
    setAlunos(response.data);
    setModalAdd(false);
    setModalAddCursos(false);
    setModalInfos(false);

  }

  const render_modal_add_alunos = () => (
    <Modal open={modalAdd} onClose={()=>setModalAdd(false)} closeIcon>
    <Header content={`Adicionando aluno`} />
    <Modal.Content>
      <Form id='add_aluno' name='add_aluno' onSubmit={()=>addAluno()}>
        <Form.Group widths='equal'>
          <Form.Input fluid id='nome' name='nome' label='Nome' placeholder='Nome' />
          <Form.Input fluid id='email' name='email' label='Email' placeholder='Email' />
          <Form.Input fluid id='cep' name='cep' label='CEP' placeholder='CEP' />
        </Form.Group>
        <Form.Group>
          <Button onClick={()=>setModalAdd(false)} color='red'>
            <Icon name='remove' /> Cancelar
          </Button>
          <Button type='submit 'color='green'>
            <Icon name='checkmark' /> Adicionar
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
    </Modal>
  )
  
  const render_modal_info_alunos = () => (
    <Modal open={modalInfos} onClose={()=>setModalInfos(false)} closeIcon>
    <Header content={`Editando informações de ${currentInfo.nome}`} />
    <Modal.Content>
      <Form id='edit_aluno' name='edit_aluno'>
        <Form.Group widths='equal'>
          <Form.Input fluid id='nome' name='nome' label='Nome' placeholder='Nome' value={currentInfo.nome} onChange={(e)=>setCurrentInfo({...currentInfo, nome: e.target.value})}/>
          <Form.Input fluid id='email' name='email' label='Email' placeholder='Email' value={currentInfo.email} onChange={(e)=>setCurrentInfo({...currentInfo, email: e.target.value})}/>
          <Form.Input fluid id='cep' name='cep' label='CEP' placeholder='CEP' value={currentInfo.cep} onChange={(e)=>setCurrentInfo({...currentInfo, cep: e.target.value})}/>
          <Form.Input fluid id='cidade' name='cidade' label='Cidade' placeholder='Cidade' value={currentInfo.cidade}/>
          <Form.Input fluid id='estado' name='estado' label='Estado' placeholder='Estado' value={currentInfo.estado}/>
        </Form.Group>
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={()=>setModalInfos(false)} color='red'>
        <Icon name='remove' /> Cancelar
      </Button>
      <Button color='green' onClick={()=>edit_aluno(currentInfo.id)}>
        <Icon name='checkmark' /> Salvar
      </Button>
    </Modal.Actions>
  </Modal>
  )

  function open_info_alunos(data_aluno) {
    setCurrentInfo(data_aluno)
    setModalInfos(true)
  }

  const render_modal_add_cursos = () => (
    <Modal open={modalAddCursos} onClose={()=>setModalAddCursos(false)} closeIcon>
      <Header content={`Adicionando cursos a ${currentInfo.nome}`} />
      <Modal.Content>
        <Select onChange={(e, { value } )=> {
          setCursoSelecionado(value)
          }} options={cursos}/>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={()=>setModalAddCursos(false)} color='red'>
          <Icon name='remove' /> Cancelar
        </Button>
        <Button color='green' onClick={()=>add_curso(currentInfo.id)}>
          <Icon name='checkmark' /> Adicionar curso
        </Button>
      </Modal.Actions>
    </Modal>
  )
  
  function open_add_cursos(data_cursos) {
    setCurrentInfo(data_cursos)
    setModalAddCursos(true)
  }

  const render_modal_list_cursos = () => (
    <Modal open={modalListCursos} onClose={()=>setModalListCursos(false)} closeIcon>
      <Header content={`Listando cursos de ${currentInfo.nome}`}/>
      <Modal.Content>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID Curso</Table.HeaderCell>
            <Table.HeaderCell>Nome</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { cursos_aluno.length > 0 ? render_cursos(currentInfo.id) : <h1>Nenhum curso registrado para este aluno!</h1>  }
        </Table.Body>
      </Table>
      </Modal.Content>
    </Modal>
  )
  
  async function open_list_cursos(data_list) {
    setCurrentInfo(data_list)
    const apiResponse = await api.get(`/alunos/${data_list.id}/cursos`);
    setCursos_aluno(apiResponse.data)
    setModalListCursos(true)
  }

  function render_alunos(){
    return alunos.map((v)=><Table.Row>
      <Table.Cell>{v.id}</Table.Cell>
      <Table.Cell>{v.nome}</Table.Cell>
      <Table.Cell>{v.email}</Table.Cell>
      <Table.Cell>{v.cep}</Table.Cell>
      <Table.Cell>{render_actions(v)}</Table.Cell>
    </Table.Row>)
  }
  
  function render_actions(data_aluno){
    return <center>
      <Popup
        trigger={<Button icon='edit' onClick={()=>open_info_alunos(data_aluno)} />}
        content="Editar informações"
        basic
      />
      <Popup
        trigger={<Button icon='close' onClick={()=>delete_aluno(data_aluno.id)} negative />}
        content="Excluir aluno"
        basic
      />   
      <Popup
        trigger={<Button icon='plus' onClick={()=>open_add_cursos(data_aluno)} positive />}
        content="Adicionar curso para aluno"
        basic
      /> 
      <Popup 
        trigger={<Button icon='clipboard outline' onClick={()=>open_list_cursos(data_aluno)}/>}
        content="Listar cursos do aluno"
        basic
      />        
    </center>
  }

  function render_cursos(id_aluno){
    return cursos_aluno.map((v)=><Table.Row>
      <Table.Cell>{v.id}</Table.Cell>
      <Table.Cell>{v.nome}</Table.Cell>
      <Table.Cell>      
        <Popup
          trigger={<Button icon='close' onClick={()=>delete_curso(id_aluno, v.id)} negative />}
          content="Excluir curso do aluno"
          basic
        />
      </Table.Cell>
    </Table.Row>)
  }

  async function addAluno() {  

    var data = {
      nome: document.forms['add_aluno'].elements['nome'].value,
      email: document.forms['add_aluno'].elements['email'].value,
      cep: document.forms['add_aluno'].elements['cep'].value
    };
    
    try{
      const response = await api.post('/alunos', data);
      window.alert(response.data);
      refresh_list_alunos();
    } catch {
      alert('Confira a api');
    }

  }

  async function edit_aluno(id_aluno) {

    var data = {
      nome: document.forms['edit_aluno'].elements['nome'].value,
      email: document.forms['edit_aluno'].elements['email'].value,
      cep: document.forms['edit_aluno'].elements['cep'].value
    };
    
    try{
      const response = await api.put(`/alunos/${id_aluno}`, data);
      window.alert(response.data);
      refresh_list_alunos();
    } catch {
      alert('Confira a api');
    }
    
  }

  async function delete_aluno(id_aluno) {
    
    if(window.confirm("Tem certeza que deseja EXCLUIR o aluno selecionado?")) {

      const response = await api.delete(`/alunos/${id_aluno}`);

      refresh_list_alunos();
    
      window.alert(response.data);
    
    }

  }

  async function add_curso(id_aluno) {
    
    var data = {
      nome: cursoSelecionado
    }

    const apiResponse = await api.post(`/alunos/${id_aluno}/cursos`, data)

    window.alert(apiResponse.data)

    setModalAddCursos(false)

  }

  async function delete_curso(id_aluno, id_curso) {
   
    if(window.confirm("Tem certeza que deseja REMOVER o aluno do curso selecionado?")) {
      
      const response = await api.delete(`/alunos/${id_aluno}/cursos/${id_curso}`);
    
      window.alert(response.data);

      setModalListCursos(false)
    
    }

  }

  return (
    <Container>
      <InitialText>Administrador de alunos</InitialText>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID Aluno</Table.HeaderCell>
            <Table.HeaderCell>Nome</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>CEP</Table.HeaderCell>
            <Table.HeaderCell>Ações</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { alunos.length > 0 ? render_alunos() : <h2>Nenhum dado registrado </h2> }
        </Table.Body>
      </Table>
      {render_modal_info_alunos()}
      {render_modal_add_alunos()}
      {render_modal_add_cursos()}
      {render_modal_list_cursos()}
      <Button primary onClick={()=>setModalAdd(true)}>Adicionar aluno</Button>
      <Button href="/" secondary>Ver instruções</Button>
    </Container>
  );
};

export default Dashboard;
