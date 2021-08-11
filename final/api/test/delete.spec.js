import chai from 'chai';
import chaiHttp from 'chai-http';
import taskmodel from '../models/task'

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('delete', () => {

    context('quando apago uma tarefa', () => {

        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'Comprar arroz',
            owner: 'teste@teste.com',
            done: true
        }

        before((done) => {
            taskmodel.insertMany([task]);
            done();
        })

        it('deve retornar um status 200', (done) => {
            request
                .delete('/task/' + task._id)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.eql({});
                    done();
                })

        })

        after((done) => {
            request
                .get('/task/' + task._id)
                .end((err, res) => {
                    expect(res).to.has.status(404);
                    expect(res.body).to.eql({});
                    done();
                })
        })
    })

    context('quando a tarefa não existe', () => {

        it('deve retornar um status 404', (done) => {

            let id = require('mongoose').Types.ObjectId();

            request
                .delete('/task/' + id)
                .end((err, res) => {
                    expect(res).to.has.status(404);
                    expect(res.body).to.eql({});
                    done();
                })

        })

    })

})