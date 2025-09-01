const form = document.getElementById('imcForm');
const alturaInput = document.getElementById('altura');
const pesoInput = document.getElementById('peso');
const limparBtn = document.getElementById('limpar');
const resultadoDiv = document.getElementById('resultado');
const tabelaDiv = document.getElementById('tabela-container');
const valorImcSpan = document.getElementById('valorImc');
const situacaoSpan = document.getElementById('situacao');
const grauObesidadeSpan = document.getElementById('grauObesidade');
const mensagemErroP = document.getElementById('mensagemErro');

const alturaMask = IMask(alturaInput, {
    mask: '0,00',
    lazy: false
});

const pesoMask = IMask(pesoInput, {
    mask: [
        { mask: '0,00' },
        { mask: '00,00' },
        { mask: '000,00' }
    ],
    lazy: false
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    mensagemErroP.classList.add('d-none');
    resultadoDiv.classList.add('d-none');
    tabelaDiv.classList.add('d-none');

    const alturaUnmasked = alturaMask.unmaskedValue;
    const pesoUnmasked = pesoMask.unmaskedValue;
    const altura = parseFloat(alturaUnmasked) / 100;
    const peso = parseFloat(pesoUnmasked) / 100;

    if (isNaN(altura) || isNaN(peso) || altura <= 0 || peso <= 0) {
        mensagemErroP.textContent = "Por favor, preencha a altura e o peso corretamente.";
        mensagemErroP.classList.remove('d-none');
        return;
    }

    const imc = peso / (altura * altura);
    const imcArredondado = imc.toFixed(2).replace('.', ',');
    const classificacao = getClassificacao(imc);

    valorImcSpan.textContent = imcArredondado;
    situacaoSpan.textContent = classificacao.situacao;
    grauObesidadeSpan.textContent = classificacao.grau;

    const cores = ['bg-danger', 'bg-warning', 'bg-success', 'bg-primary'];
    valorImcSpan.classList.remove(...cores);
    situacaoSpan.classList.remove(...cores);
    grauObesidadeSpan.classList.remove(...cores);

    valorImcSpan.classList.add(classificacao.cor);
    situacaoSpan.classList.add(classificacao.cor);
    grauObesidadeSpan.classList.add(classificacao.cor);

    resultadoDiv.classList.remove('d-none');
    tabelaDiv.classList.remove('d-none');
});

limparBtn.addEventListener('click', function () {
    alturaMask.value = '';
    pesoMask.value = '';

    resultadoDiv.classList.add('d-none');
    tabelaDiv.classList.add('d-none');
    mensagemErroP.classList.add('d-none');
});

function getClassificacao(imc) {
    if (imc < 16) {
        return { situacao: 'Magreza grave', grau: '-', cor: 'bg-danger' };
    } else if (imc <= 16.9) {
        return { situacao: 'Magreza moderada', grau: '-', cor: 'bg-danger' };
    } else if (imc <= 18.5) {
        return { situacao: 'Magreza leve', grau: '-', cor: 'bg-warning' };
    } else if (imc <= 24.9) {
        return { situacao: 'Peso ideal', grau: '0', cor: 'bg-success' };
    } else if (imc <= 29.9) {
        return { situacao: 'Sobrepeso', grau: '-', cor: 'bg-warning' };
    } else if (imc <= 34.9) {
        return { situacao: 'Obesidade', grau: 'I', cor: 'bg-danger' };
    } else if (imc <= 39.9) {
        return { situacao: 'Obesidade severa', grau: 'II', cor: 'bg-danger' };
    } else {
        return { situacao: 'Obesidade mórbida', grau: 'III', cor: 'bg-danger' };
    }
}