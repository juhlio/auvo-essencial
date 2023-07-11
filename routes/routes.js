const getTask = require('../controllers/getTasks')
const getCategories = require('../controllers/upProdCategories')
const sendProducts = require('../controllers/upProd')
const sendImages = require('../controllers/sendImages')
const express = require('express');
const router = express.Router();

// Rota GET para a rota gettask
router.get('/api/gettask', (req, res) => {
    getTask.iniciar(); // Executa a função iniciar apenas quando a rota for acessada
    res.send('Rota gettask executada com sucesso!');
});

/* router.get('/api/listacategoriasprodutos', (req, res)=> {
    getCategories.iniciar();
    res.send('Executou a rota')

}); */

/* router.get('/api/enviaprodutos', (req, res)=> {
    sendProducts.iniciar();
    res.send('Executou a rota')

}); */

 router.get('/api/enviaimagens', (req, res)=> {
    sendImages.iniciar();
    res.send('Executou a rota de imagens')

}); 



module.exports = router;