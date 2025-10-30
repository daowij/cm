// Paginas/comanda.js

// ====================================================================
// VARIÁVEIS GLOBAIS
// ====================================================================

let pedidoAtual = []; // Array para armazenar o estado do carrinho do pedido atual
let produtos = [];    // VAZIO: Será preenchido pela API do Cardápio
let categorias = [];  // VAZIO: Será preenchido após a busca da API


document.addEventListener('DOMContentLoaded', () => {
    // ===================================
    // 1. Variáveis DOM e Inicialização
    // ===================================
    const selectMesa = document.getElementById("opcoes");
    const botaoDarkMode = document.getElementById('botaoDarkMode');
    const logo = document.getElementById('logo');
    const btnEnviarPedido = document.getElementById('btn-enviar-pedido');
    const listaPedido = document.getElementById('lista-pedido');


// ===================================
// 2. Lógica de Dark Mode Refatorada
// ===================================

// Funções para gerenciar o estado e a UI
function aplicarTema(tema) {
    const body = document.body;
    body.setAttribute('data-theme', tema);

    // Atualiza o estado visual do botão/checkbox
    if (botaoDarkMode) {
        botaoDarkMode.checked = (tema === 'dark');
    }

}

function carregarTemaSalvo() {
    // A lógica original usava localStorage.getItem("modoEscuro")
    // Se você *precisa* manter a persistência entre sessões (mesmo com a nova lógica do seu prompt),
    // é melhor continuar usando localStorage. Se o seu novo requisito é usar *apenas* a variável de sessão (como no seu novo prompt),
    // esta lógica deve ser ajustada para usar window.darkModePreference.

    // A opção mais fiel ao código original (usando localStorage para persistência):
    const modoSalvo = localStorage.getItem("modoEscuro");
    
    // Converte o valor "true" ou "false" salvo para o tema 'dark' ou 'light'
    const temaInicial = (modoSalvo === "true") ? 'dark' : 'light';
    
    aplicarTema(temaInicial);
}

// Inicialização: Carrega o tema ao iniciar
carregarTemaSalvo();

// Adiciona o listener para a interação do usuário
if (botaoDarkMode) {
    botaoDarkMode.addEventListener('click', () => {
        const body = document.body;
        // Verifica o tema atual para determinar o próximo
        const isDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        // Aplica o novo tema (atualiza data-theme, logo e estado do botão)
        aplicarTema(newTheme);

        // Salva a preferência (mantendo a persistência da lógica original)
        // O valor salvo é 'true' ou 'false', compatível com a chave "modoEscuro"
        const escuro = (newTheme === 'dark');
        localStorage.setItem("modoEscuro", escuro);

        // Se você quiser seguir a risca o novo prompt (usando variável de sessão),
        // use: window.darkModePreference = newTheme;
    });
}

    // ===================================
    // 3. Inicialização Principal
    // ===================================
    
    initComanda(); 

    // Listeners do Garçom
    if (selectMesa) {
        if (btnEnviarPedido) {
            btnEnviarPedido.addEventListener('click', enviarPedido);
        }
        if (listaPedido) {
             listaPedido.addEventListener('click', gerenciarItemPedido);
        }
    }
});


/**
 * Função de inicialização assíncrona que carrega os dados do servidor.
 */
async function initComanda() {
    // 1. Carrega o Cardápio (aguarda a resposta do servidor)
    await carregarCardapio(); 
    
    // 2. Carrega as mesas (aguarda a resposta do servidor)
    await gerarMesas();
    
    // 3. Renderiza a interface do Garçom
    const selectMesa = document.getElementById("opcoes");
    if (selectMesa) {
        renderizarCategorias();
        renderizarProdutos();
        updatePedidoFooter();
    }
}


// ====================================================================
// FUNÇÕES DE COMUNICAÇÃO COM O SERVIDOR (API)
// ====================================================================

/**
 * Busca a lista de produtos reais do servidor Express (CSV).
 */
async function carregarCardapio() {
    try {
        const response = await fetch('/api/cardapio');
        if (!response.ok) {
            throw new Error('Falha ao buscar cardápio do servidor.');
        }
        
        // Atribui os dados reais do CSV às variáveis globais
        produtos = await response.json(); 
        categorias = [...new Set(produtos.map(p => p.categoria))];
        
    } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
        // O Cardápio ficará vazio ou exibirá um erro se a busca falhar.
    }
}

/**
 * Função para gerar mesas (LENDO DO SERVIDOR)
 */
async function gerarMesas() {
    const select = document.getElementById("opcoes");
    if (!select) return; 
    
    while (select.options.length > 2) {
        select.remove(2);
    }
    
    try {
        const response = await fetch('/api/config/mesas');
        if (!response.ok) {
            throw new Error('Falha ao buscar configurações de mesas.');
        }
        const data = await response.json();
        const qtd = data.quantidadeMesas;

        if (qtd) {
            for (let i = 1; i <= parseInt(qtd); i++) {
                const opt = document.createElement("option");
                opt.value = "Mesa " + i;
                opt.textContent = "Mesa " + i;
                select.appendChild(opt);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar mesas:", error);
    }
}

/**
 * Função para SALVAR mesas (ENVIANDO PARA O SERVIDOR - Rota Admin)
 */
async function salvarMesas() {
    const input = document.getElementById("numMesas");
    const mensagem = document.getElementById("mensagem");
    const valor = parseInt(input.value);

    if (!isNaN(valor) && valor > 0) {
        try {
            const response = await fetch('/api/config/mesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidadeMesas: valor })
            });
            
            const data = await response.json();

            if (response.ok) {
                if (mensagem) {
                    mensagem.textContent = data.mensagem;
                    mensagem.style.color = "green";
                }
                // Recarrega as mesas em todas as páginas abertas
                gerarMesas(); 
            } else {
                if (mensagem) {
                    mensagem.textContent = data.erro || "Erro ao salvar no servidor.";
                    mensagem.style.color = "red";
                }
            }
        } catch (error) {
            console.error("Erro na comunicação com o servidor:", error);
            if (mensagem) {
                mensagem.textContent = "Erro de rede ou servidor indisponível.";
                mensagem.style.color = "red";
            }
        }
    } else {
        if (mensagem) {
            mensagem.textContent = "Digite um número válido.";
            mensagem.style.color = "red";
        }
    }
}
window.salvarMesas = salvarMesas; // Permite acesso via HTML


// ====================================================================
// FUNÇÕES DE INTERFACE E LÓGICA DO GARÇOM
// ====================================================================

function verificarOpcao() {
    const select = document.getElementById("opcoes");
    const caixaTexto = document.getElementById("caixaTexto");

    if (select && caixaTexto) {
        if (select.value === "Levar") {
            caixaTexto.style.display = "block";
        } else {
            caixaTexto.style.display = "none";
        }
        updatePedidoFooter();
    }
}
window.verificarOpcao = verificarOpcao;


function adicionarAoPedido(produto) {
    const itemExistente = pedidoAtual.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        pedidoAtual.push({ ...produto, quantidade: 1 });
    }
    
    atualizarListaPedido();
    updatePedidoFooter();
}

function gerenciarItemPedido(e) {
    const target = e.target;
    if (target.classList.contains('btn-remover') || target.classList.contains('btn-adicionar')) {
        const id = parseInt(target.dataset.id);
        const item = pedidoAtual.find(i => i.id === id);
        
        if (!item) return;

        if (target.classList.contains('btn-adicionar')) {
            item.quantidade++;
        } else if (target.classList.contains('btn-remover')) {
            item.quantidade--;
            if (item.quantidade <= 0) {
                pedidoAtual = pedidoAtual.filter(i => i.id !== id);
            }
        }
        
        atualizarListaPedido();
        updatePedidoFooter();
    }
}

function atualizarListaPedido() {
    const listaPedido = document.getElementById('lista-pedido');
    if (!listaPedido) return;
    
    if (pedidoAtual.length === 0) {
        listaPedido.innerHTML = `<p class="aviso-pedido">Nenhum item adicionado.</p>`;
        return;
    }
    
    listaPedido.innerHTML = '';
    
    pedidoAtual.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item-pedido');
        itemElement.innerHTML = `
            <div class="item-info">
                <span class="item-qtd">${item.quantidade}x</span>
                <span class="item-nome">${item.nome}</span>
            </div>
            <div class="item-acoes">
                <span class="item-subtotal">R$ ${(item.quantidade * item.preco).toFixed(2).replace('.', ',')}</span>
                <button class="btn-remover" data-id="${item.id}">-</button>
                <button class="btn-adicionar" data-id="${item.id}">+</button>
            </div>
        `;
        listaPedido.appendChild(itemElement);
    });
}

function updatePedidoFooter() {
    const pedidoTotalElement = document.getElementById('pedido-total');
    const btnEnviarPedido = document.getElementById('btn-enviar-pedido');
    const selectMesa = document.getElementById("opcoes");
    
    if (!pedidoTotalElement || !btnEnviarPedido || !selectMesa) return;

    const total = pedidoAtual.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    pedidoTotalElement.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const mesaSelecionada = selectMesa.value !== "";
    const temItens = pedidoAtual.length > 0;
    btnEnviarPedido.disabled = !(mesaSelecionada && temItens);
}

async function enviarPedido() {
    const btnEnviarPedido = document.getElementById('btn-enviar-pedido');
    if (btnEnviarPedido.disabled) return;
    
    const selectMesa = document.getElementById("opcoes");
    const destino = selectMesa.value;
    const clienteInput = document.getElementById('texto');
    const cliente = destino === "Levar" ? clienteInput.value.trim() : null;

    if (destino === "" || (destino === "Levar" && cliente === "")) {
         alert("Por favor, selecione uma mesa ou insira o nome do cliente.");
         return;
    }
    
    const pedidoData = {
        destino: destino,
        cliente: cliente,
        itens: pedidoAtual,
        total: pedidoAtual.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
        dataHora: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoData)
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Pedido para ${destino} enviado com sucesso!`);
            // Limpa o estado
            pedidoAtual = [];
            selectMesa.value = "";
            if (document.getElementById("caixaTexto")) document.getElementById("caixaTexto").style.display = "none";
            if (clienteInput) clienteInput.value = '';
            atualizarListaPedido();
            updatePedidoFooter();
        } else {
            alert(`Erro ao enviar pedido: ${data.mensagem || 'Erro desconhecido.'}`);
        }

    } catch (error) {
        alert("Erro de rede ao tentar enviar o pedido.");
    }
}


// ====================================================================
// FUNÇÕES DE CARDÁPIO (RENDERIZAÇÃO)
// ====================================================================

function renderizarCategorias() {
    const categoriasLista = document.getElementById('categorias-lista');
    if (!categoriasLista) return;
    
    categoriasLista.innerHTML = `<button class="btn-categoria ativo" data-categoria="Todos">Todos</button>`;
    
    categorias.forEach(categoria => {
        const btn = document.createElement('button');
        btn.classList.add('btn-categoria');
        btn.textContent = categoria;
        btn.dataset.categoria = categoria;
        categoriasLista.appendChild(btn);
    });
    
    categoriasLista.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-categoria')) {
            categoriasLista.querySelectorAll('.btn-categoria').forEach(btn => {
                btn.classList.remove('ativo');
            });
            e.target.classList.add('ativo');
            
            const categoriaSelecionada = e.target.dataset.categoria;
            renderizarProdutos(categoriaSelecionada);
        }
    });
}

function renderizarProdutos(filtro = "Todos") {
    const produtosLista = document.getElementById('produtos-lista');
    if (!produtosLista) return;
    
    produtosLista.innerHTML = '';
    
    const produtosFiltrados = produtos.filter(produto => 
        filtro === "Todos" || produto.categoria === filtro
    );

    if (produtosFiltrados.length === 0) {
        produtosLista.innerHTML = '<p style="text-align: center;">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    produtosFiltrados.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('produto-card');
        card.innerHTML = `
            <div class="produto-nome">${produto.nome}</div>
            <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
        `;
        card.onclick = () => adicionarAoPedido(produto);
        produtosLista.appendChild(card);
    });
}