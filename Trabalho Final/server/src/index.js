const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('API do SGCPD está funcionando!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});