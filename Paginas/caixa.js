// Variáveis Globais
let mesas = [];
let mesaSelecionadaId = null;
let pedidosMesas = {};
let pedidosLevar = [];

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
        renderizarPedidosLevar();
    } catch (error) {
        console.error('Erro ao inicializar caixa:', error);
        alert('Erro ao carregar dados. Verifique o console.');
    }
}

// Carregar Mesas da API
async function carregarMesas() {
    const NOVO_PADRAO_MESAS = 15;

    console.log('✅ Mesas carregadas (fallback):', mesas.length);
    
    try {
        const response = await fetch('/api/config/mesas');
        const config = await response.json();
        const qtdMesas = NOVO_PADRAO_MESAS || config.quantidadeMesas; 
        mesas = Array.from({ length: qtdMesas }, (_, i) => ({
            id: i + 1,
            numero: i + 1,
            ocupada: false
        }));
        console.log('✅ Mesas carregadas da API:', mesas.length);
    } catch (error) {
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
            status: 'Pronto',
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
            status: 'Aguardando',
            itens: [
                { id: 12, nome: 'Açaí Grande com Frutas', preco: 22.00, quantidade: 1 }
            ]
        },
         {
            id: 103,
            nomeCliente: 'Carlos Fedasrreira',
            status: 'Preparando',
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        },
        {
            id: 104,
            nomeCliente: 'Carlos Ferdareira',
            status: 'Preparando',
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        },
         {
            id: 105,
            nomeCliente: 'Carlos Ferrseira',
            status: 'Preparando',
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        },
         {
            id: 106,
            nomeCliente: 'Carlos Fedsadarreira',
            status: 'Preparando',
            itens: [
                { id: 13, nome: 'Café Expresso', preco: 6.00, quantidade: 1 }
            ]
        },
         {
            id: 107,
            nomeCliente: 'Carlos Fedsadarreira',
            status: 'Preparando',
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

// Selecionar Mesa
function selecionarMesa(mesaId) {
    document.querySelectorAll('.levar-card').forEach(card => card.classList.remove('selecionada'));
    
    const cardSelecionado = document.querySelector(`[data-mesa-id="${mesaId}"]`);
    const estaSelecionada = cardSelecionado && cardSelecionado.classList.contains('selecionada');

    document.querySelectorAll('.mesa-card').forEach(card => card.classList.remove('selecionada'));

    if (estaSelecionada) {
        mesaSelecionadaId = null; 
        limparDetalhes();
    } else {
        mesaSelecionadaId = mesaId;
        if (cardSelecionado) {
            cardSelecionado.classList.add('selecionada');
        }
        renderizarDetalhesMesa(mesaId);
    }
}

// Selecionar Pedido Levar
function selecionarPedidoLevar(pedidoId) {
    document.querySelectorAll('.mesa-card').forEach(card => card.classList.remove('selecionada'));

    const cardSelecionado = document.querySelector(`[data-pedido-id="${pedidoId}"]`);
    const estaSelecionado = cardSelecionado && cardSelecionado.classList.contains('selecionada');

    document.querySelectorAll('.levar-card').forEach(card => card.classList.remove('selecionada'));
    
    if (estaSelecionado) {
        limparDetalhes();
    } else {
        if (cardSelecionado) {
            cardSelecionado.classList.add('selecionada');
        }
        renderizarDetalhesPedidoLevar(pedidoId);
    }
}

// NOVA FUNÇÃO: Limpar detalhes (mostra placeholders)
function limparDetalhes() {
    document.querySelector('.itens-container').innerHTML = `
        <div id="itensPlaceholder" class="placeholder-state">
            <p>Selecione um pedido para visualizar os itens.</p>
        </div>
    `;
    
    document.querySelector('.totalizadores-container').innerHTML = `
        <div id="totalizadoresPlaceholder" class="placeholder-state">
            <p>Totais aparecerão aqui.</p>
        </div>
    `;
}

// NOVA FUNÇÃO: Renderizar detalhes da mesa (itens + totalizadores)
function renderizarDetalhesMesa(mesaId) {
    const pedidos = pedidosMesas[mesaId] || [];
    
    // Renderizar itens
    let itensContainer = document.querySelector('.itens-container');
    itensContainer.innerHTML = `<h2>Mesa ${mesaId}</h2>`; 

    if (pedidos.length === 0) {
        itensContainer.innerHTML += `<div class="empty-state"><p>🍽️ Esta mesa não possui pedidos</p></div>`;
        limparTotalizadores();
        return;
    }

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
            <div class="botoes-item-info">
                <button class="botao-item-pago">Pago</button>
                <button class="botao-item-entregue">Entregue</button>
                <button class="botao-item-remover">Remover</button>
            </div>
            <div class="item-valor">
                <div class="item-preco">R$ ${subtotal.toFixed(2)}</div>
            </div>
        `;
        itensContainer.appendChild(itemDiv);
    });
    
    // Renderizar totalizadores
    renderizarTotalizadores(pedidos);
}

// NOVA FUNÇÃO: Renderizar detalhes do pedido levar
function renderizarDetalhesPedidoLevar(pedidoId) {
    const pedido = pedidosLevar.find(p => p.id === pedidoId);
    
    let itensContainer = document.querySelector('.itens-container');
    itensContainer.innerHTML = `<h2>Pedido #${pedidoId} - ${pedido.nomeCliente}</h2>`;

    if (!pedido || pedido.itens.length === 0) {
        itensContainer.innerHTML += `<div class="empty-state"><p>Nenhum item neste pedido.</p></div>`;
        limparTotalizadores();
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
            <div class="botoes-item-info">
                <button class="botao-item-pago">Pago</button>
                <button class="botao-item-entregue">Entregue</button>
                <button class="botao-item-remover">Remover</button>
            </div>
            <div class="item-valor">
                <div class="item-preco">R$ ${subtotal.toFixed(2)}</div>
            </div>
        `;
        itensContainer.appendChild(itemDiv);
    });
    
    // Renderizar totalizadores
    renderizarTotalizadores(pedido.itens);
}

// NOVA FUNÇÃO: Renderizar totalizadores
function renderizarTotalizadores(itens) {
    const totalizadoresContainer = document.querySelector('.totalizadores-container');
    
    // Calcular valores
    const subtotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const garcom = subtotal * 0.10; // 10% de taxa de garçom
    const total = subtotal + garcom;
    
    totalizadoresContainer.innerHTML = `
        <h2>Resumo do Pedido</h2>
        <div class="totalizadores-content">
            <div class="total-linha">
                <span class="total-label">Subtotal:</span>
                <span class="total-valor">R$ ${subtotal.toFixed(2)}</span>
            </div>
            <div class="total-linha">
                <span class="total-label">Taxa Garçom (10%):</span>
                <span class="total-valor">R$ ${garcom.toFixed(2)}</span>
            </div>
            <div class="total-linha destaque">
                <span class="total-valor-10">TOTAL A PAGAR COM 10%: <strong>R$ ${total.toFixed(2)}</strong></span>
                <span class="total-valor-10">TOTAL A PAGAR SEM 10%: <strong>R$ ${subtotal.toFixed(2)}</strong></span>
            </div>
            <div class="botoes-finalizar-pedido">
                <button class="pagamento-pedido">Pagar tudo</button>
                <button class="finalizar-pedido">Finalizar</button>
            </div>
        </div>
    `;
}

// NOVA FUNÇÃO: Limpar totalizadores
function limparTotalizadores() {
    document.querySelector('.totalizadores-container').innerHTML = `
        <div id="totalizadoresPlaceholder" class="placeholder-state">
            <p>Totais aparecerão aqui.</p>
        </div>
    `;
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