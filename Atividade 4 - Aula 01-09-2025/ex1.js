// ex1.js
document.addEventListener('DOMContentLoaded', () => {
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const operatorSelect = document.getElementById('operator');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultInput = document.getElementById('result');

    calculateBtn.addEventListener('click', () => {
        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);
        const operator = operatorSelect.value;

        // Validação de campos vazios e entrada numérica
        if (isNaN(num1) || !Number.isFinite(num1)) {
            resultInput.value = 'Erro: Número 1 inválido.';
            resultInput.style.color = 'red';
            num1Input.focus();
            return;
        }
        if (isNaN(num2) || !Number.isFinite(num2)) {
            resultInput.value = 'Erro: Número 2 inválido.';
            resultInput.style.color = 'red';
            num2Input.focus();
            return;
        }

        let result;
        let errorMessage = '';

        // Lógica de cálculo e validação de divisão por zero
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 === 0) {
                    errorMessage = 'Erro: Divisão por zero não permitida.';
                } else {
                    result = num1 / num2;
                }
                break;
            default:
                errorMessage = 'Erro: Operador inválido.';
        }

        // Exibir resultado ou mensagem de erro
        if (errorMessage) {
            resultInput.value = errorMessage;
            resultInput.style.color = 'red';
        } else {
            resultInput.value = result.toFixed(2);
            resultInput.style.color = '#333';
        }
    });

    // Funcionalidade - Botão Limpar   
    clearBtn.addEventListener('click', () => {
        num1Input.value = '';
        num2Input.value = '';
        operatorSelect.selectedIndex = 0;
        resultInput.value = '';
        resultInput.style.color = '#333';
        num1Input.focus();
    });

    // Limpar mensagem de erro quando o usuário digita novamente
    [num1Input, num2Input, operatorSelect].forEach(input => {
        input.addEventListener('input', () => {
            if (resultInput.style.color === 'red') {
                resultInput.value = '';
                resultInput.style.color = '#333';
            }
        });
    });
});