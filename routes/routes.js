const getTask = require('../controllers/getTasks')
const getCategories = require('../controllers/upProdCategories')
const sendProducts = require('../controllers/upProd')
const sendImages = require('../controllers/sendImages')
const express = require('express');
const router = express.Router();

// Carregar todas as tarefas no sistema Auvo
router.get('/api/gettask', (req, res) => {
    getTask.iniciar(); // Executa a função iniciar apenas quando a rota for acessada
    res.send('Rota gettask executada com sucesso!');
});

//Listagem das categorias de produtos no sistema Auvo.
/* router.get('/api/listacategoriasprodutos', (req, res)=> {
    getCategories.iniciar();
    res.send('Executou a rota')

});  */

// Envio do cadastro de produtos para o sistema auvo. Primeira carga apenas
/* router.get('/api/enviaprodutos', (req, res)=> {
    sendProducts.iniciar();
    res.send('Executou a rota')

}); */


//Envio de imagens para o sistema auvo. Primeira carga apenas
/* router.get('/api/enviaimagens', (req, res)=> {
    sendImages.iniciar();
    res.send('Executou a rota de imagens')

}); 
 */


module.exports = router;