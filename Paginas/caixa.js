// Variáveis Globais
let mesas = [];
let mesaSelecionadaId = null;
let pedidosMesas = {}; // Simula pedidos por mesa (provisório)
let pedidosLevar = []; // NOVO: Simula pedidos para levar (provisório)

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initCaixa();
    setupEventListeners();
    carregarTemaSalvo();
});

// Inicialização Principal
async function initCaixa() {
    try {
        await carregarMesas();
        simularPedidosIniciais();
        renderizarMesas();
        renderizarPedidosLevar(); // Chamada para renderizar pedidos levar
    } catch (error) {
        console.error('Erro ao inicializar caixa:', error);
        alert('Erro ao carregar dados. Verifique o console.');
    }
}


// Carregar Mesas da API
async function carregarMesas() {
    // Defina seu NOVO número de mesas desejado (Exemplo: 15)
    const NOVO_PADRAO_MESAS = 15;

    console.log('✅ Mesas carregadas (fallback):', mesas.length);
    
    try {
        const response = await fetch('/api/config/mesas');
        const config = await response.json();
        // Mude o fallback do bloco try para o NOVO_PADRAO_MESAS
        const qtdMesas = NOVO_PADRAO_MESAS || config.quantidadeMesas; 
        mesas = Array.from({ length: qtdMesas }, (_, i) => ({
            id: i + 1,
            numero: i + 1,
            ocupada: false
        }));
        console.log('✅ Mesas carregadas da API:', mesas.length);
    } catch (error) {
        // Mude o valor do bloco catch para o NOVO_PADRAO_MESAS
        mesas = Array.from({ length: NOVO_PADRAO_MESAS }, (_, i) => ({
            id: i + 1,
            numero: i + 1,
            ocupada: false
        }));
        console.log('✅ Mesas carregadas (fallback):', mesas.length);
    }
}

// Simular Pedidos para Levar
function simularPedidosLevarIniciais() {
    pedidosLevar = [
        {
            id: 101,
            nomeCliente: 'Ana Silva',
            status: 'Pronto', // Borda Verde
            itens: [
                { id: 10, nome: 'Milkshake Morango', preco: 15.00, quantidade: 1 },
                { id: 11, nome: 'Empada de Frango', preco: 9.90, quantidade: 3 },
                { id: 120, nome: 'Milkshake Morango', preco: 15.00, quantidade: 1 },
                { id: 141, nome: 'Empada de Frango', preco: 9.90, quantidade: 3 },
                { id: 130, nome: 'Milkshake Morango', preco: 15.00, quantidade: 1 },
                { id: 151, nome: 'Empada de Frango', preco: 9.90, quantidade: 3 },
                { id: 104, nome: 'Milkshake Morango', preco: 15.00, quantidade: 1 },
                { id: 181, nome: 'Empada de Frango', preco: 9.90, quantidade: 3 },
                { id: 190, nome: 'Milkshake Morango', preco: 15.00, quantidade: 1 },
                { id: 171, nome: 'Empada de Frango', preco: 9.90, quantidade: 3 },
                { id: 190, nome: 'Milkshake Morango', preco: 15.00, quantidade: 1 },
                { id: 171, nome: 'Empada de Frango', preco: 9.90, quantidade: 3 }
            ]
        },
        {
            id: 102,
            nomeCliente: 'Bruno Mendes',
            status: 'Aguardando', // Borda Vermelha
            itens: [
                { id: 12, nome: 'Açaí Grande com Frutas', preco: 22.00, quantidade: 1 }
            ]
        },
         {
            id: 103,
            nomeCliente: 'Carlos Fedasrreira',
            status: 'Preparando', // Borda Amarela
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        },
        {
            id: 104,
            nomeCliente: 'Carlos Ferdareira',
            status: 'Preparando', // Borda Amarela
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        },
         {
            id: 105,
            nomeCliente: 'Carlos Ferrseira',
            status: 'Preparando', // Borda Amarela
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        },
         {
            id: 106,
            nomeCliente: 'Carlos Fedsadarreira',
            status: 'Preparando', // Borda Amarela
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        },
         {
            id: 107,
            nomeCliente: 'Carlos Fedsadarreira',
            status: 'Preparando', // Borda Amarela
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        }

    ];
}


// Simular Pedidos Iniciais (Mesas e Levar)
function simularPedidosIniciais() {
    pedidosMesas[1] = [
        { id: 1, nome: 'X-Burger Clássico', preco: 25.90, quantidade: 2 },
        { id: 2, nome: 'Batata Frita Grande', preco: 18.00, quantidade: 1 },
        { id: 3, nome: 'Coca-Cola 350ml', preco: 6.50, quantidade: 2 }
    ];
    mesas[0].ocupada = true;

    pedidosMesas[3] = [
        { id: 4, nome: 'Pizza Margherita', preco: 45.90, quantidade: 1 },
        { id: 5, nome: 'Suco Natural Laranja', preco: 8.90, quantidade: 2 }
    ];
    mesas[2].ocupada = true;

    pedidosMesas[5] = [
        { id: 6, nome: 'Filé com Fritas', preco: 38.90, quantidade: 1 }
    ];
    mesas[4].ocupada = true;
    
    // Chamada para popular os pedidos para levar
    simularPedidosLevarIniciais(); 
}

// Renderizar Grid de Mesas
function renderizarMesas() {
    const mesasGrid = document.getElementById('mesasGrid');
    mesasGrid.innerHTML = '';

    console.log('🎨 Renderizando mesas no DOM:', mesas.length);

    mesas.forEach(mesa => {
        const mesaCard = document.createElement('div');
        mesaCard.className = `mesa-card ${mesa.ocupada ? 'ocupada' : 'vazia'}`;
        mesaCard.dataset.mesaId = mesa.id;
        mesaCard.innerHTML = `
            <div class="mesa-numero">${mesa.numero}</div>
            <div class="mesa-status">${mesa.ocupada ? 'Ocupada' : 'Vazia'}</div>
        `;
        mesaCard.addEventListener('click', () => selecionarMesa(mesa.id));
        mesasGrid.appendChild(mesaCard);
    });

    console.log('✅ Total de cards de mesa criados:', mesasGrid.children.length);
}

// Renderizar Pedidos para Levar
function renderizarPedidosLevar() {
    const levarList = document.getElementById('levarList');
    levarList.innerHTML = ''; 

    if (pedidosLevar.length === 0) {
        levarList.innerHTML = `<div class="empty-state">Nenhum pedido para levar no momento.</div>`;
        return;
    }

    pedidosLevar.forEach(pedido => {
        const total = pedido.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        
        const pedidoDiv = document.createElement('div');
        
        // LÓGICA DE CLASSE DO STATUS NO CARTÃO:
        let statusClassCard = '';
        if (pedido.status === 'Pronto') {
            statusClassCard = 'pronto';
        } else if (pedido.status === 'Aguardando') {
            statusClassCard = 'aguardando';
        } else if (pedido.status === 'Preparando') {
            statusClassCard = 'preparando';
        }

        pedidoDiv.className = `levar-card ${statusClassCard}`; 
        
        pedidoDiv.dataset.pedidoId = pedido.id;
        
        // Lógica de classe do status para o TEXTO
        let statusClass = '';
        if (pedido.status === 'Pronto') {
            statusClass = 'status-pronto';
        } else if (pedido.status === 'Preparando') {
            statusClass = 'status-preparando';
        } else {
            statusClass = 'status-aguardando';
        }

        pedidoDiv.innerHTML = `
            <div class="levar-header">
                <div class="levar-info-cliente">
                    <span class="levar-label">Cliente:</span>
                    <span class="levar-nome"><strong>${pedido.nomeCliente}</strong></span>
                </div>
                <span class="levar-id">#${pedido.id}</span>
            </div>
            <div class="levar-details">
                <span class="levar-status ${statusClass}">${pedido.status}</span>
                <span class="levar-total">Total: <strong>R$ ${total.toFixed(2)}</strong></span>
            </div>
        `;
        pedidoDiv.addEventListener('click', () => selecionarPedidoLevar(pedido.id));

        levarList.appendChild(pedidoDiv);
    });
}

// Selecionar Mesa (AGORA COM LÓGICA DE TOOGLE)
function selecionarMesa(mesaId) {
    // 1. Remove seleção dos pedidos levar
    document.querySelectorAll('.levar-card').forEach(card => card.classList.remove('selecionada'));
    
    const cardSelecionado = document.querySelector(`[data-mesa-id="${mesaId}"]`);
    
    // 2. Verifica se o cartão JÁ ESTÁ selecionado
    const estaSelecionada = cardSelecionado && cardSelecionado.classList.contains('selecionada');

    // 3. Remove a seleção de TODAS as mesas
    document.querySelectorAll('.mesa-card').forEach(card => card.classList.remove('selecionada'));

    // 4. Se a mesa estava selecionada, deseleciona (feito no passo 3) e limpa a área de itens, mostrando o placeholder.
    if (estaSelecionada) {
        // Limpa a variável global de mesa selecionada
        mesaSelecionadaId = null; 
        
        document.querySelector('.itens-container').innerHTML = `
            <div id="itensPlaceholder" class="placeholder-state">
                <p>Selecione um pedido para visualizar os itens.</p>
            </div>
        `;
    } 
    // 5. Se a mesa NÃO estava selecionada, selecione ela e renderize os detalhes.
    else {
        // Atualiza a variável global
        mesaSelecionadaId = mesaId;

        if (cardSelecionado) {
            cardSelecionado.classList.add('selecionada');
        }
        renderizarItensMesa(mesaId);
    }
}

// Selecionar Pedido Levar (COM LÓGICA DE TOOGLE)
function selecionarPedidoLevar(pedidoId) {
    // Remove seleção das mesas
    document.querySelectorAll('.mesa-card').forEach(card => card.classList.remove('selecionada'));

    const cardSelecionado = document.querySelector(`[data-pedido-id="${pedidoId}"]`);
    
    // 1. Verifica se o cartão JÁ ESTÁ selecionado
    const estaSelecionado = cardSelecionado && cardSelecionado.classList.contains('selecionada');

    // 2. Remove a seleção de TODOS os cartões levar
    document.querySelectorAll('.levar-card').forEach(card => card.classList.remove('selecionada'));
    
    // 3. Se o cartão estava selecionado, deseleciona (feito no passo 2) e limpa a área de itens, mostrando o placeholder.
    if (estaSelecionado) {
        document.querySelector('.itens-container').innerHTML = `
            <div id="itensPlaceholder" class="placeholder-state">
                <p>Selecione um pedido para visualizar os itens.</p>
            </div>
        `;
    } 
    // 4. Se o cartão NÃO estava selecionado, selecione ele e renderize os detalhes.
    else {
        if (cardSelecionado) {
            cardSelecionado.classList.add('selecionada');
        }
        renderizarItensPedidoLevar(pedidoId);
    }
}

// Renderizar Itens da Mesa Selecionada
function renderizarItensMesa(mesaId) {
    let itensContainer = document.querySelector('.itens-container');
    
    // Limpa o container inteiro (removendo o placeholder inicial)
    itensContainer.innerHTML = ''; 

    // Adiciona o título
    itensContainer.innerHTML = `<h2>Mesa ${mesaId}</h2>`; 

    const pedidos = pedidosMesas[mesaId] || [];

    if (pedidos.length === 0) {
        // Se não houver pedidos, adiciona o estado vazio
        itensContainer.innerHTML += `<div class="empty-state"><p>🍽️ Esta mesa não possui pedidos</p></div>`;
        return;
    }

    // Se houver pedidos, renderiza os itens
    pedidos.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-pedido';
        itemDiv.innerHTML = `
            <div class="item-info">
                <h4>${item.nome}</h4>
                <div class="item-detalhes">
                    <span>Qtd: ${item.quantidade}</span>
                    <span>Unit: R$ ${item.preco.toFixed(2)}</span>
                </div>
            </div>
            <div class="item-valor">
                <div class="item-preco">R$ ${subtotal.toFixed(2)}</div>
            </div>
        `;
        itensContainer.appendChild(itemDiv);
    });
}

// Renderizar Itens do Pedido Levar
function renderizarItensPedidoLevar(pedidoId) {
    let itensContainer = document.querySelector('.itens-container');
    itensContainer.innerHTML = ''; 

    const pedido = pedidosLevar.find(p => p.id === pedidoId);
    
    // Adiciona o título dinâmico
    itensContainer.innerHTML = `<h2>Pedido #${pedidoId} (${pedido.nomeCliente})</h2>`;

    if (!pedido || pedido.itens.length === 0) {
        itensContainer.innerHTML += `<div class="empty-state"><p>Nenhum item neste pedido.</p></div>`;
        return;
    }

    pedido.itens.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-pedido';
        itemDiv.innerHTML = `
            <div class="item-info">
                <h4>${item.nome}</h4>
                <div class="item-detalhes">
                    <span>Qtd: ${item.quantidade}</span>
                    <span>Unit: R$ ${item.preco.toFixed(2)}</span>
                </div>
            </div>
            <div class="item-valor">
                <div class="item-preco">R$ ${subtotal.toFixed(2)}</div>
            </div>
        `;
        itensContainer.appendChild(itemDiv);
    });
}


// Setup Event Listeners
function setupEventListeners() {
    const botaoDarkMode = document.getElementById('botaoDarkMode');
    if (botaoDarkMode) {
        botaoDarkMode.addEventListener('click', toggleDarkMode);
    }
}

// Dark Mode
function toggleDarkMode() {
    const body = document.body;
    const modoAtual = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', modoAtual);
    localStorage.setItem("modoEscuro", modoAtual === 'dark');

    const checkbox = document.getElementById('botaoDarkMode');
    if (checkbox) checkbox.checked = modoAtual === 'dark';
}

// Carregar Tema Salvo
function carregarTemaSalvo() {
    const modoSalvoCaixa = localStorage.getItem("modoEscuro") === "true";
    const temaInicial = modoSalvoCaixa ? 'dark' : 'light';
    document.body.setAttribute('data-theme', temaInicial);

    const checkbox = document.getElementById('botaoDarkMode');
    if (checkbox) checkbox.checked = modoSalvoCaixa;
}