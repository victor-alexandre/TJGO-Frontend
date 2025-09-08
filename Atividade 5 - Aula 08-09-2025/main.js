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