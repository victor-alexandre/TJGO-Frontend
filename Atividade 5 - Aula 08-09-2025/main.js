class Pessoa {
    constructor(nome, cpf) {
        this.nome = nome;
        this.cpf = cpf;
    }

    get nome() {
        return this.nome;
    }

    set nome(novoNome) {
        this.nome = novoNome;
    }

    get cpf() {
        return this.cpf;
    }

    set cpf(novoCpf) {
        this.cpf = novoCpf;
    }

    mostrarDadosPessoa() {
        console.log(`Nome: ${this.nome}, CPF: ${this.cpf}`);
    }
}

class Morador extends Pessoa {
    constructor(nome, cpf, codigoAcesso) {
        super(nome, cpf);
        this.codigoAcesso = codigoAcesso;
    }

    get codigoAcesso() {
        return this.codigoAcesso;
    }

    set codigoAcesso(novoCodigo) {
        this.codigoAcesso = novoCodigo;
    }

    mostrarDadosMorador() {
        this.mostrarDadosPessoa();
        console.log(`Código de Acesso: ${this.codigoAcesso}`);
    }
}

class Edificio {
    constructor(nome, endereco, bairro, cidade, uf) {
        this.nome = nome;
        this.endereco = endereco;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
    }

    get nome() {
        return this.nome;
    }

    set nome(novoNome) {
        this.nome = novoNome;
    }

    get endereco() {
        return this.endereco;
    }

    set endereco(novoEndereco) {
        this.endereco = novoEndereco;
    }

    get bairro() {
        return this.bairro;
    }

    set bairro(novoBairro) {
        this.bairro = novoBairro;
    }

    get cidade() {
        return this.cidade;
    }

    set cidade(novaCidade) {
        this.cidade = novaCidade;
    }

    get uf() {
        return this.uf;
    }

    set uf(novaUf) {
        this.uf = novaUf;
    }

    mostrarDadosEdificio() {
        console.log(`Nome: ${this.nome}, Endereço: ${this.endereco}, Bairro: ${this.bairro}, Cidade: ${this.cidade}, UF: ${this.uf}`);
    }
}

class Apartamento {
    constructor(numero, andar, bloco, edificio, morador) {
        this.numero = numero;
        this.andar = andar;
        this.bloco = bloco;
        this.edificio = edificio;
        this.morador = morador;
    }

    get numero() {
        return this.numero;
    }

    set numero(novoNumero) {
        this.numero = novoNumero;
    }

    get andar() {
        return this.andar;
    }

    set andar(novoAndar) {
        this.andar = novoAndar;
    }

    get bloco() {
        return this.bloco;
    }

    set bloco(novoBloco) {
        this.bloco = novoBloco;
    }

    get edificio() {
        return this.edificio;
    }

    set edificio(novoEdificio) {
        this.edificio = novoEdificio;
    }

    get morador() {
        return this.morador;
    }

    set morador(novoMorador) {
        this.morador = novoMorador;
    }

    mostrarDadosApartamento() {
        console.log(`Número: ${this.numero}, Andar: ${this.andar}, Bloco: ${this.bloco}`);
        this.edificio.mostrarDadosEdificio();
        this.morador.mostrarDadosMorador();
    }
}

const edificioResidencialSol = new Edificio(
    "Residencial Sol",
    "Rua das Flores, 123",
    "Centro",
    "Cidade Feliz",
    "SP"
);

const morador1 = new Morador("Ana Silva", "111.222.333-44", "ANA#101");
const morador2 = new Morador("Bruno Costa", "222.333.444-55", "BRUNO#102");
const morador3 = new Morador("Carlos Dias", "333.444.555-66", "CARLOS#201");
const morador4 = new Morador("Daniela Lima", "444.555.666-77", "DANI#202");
const morador5 = new Morador("Eduardo Souza", "555.666.777-88", "EDU#301");

const apartamento101 = new Apartamento(101, 1, "A", edificioResidencialSol, morador1);
const apartamento102 = new Apartamento(102, 1, "A", edificioResidencialSol, morador2);
const apartamento201 = new Apartamento(201, 2, "B", edificioResidencialSol, morador3);
const apartamento202 = new Apartamento(202, 2, "B", edificioResidencialSol, morador4);
const apartamento301 = new Apartamento(301, 3, "C", edificioResidencialSol, morador5);

apartamento101.mostrarDadosApartamento();
apartamento102.mostrarDadosApartamento();
apartamento201.mostrarDadosApartamento();
apartamento202.mostrarDadosApartamento();
apartamento301.mostrarDadosApartamento();