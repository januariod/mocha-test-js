import chai from 'chai';
import chaiHttp from 'chai-http';
import taskmodel from '../models/task'

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('get', () => {

    context('quando existe uma tarefa cadastrada', () => {

        before((done) => {

            let tasks = [
                { title: 'Estudar Tarefa 1', owner: 'teste@teste.com', done: false },
                { title: 'Tarefa 2', owner: 'teste@teste.com', done: false },
                { title: 'Estudar Tarefa 3', owner: 'teste@teste.com', done: true }
            ]

            taskmodel.insertMany(tasks);
            done();
        })

        it('deve retornar uma lista', (done) => {
            request
                .get('/task')
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data).to.be.an('array');
                    done();
                })
        })

        it('deve filtrar pelo titulo', (done) => {
            request
                .get('/task')
                .query({ title: 'Estudar' })
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data[0].title).to.equals('Estudar Tarefa 1');
                    expect(res.body.data[1].title).to.equals('Estudar Tarefa 3');
                    done();
                })
        })
    })

    context('quando busco por um id', () => {

        it('deve retornar uma unica tarefa', (done) => {
            let task = [
                { title: 'Aprender JavaScript', owner: 'teste@teste.com', done: false }
            ]

            taskmodel.insertMany(task, (err, result) => {
                let id = result[0]._id
                request
                    .get('/task/' + id)
                    .end((err, res) => {
                        expect(res).to.has.status(200);
                        expect(res.body.data.title).to.equals(task[0].title);
                        done();
                    })
            })
        })
    })

    context('quando a tarefa não existe', () => {

        it('deve retornar o status 404', (done) => {
            let id = require('mongoose').Types.ObjectId();
            request
                .get('/task/' + id)
                .end((err, res) => {
                    expect(res).to.has.status(404);
                    expect(res.body).to.eql({});
                    done();
                })
        })
    })
})