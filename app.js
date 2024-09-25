const express = require('express');
const { body, matchedData, validationResult } = require('express-validator');
const app = express();
app.use(express.json());
const port = 3000;


//01
app.get('/', (req, res) => {
    res.send('Olá, mundo!');
  });


//02  
 app.get('/paginaPessoal/:user', (req, res)=>{
    const nome = req.params.user;
    res.send(`Seja bem-vindo, ${nome}!`);
 }) 


//03
const tokenDeAcesso = 'e633elalanlbnd';
const verificacaoAcesso = (req, res, next) => {
    const token = req.params.token;
    if (token == tokenDeAcesso) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/login/:token', verificacaoAcesso, (req, res)=>{
    res.send('Seja bem-vindo!');
});

//04
const frutas = [
    {id: 1, nome: "maçã", quantidade:5, valor: 1.5},
    {id: 2, nome: "banana", quantidade: 10, valor:5},
    {id: 3, nome: "goiaba", quantidade: 8, valor: 2}];

app.get('/buscar',(req,res)=>{
    const item = req.query.item;
    // res.send(frutas.filter((fruta)=>fruta["nome"].includes(item)));
    const result = frutas.filter((fruta)=>fruta["nome"].includes(item));
    if (result) throw new Error("erro");
    res.send(result);
    
    
});

//05
app.post('/frutas', (req,res)=>{
    console.log(req.body);
    const { body } = req;
    const novoItem = {id: frutas[frutas.length-1].id+1,...body}
    frutas.push(novoItem);
    return res.status(200).send(novoItem);
});

//06
const createUsuarioChain = () =>
    body("nome")
      .notEmpty()
      .withMessage("Campo nome obrigatório!")
      .isString()
      .withMessage("Campo nome tem que ter apenas letras!")
      .isLength({ min: 3, max: 10 });
  const createEmailChain = () =>
    body("email").notEmpty().withMessage("Campo e-mail obrigatório!").isEmail();
  
  
  const validacao =
    [createUsuarioChain(),
    createEmailChain(),
    (req, res, next) => {
      const resultado = validationResult(req);
      console.log(resultado);
      if (resultado.isEmpty()) {
        next();
       
      } else {
        res.status(500).send({ erros: resultado.array() });
        // throw new Error({erros: resultado.array()});
        
        
      }
     
  }];
  
  
  app.post("/usuario", validacao, (req, res) => {
        // throw new Error("teste de erro");

    const data = matchedData(req);
    return res.send(`Dados válidos!
              nome: ${data.nome}
              e-mail: ${data.email}`);
  });
  

//07
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
  });


app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`);
});