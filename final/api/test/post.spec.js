import chai from 'chai';
import chaiHttp from 'chai-http';
import taskmodel from '../models/task'

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;
const rabbit = chai.request.agent('http://localhost:15672')

describe('post', () => {

    context('quando cadastrar uma tarefa', () => {

        let task = { title: 'Estudar Tarefa 4', owner: 'teste@teste.com', done: false }

        before((done) => {
            rabbit
                .delete('/api/queues/%2F/tasksdev/contents')
                .auth('guest', 'guest')
                .end((err, res) => {
                    expect(res).to.has.status(204);
                    done();
                })
        })

        it('deve retornar o status 200', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data.title).to.be.an('string');
                    expect(res.body.data.owner).to.be.an('string');
                    expect(res.body.data.done).to.be.an('boolean');
                    done();
                })
        })

        it('e disparar um email', (done) => {

            let payload = { vhost: "/", name: "tasksdev", truncate: "50000", ackmode: "ack_requeue_true", encoding: "auto", count: "1" }

            rabbit
                .post('/api/queues/%2F/tasksdev/get')
                .auth('guest', 'guest')
                .send(payload)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body[0].payload).to.contain(`Tarefa ${task.title} criada com sucesso!`)
                    done();
                })
        })
    })

    context('quando o titulo não é informado', () => {

        let task = { title: '', owner: 'teste@teste.com', done: false }

        it('deve retornar o status 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400);
                    expect(res.body.errors.title.message).to.eql('Oops. Title is required!');
                    done();
                })
        })
    })

    context('quando o owner não é informado', () => {

        let task = { title: 'Estude qualquer tarefa', owner: '', done: false }

        it('deve retornar o status 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400);
                    expect(res.body.errors.owner.message).to.eql('Oops. Owner is required!');
                    done();
                })
        })
    })

    context('quando o titulo é já existe', () => {

        let task = { title: 'Estude uma tarefa X', owner: 'teste@teste.com', done: false }

        before((done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    done();
                })
        })

        it('deve retornar o status 409', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(409);
                    expect(res.body.errmsg).to.include('duplicate key');
                    done();
                })
        })
    })
})