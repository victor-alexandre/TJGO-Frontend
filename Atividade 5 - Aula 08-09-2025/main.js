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