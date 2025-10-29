// server.js

const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser'); // Necessário: npm install csv-parser

const app = express();
const PORT = 3000;

// Caminhos dos arquivos
const CONFIG_FILE = path.join(__dirname, 'db', 'configuracoes.json');
const CARDAPIO_FILE = path.join(__dirname, 'cardapio.csv'); 

// Cache para armazenar o Cardápio na memória após a leitura do CSV
let cardapioCache = [];

// ----------------------------------------------------
// 1. MIDDLEWARES INICIAIS
// ----------------------------------------------------

// Processar dados JSON no corpo das requisições POST
app.use(express.json()); 

// Servir arquivos estáticos (CSS, JS do Garçom/Admin)
app.use(express.static(path.join(__dirname, 'Paginas'))); 

// Servir a pasta 'images' (para logos e ícones)
app.use('/images', express.static(path.join(__dirname, 'images')));

// ----------------------------------------------------
// 2. FUNÇÕES DE PERSISTÊNCIA (CONFIGURAÇÕES E CARDÁPIO)
// ----------------------------------------------------

/**
 * Lê o arquivo de configurações (Mesas).
 */
function lerConfiguracoes() {
    try {
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler configurações. Usando valor padrão (10 mesas).");
        // Cria um arquivo com valor padrão se não existir
        salvarConfiguracoes({ quantidadeMesas: 10 }); 
        return { quantidadeMesas: 10 };
    }
}

/**
 * Salva as configurações (Mesas) no arquivo JSON.
 */
function salvarConfiguracoes(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    } catch (error) {
        console.error("Erro ao salvar configurações:", error.message);
    }
}

/**
 * Lê e processa o arquivo CSV, populando o cache do Cardápio.
 */
function carregarCardapioDoCSV() {
    console.log("Carregando Cardápio do CSV...");
    
    cardapioCache = []; // Limpa o cache
    
    fs.createReadStream(CARDAPIO_FILE)
        .pipe(csv()) 
        .on('data', (data) => {
            // Conversão de tipos de string para número/float
            data.id = parseInt(data.id);
            data.preco = parseFloat(data.preco);

            // Adiciona o produto processado ao cache
            cardapioCache.push(data);
        })
        .on('end', () => {
            console.log(`Cardápio carregado: ${cardapioCache.length} produtos.`);
        })
        .on('error', (err) => {
            console.error("ERRO ao ler cardapio.csv:", err.message);
        });
}


// ----------------------------------------------------
// 3. ROTAS WEB
// ----------------------------------------------------

// Rota Inicial (home)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Paginas', 'inicio.html'));
});


// ----------------------------------------------------
// 4. ROTAS DE API (DADOS E CONFIGURAÇÕES)
// ----------------------------------------------------

// Rota GET: Retorna a quantidade de mesas salvas
app.get('/api/config/mesas', (req, res) => {
    const config = lerConfiguracoes();
    res.json({ quantidadeMesas: config.quantidadeMesas });
});

// Rota POST: Recebe e salva a nova quantidade de mesas
app.post('/api/config/mesas', (req, res) => {
    const { quantidadeMesas } = req.body;

    if (typeof quantidadeMesas !== 'number' || quantidadeMesas <= 0) {
        return res.status(400).json({ erro: "Número de mesas inválido." });
    }

    const config = lerConfiguracoes();
    config.quantidadeMesas = quantidadeMesas;
    
    salvarConfiguracoes(config);

    console.log(`[ADMIN] Nova quantidade de mesas salva: ${quantidadeMesas}`);
    res.status(200).json({ 
        mensagem: "Quantidade de mesas atualizada com sucesso.", 
        quantidadeMesas: quantidadeMesas 
    });
});

// Rota GET: Retorna a lista completa de produtos do cardápio (do cache CSV)
app.get('/api/cardapio', (req, res) => {
    res.json(cardapioCache); 
});

// Rota POST: Recarrega o Cardápio (útil para Admin após editar o CSV)
app.post('/api/cardapio/recarregar', (req, res) => {
    carregarCardapioDoCSV();
    res.json({ mensagem: "Cardápio recarregado com sucesso a partir do CSV." });
});

// Rota POST: Recebe o pedido do garçom
app.post('/api/pedidos', (req, res) => {
    const novoPedido = req.body;
    console.log('-------------------------------------------');
    console.log('NOVO PEDIDO RECEBIDO:');
    console.log(`Destino: ${novoPedido.destino}`);
    if (novoPedido.cliente) {
        console.log(`Cliente: ${novoPedido.cliente}`);
    }
    console.log(`Total: R$ ${novoPedido.total.toFixed(2)}`);
    console.log(`Itens: ${novoPedido.itens.length}`);
    console.log('-------------------------------------------');

    // Retorna a confirmação para o garçom
    res.status(201).json({ 
        mensagem: 'Pedido enviado com sucesso para a cozinha!',
        id: Date.now() 
    });
});


// ----------------------------------------------------
// 5. INICIA O SERVIDOR
// ----------------------------------------------------

// Carrega o Cardápio do CSV na inicialização
carregarCardapioDoCSV(); 

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});