const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema');
const path = require('path');
const { _directives } = require('./schema');

const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true
    })
);

app.use(express.static('public'));

app.get('*', (req, res) =>{
    res.sendFile(path.resolve(_dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
 