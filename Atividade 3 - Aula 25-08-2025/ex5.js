/*
* Realize um programa em Java Script que mostre a tabuada de um determinado número.
* O programa irá pedir um número e ao final, irá mostrar o cálculo completo da tabuada do mesmo.
*/

// Função responsável por calcular e exibir a tabuada de um número
function mostrarTabuada(numero) {
    let resultadoTabuada = `Tabuada do ${numero}:\n\n`; // Inicializa a string com o cabeçalho da tabuada

    // Loop para calcular e adicionar cada linha da tabuada (de 1 a 10)
    for (let i = 1; i <= 10; i++) {
        const produto = numero * i;
        resultadoTabuada += `${numero} x ${i} = ${produto}\n`;
    }

    alert(resultadoTabuada); // Exibe a tabuada completa em um alerta
}

// Solicita ao usuário que digite um número para a tabuada
let numeroDigitado = prompt("Digite um número para ver a tabuada:");

// Bloco responsável por converter a entrada do usuário para um número inteiro
numeroDigitado = parseFloat(numeroDigitado);

// Condicional responsável por verificar se a entrada é um número válido.
// Se for válido, prossegue com a exibição da tabuada; caso contrário, informa o erro.
if (isNaN(numeroDigitado)) {
    alert("O valor digitado não é um número válido! Por favor, digite um número.");
} else {
    mostrarTabuada(numeroDigitado); // Chama a função para mostrar a tabuada
}