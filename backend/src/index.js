const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const port = 3333;

mongoose.connect('mongodb+srv://matheus:matheus@omnistack10-kyecw.mongodb.net/test?retryWrites=true&w=majority', {
    useCreateIndex: true,    
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Backend rodando na porta ${port}`);
});