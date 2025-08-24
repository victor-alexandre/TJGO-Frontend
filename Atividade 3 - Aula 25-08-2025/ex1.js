// Exercicio 1 - Calculo da média do aluno
let nome = prompt("Digite o nome do aluno:");
let disciplina = prompt("Digite o nome da disciplina:");
let nota1 = parseFloat(prompt("Digite a primeira nota:"));
let nota2 = parseFloat(prompt("Digite a segunda nota:"));

// Calcula a média
let media = (nota1 + nota2) / 2;

// Imprime o resultado na tela
console.log(
  `Aluno: ${nome}\nDisciplina: ${disciplina}\nNota 1: ${nota1}\nNota 2: ${nota2}\nMédia: ${media.toFixed(2)}`
);