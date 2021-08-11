var chai = require("chai");
var chaiHttp = require("chai-http");

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request(app);

const expect = chai.expect;

describe("suite", () => {

	it("meu primeio teste", () => {
		expect(1).to.equals(1);
	})

	it("deve retornar uma mensagem", (done) => {
		request
			.get("/hello")
			.end((err, res) => {
				expect(res.body.message).to.equals("Olá, NodeJS com express");
				done();
			})
	})
})
