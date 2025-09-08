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