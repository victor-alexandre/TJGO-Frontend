/* 
*Realize um programa em Java Script que calculará se o valor 
*informado será par ou ímpar. O programa irá pedir um número e ao final, 
*irá mostrar o seguinte resultado: O número <número_informado> que foi
*digitado é <par_ou_impar>!
*/

//Função responsável por verificar se o número é par ou ímpar
function parOuImpar(numero) {
   (numero % 2 === 0) ?  
   alert("O número " + numero  + " que foi digitado é par!") 
   : alert("O número " + numero  + " que foi digitado é ímpar!");
}

let numeroDigitado = prompt("Digite um número para verificação:");

//Bloco responsável por converter para um número
numeroDigitado  = parseInt(numeroDigitado);

// Condicional responsável por verificar se é um número válido, de modo a prosseguir
// com as verificações se é par ou impar
if (isNaN(numeroDigitado)) {
    alert("O número digitado não é um número válido!");
} else {
  parOuImpar(numeroDigitado)
}
