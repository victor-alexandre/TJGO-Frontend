const btnCalcular = document.getElementById("btnCalcular");
const elementoResultado = document.getElementById("resultado");

function iniciarCalculo() {
    const numeroString = prompt("Digite um número para calcular o seu fatorial:");
    const numero = parseInt(numeroString);
    const resultadoFatorial = calcularFatorial(numero);

    if (typeof resultadoFatorial === 'number') {
        elementoResultado.textContent = `O fatorial de ${numero} é: ${resultadoFatorial}`;
    } else {
        elementoResultado.textContent = resultadoFatorial;
    }
}

function calcularFatorial(num) {
    if (isNaN(num) || num < 0) {
        return "Por favor, insira um número inteiro não negativo.";
    }

    if (num === 0) {
        return 1;
    }

    let resultado = 1;
    for (let i = num; i > 1; i--) {
        resultado = resultado * i;
    }

    return resultado;
}

btnCalcular.addEventListener('click', iniciarCalculo);