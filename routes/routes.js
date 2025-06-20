const getTask = require("../controllers/getTasks");
const getCategories = require("../controllers/upProdCategories");
const sendProducts = require("../controllers/upProd");
const sendImages = require("../controllers/sendImages");
const upSingleProduct = require("../controllers/updateSingleProduct");
const newSingleProduct = require("../controllers/newSingleProduct");
const newSingleImage = require("../controllers/newSingleImage");
const syncStock = require("../controllers/syncStock");
const newSingleCategory = require("../controllers/newSingleCategorie");
const getGensets = require("../controllers/getGensets");
const express = require("express");
const getClients = require("../controllers/getClients");
const getReports = require("../controllers/getReports");
const upGenset = require("../controllers/upGenset");
const reviwClients = require("../controllers/reviewClients");
const getOs = require("../controllers/getOs");
const upClients = require("../controllers/upClients");
const getReportId = require("../controllers/getReportId");
const getReportsByDate = require("../controllers/getTasks");
const reviewTasks = require("../controllers/reviewTasks");
const getMails = require('../controllers/getMails');
const reportAnalysis = require('../controllers/reportAnalysis');
const router = express.Router();

// Carregar todas as tarefas no sistema Auvo
 router.get("/auvoapp/gettask", (req, res) => {
  getTask.iniciar(); // Executa a função iniciar apenas quando a rota for acessada
  res.send("Rota gettask executada com sucesso!");
}); 


router.get("/auvoapp/upclients", (req, res) => {
  upClients.iniciar(); // Executa a função iniciar apenas quando a rota for acessada
  res.send("Rota upClients executada com sucesso!");
});

router.get("/auvoapp/getmails", (req, res) => {
  getMails.iniciar(); // Executa a função iniciar apenas quando a rota for acessada
  res.send("Rota getmails rodou com sucesso!");
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

router.get("/auvoapp/updateproduct/:id", (req, res) => {
  upSingleProduct.iniciar(req, res);
  res.send("Executou a rota de update de produto");
});

router.get("/auvoapp/newproduct/:id", (req, res) => {
  newSingleProduct.iniciar(req, res);
  res.send("Executou a rota de novo produto");
});

router.get("/auvoapp/newimage/:id", (req, res) => {
  newSingleImage.iniciar(req, res);
  res.send("Executou a rota de nova imagem");
});

router.get("/auvoapp/syncstock/:id", (req, res) => {
  syncStock.iniciar(req, res);
  res.send("Executou a rota de sincronização de estoque");
});

router.get("/auvoapp/sendsinglecategory/:id", (req, res) => {
  newSingleCategory.iniciar(req, res);
  res.send("Executou a rota de nova categoria");
});

router.get("/auvoapp/getclients", (req, res) => {
  getClients.iniciar(req, res);
});

router.get("/auvoapp/getgensets", (req, res) => {
  getGensets.iniciar(req, res);
});
router.get("/auvoapp/getreports", (req, res) => {
  getReports.iniciar(req, res);
});

router.get("/auvoapp/upgensets", (req, res) => {
  upGenset.iniciar(req, res);
});

router.get("/auvoapp/clientreview", (req, res) => {
  reviwClients.iniciar(req, res);
});

router.get("/auvoapp/getos", (req, res) => {
  getOs.iniciar(); // Executa a função iniciar apenas quando a rota for acessada
  res.send("Rota getos executada com sucesso!");
});

router.get("/auvoapp/getreportid/:id", (req, res) => {
  let reportId = req.params.id
  getReportId.iniciar(reportId); // Executa a função iniciar apenas quando a rota for acessada
  res.send("Rota getReportId executada com sucesso!");
});

router.get("/auvoapp/reviewtasks", (req,res) =>{
  reviewTasks.iniciar();
  res.send("Review Tasks Iniciada")
})

router.get("/auvoapp/reportanalysis", (req, res) => {
  let reportId = req.params.id
  reportAnalysis.iniciar(reportId); // Executa a função iniciar apenas quando a rota for acessada
  res.send("Rota reportAnalysis executada com sucesso!");
});


 

module.exports = router;