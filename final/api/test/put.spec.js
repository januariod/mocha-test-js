import chai from 'chai';
import chaiHttp from 'chai-http';
import taskmodel from '../models/task'

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('put', () => {

    context('quando alterar uma tarefa', () => {

        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'Comprar XYZ',
            owner: 'teste@teste.com',
            done: false
        }

        before((done) => {
            taskmodel.insertMany([task]);
            done();
        })

        it('deve retornar um status 200', (done) => {
            task.title = 'Comprar ABC'
            task.done = true

            request
                .put('/task/' + task._id)
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.eql({});
                    done();
                })

        })

        it('deve retornar dados atualizados', (done) => {
            request
                .get('/task/' + task._id)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data.title).to.eql(task.title);
                    expect(res.body.data.done).to.be.true;
                    done();
                })

        })
    })
})