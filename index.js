// --- Slider Functionality ---
const wrapper = document.querySelector(".sliderWrapper");
const esquerda = document.getElementById("esquerda");
const direita = document.getElementById("direita");
let posiAtual = 0;
let conta = 0;
const imgs = 5; // Total number of slides no slider
const tamanhoSlide = 100; // vw unit
const intervalo = 8000; // 8 seconds

// Verifica se os elementos do slider existem antes de tentar manipulá-los
if (wrapper && esquerda && direita) {
    function animarSlideAtual() {
        const slides = document.querySelectorAll('.itemSlide');

        // Reset animations for all elements in all slides first
        slides.forEach(slide => {
            const animatedElements = slide.querySelectorAll('.descSlide .frase, .tituloSlide .frase, .precoSlide span, .sliderImg');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
                void el.offsetWidth; // Trigger reflow to apply 'none'
            });
        });

        // Apply animations only to the current slide's elements
        const currentSlide = slides[conta];
        const currentAnimatedElements = currentSlide.querySelectorAll('.descSlide .frase, .tituloSlide .frase, .precoSlide span, .sliderImg');

        currentAnimatedElements.forEach(el => {
            // Re-apply animations using dataset values or default if not set
            const animationName = el.dataset.animation || 'fadeIn';
            const animationDuration = el.dataset.duration || '1s';
            const animationTiming = el.dataset.timing || 'ease';
            const animationDelay = el.dataset.delay || '0s'; // Default delay to 0 if not set

            el.style.animation = `${animationName} ${animationDuration} ${animationTiming} ${animationDelay} forwards`;
        });
    }

    // Set data-attributes for animations (important for animarSlideAtual to work)
    document.querySelectorAll('.descSlide .frase').forEach((el, i) => {
        el.dataset.animation = 'slideInRight';
        el.dataset.duration = '0.8s';
        el.dataset.timing = 'ease-out';
        el.dataset.delay = (0.2 + i * 0.2) + 's';
    });

    document.querySelectorAll('.tituloSlide .frase').forEach((el, i) => {
        el.dataset.animation = 'slideInRight';
        el.dataset.duration = '0.8s';
        el.dataset.timing = 'ease-out';
        el.dataset.delay = (1.0 + i * 0.2) + 's';
    });

    document.querySelectorAll('.precoSlide span').forEach(el => {
        el.dataset.animation = 'slideInRight';
        el.dataset.duration = '1.0s';
        el.dataset.timing = 'ease-out';
        el.dataset.delay = '1.8s';
    });

    document.querySelectorAll('.sliderImg').forEach(el => {
        el.dataset.animation = 'fadeIn';
        el.dataset.duration = '1s';
        el.dataset.timing = 'ease';
        el.dataset.delay = '2.0s';
    });


    function moverDireita() {
        if (conta < imgs - 1) {
            posiAtual -= tamanhoSlide;
            conta++;
        } else {
            posiAtual = 0;
            conta = 0;
        }
        wrapper.style.transform = `translateX(${posiAtual}vw)`;
        animarSlideAtual();
    }

    function moverEsquerda() {
        if (conta > 0) {
            posiAtual += tamanhoSlide;
            conta--;
        } else {
            posiAtual = -(imgs - 1) * tamanhoSlide;
            conta = imgs - 1;
        }
        wrapper.style.transform = `translateX(${posiAtual}vw)`;
        animarSlideAtual();
    }

    let slideAuto = setInterval(moverDireita, intervalo);

    function resetarAutoSlide() {
        clearInterval(slideAuto);
        slideAuto = setInterval(moverDireita, intervalo);
    }

    direita.addEventListener("click", () => {
        moverDireita();
        resetarAutoSlide();
    });

    esquerda.addEventListener("click", () => {
        moverEsquerda();
        resetarAutoSlide();
    });

    // Initial animation for the first slide on page load
    animarSlideAtual();
}


// --- Submenu Overlay ---
const sub = document.getElementById('sub');
const overlay = document.getElementById('overlay');
const navMenu = document.querySelector('.menu'); // Seleciona a div do menu
const submenuElement = document.querySelector('.submenu'); // Seleciona o submenu

// Mostrar overlay e submenu
if (sub && overlay && navMenu && submenuElement) { // Verifica se os elementos existem em todas as páginas
    sub.addEventListener('mouseenter', () => {
        overlay.style.display = 'block';
    });

    // Esconder overlay quando o mouse sai da área de sub (e seus filhos)
    navMenu.addEventListener('mouseleave', (event) => {
        // Verifica se o mouse está saindo para uma área que não é o submenu em si
        // ou se o mouse está saindo do 'sub' para fora da 'nav'
        if (!event.relatedTarget || (!navMenu.contains(event.relatedTarget) && !submenuElement.contains(event.relatedTarget))) {
            overlay.style.display = 'none';
        }
    });

    // Se o mouse sair do submenu direto para fora da área relevante
    submenuElement.addEventListener('mouseleave', (event) => {
        if (!event.relatedTarget || !navMenu.contains(event.relatedTarget)) {
            overlay.style.display = 'none';
        }
    });
}


// --- Shopping Cart Functionality ---
const cartModal = document.getElementById('cart-modal');
const carrinhoIcon = document.getElementById('carrinho-icon');
const closeButton = document.querySelector('.close-button');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalValue = document.getElementById('cart-total-value');
const clearCartButton = document.getElementById('clear-cart-button');
const checkoutButton = document.getElementById('checkout-button');

// Verifica se os elementos do carrinho existem na página atual
if (cartModal && carrinhoIcon && closeButton && cartItemsContainer && cartTotalValue && clearCartButton && checkoutButton) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<li style="text-align: center; color: #666; padding: 20px;">Seu carrinho está vazio.</li>';
        }

        cart.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Tamanho: ${item.size || 'N/A'}</p> <p>R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button data-id="${item.id}" data-size="${item.size}" data-action="decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" data-size="${item.size}" class="quantity-input">
                    <button data-id="${item.id}" data-size="${item.size}" data-action="increase">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}" data-size="${item.size}">Remover</button>
            `;
            cartItemsContainer.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotalValue.textContent = total.toFixed(2);
        saveCart();
    }

    function addToCart(productData, buttonElement) { // Recebe dados do produto e o botão clicado
        const productDiv = buttonElement.closest('.tudo'); // Encontra o container do produto
        const sizeSelect = productDiv ? productDiv.querySelector('.size-selector select') : null;
        let selectedSize = 'M'; // Default size

        if (sizeSelect) {
            selectedSize = sizeSelect.value;
        } else {
            // Fallback for pages without size selector (e.g., login/cadastro if they somehow trigger this)
            console.warn("Size selector not found for product. Defaulting to 'M'.");
        }

        const product = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            size: selectedSize // Adiciona o tamanho selecionado
        };

        const existingItemIndex = cart.findIndex(item => item.id === product.id && item.size === product.size);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart(); // Salva o carrinho após adicionar o item
        renderCart(); // Atualiza a exibição no modal
        
        showConfirmation(buttonElement); // Exibe a confirmação visual
    }

    function showConfirmation(buttonElement) {
        // Encontra o elemento .tudo pai para adicionar a confirmação corretamente
        const parentProductDiv = buttonElement.closest('.tudo');
        if (!parentProductDiv) return; // Se não encontrar, sai

        let confirmationDiv = parentProductDiv.querySelector('.add-to-cart-confirmation');
        
        // Se a div de confirmação não existe, cria-a
        if (!confirmationDiv) {
            confirmationDiv = document.createElement('div');
            confirmationDiv.classList.add('add-to-cart-confirmation');
            confirmationDiv.innerHTML = '<i class="fas fa-check-circle"></i> Adicionado ao carrinho!'; // Frase completa
            parentProductDiv.appendChild(confirmationDiv);
        }

        // Mostra a confirmação
        confirmationDiv.classList.add('show');

        // Esconde a confirmação após alguns segundos
        setTimeout(() => {
            confirmationDiv.classList.remove('show');
        }, 1500); // Mostra por 1.5 segundos
    }


    function removeFromCart(productId, productSize) { // Adiciona productSize para identificar item único
        cart = cart.filter(item => !(item.id === productId && item.size === productSize));
        renderCart();
    }

    function updateQuantity(productId, productSize, newQuantity) { // Adiciona productSize
        const item = cart.find(item => item.id === productId && item.size === productSize);
        if (item) {
            item.quantity = newQuantity;
            if (item.quantity <= 0) {
                removeFromCart(productId, productSize);
            }
        }
        renderCart();
    }

    // Event Listeners for Cart
    carrinhoIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCart();
    });

    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Delegando o evento para os botões "adicionar-carrinho"
    document.querySelectorAll('.adicionar-carrinho').forEach(button => {
        button.addEventListener('click', (event) => {
            const product = {
                id: event.target.dataset.id,
                name: event.target.dataset.name,
                price: parseFloat(event.target.dataset.price),
                image: event.target.dataset.image
            };
            addToCart(product, event.target); // Passa o elemento do botão
        });
    });

    // Delegando o evento para os botões "comprar" que vão direto para o checkout
    document.querySelectorAll('.comprar').forEach(button => {
        button.addEventListener('click', (event) => {
            const productDiv = event.target.closest('.tudo');
            const sizeSelect = productDiv ? productDiv.querySelector('.size-selector select') : null;
            let selectedSize = 'M';

            if (sizeSelect) {
                selectedSize = sizeSelect.value;
            }

            const product = {
                id: event.target.dataset.id || productDiv.querySelector('.adicionar-carrinho').dataset.id, // Reutiliza data-id do add-to-cart
                name: productDiv.querySelector('.desc').textContent.replace(/\s<br>\s\d{2}\/\d{2}/, ''), // Pega o nome do produto
                price: parseFloat(productDiv.querySelector('.preco').textContent.replace('R$', '').replace(',', '.')), // Pega o preço
                image: productDiv.querySelector('.imgspro').src,
                size: selectedSize
            };

            // Limpa o carrinho atual e adiciona apenas o item "comprado agora"
            cart = [{ ...product, quantity: 1 }];
            saveCart(); // Salva o carrinho com o novo item único
            window.location.href = "checkout.html"; // Redireciona para o checkout
        });
    });


    clearCartButton.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            cart = [];
            renderCart();
            alert('Carrinho limpo com sucesso!');
        }
    });

    // Modificado para redirecionar para checkout.html
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = "checkout.html"; // Redireciona para a página de checkout
            cartModal.style.display = 'none'; // Fecha o modal do carrinho
        } else {
            alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
        }
    });

    // Event Delegation for quantity change and remove buttons inside cart modal
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.dataset.id;
        const productSize = target.dataset.size; // Obter o tamanho

        if (target.classList.contains('remove-item')) {
            removeFromCart(productId, productSize);
        } else if (target.dataset.action === 'increase') {
            const input = target.previousElementSibling;
            let newQuantity = parseInt(input.value) + 1;
            updateQuantity(productId, productSize, newQuantity);
        } else if (target.dataset.action === 'decrease') {
            const input = target.nextElementSibling;
            let newQuantity = parseInt(input.value) - 1;
            updateQuantity(productId, productSize, newQuantity);
        }
    });

    cartItemsContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (target.classList.contains('quantity-input')) {
            const productId = target.dataset.id;
            const productSize = target.dataset.size; // Obter o tamanho
            const newQuantity = parseInt(target.value);
            updateQuantity(productId, productSize, newQuantity);
        }
    });

    // Initial render of cart when page loads
    renderCart();
}


// --- Dark Mode Toggle Functionality ---
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body; // Alvo principal para a classe dark-mode

// A verificação inicial do localStorage para aplicar a classe 'dark-mode'
// É feita por um script inline no HEAD de CADA HTML para evitar FOUC (Flash of Unstyled Content).
// Este script apenas lida com a lógica de TOGGLE (alternar) e a definição do ícone.
if (darkModeToggle) { // Verifica se o botão existe na página
    // Define o ícone inicial com base no estado atual do dark mode
    // (A classe 'dark-mode' já foi aplicada ao body pelo script inline no head, se necessário)
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.querySelector('i').classList.remove('fa-moon');
        darkModeToggle.querySelector('i').classList.add('fa-sun');
    } else {
        darkModeToggle.querySelector('i').classList.remove('fa-sun');
        darkModeToggle.querySelector('i').classList.add('fa-moon');
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            darkModeToggle.querySelector('i').classList.remove('fa-sun');
            darkModeToggle.querySelector('i').classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        } else {
            body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').classList.remove('fa-moon');
            darkModeToggle.querySelector('i').classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        }
    });
}


// --- Chatbot Functionality ---
const chatToggleButton = document.getElementById('chat-toggle-button');
const chatWindow = document.getElementById('chat-window');
const closeChatButton = document.querySelector('.close-chat-button');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

if (chatToggleButton) { // Verifica se o chatbot existe na página
    // Pre-defined responses for the chatbot
    const chatbotResponses = {
        "ola": "Olá! Como posso ajudar hoje?",
        "oi": "Oi! No que posso ser útil?",
        "bom dia": "Bom dia! Tudo bem? :)",
        "boa tarde": "Boa tarde! Posso ajudar com algo?",
        "boa noite": "Boa noite! Em que posso ajudar?",
        "pedidos": "Para informações sobre pedidos, por favor, acesse a seção 'Minha Conta' após fazer login, ou entre em contato com nosso suporte. O e-mail é perigosstoreADS@gmail.com e o telefone é (21) 98000-4754.",
        "envio": "O tempo de envio varia de 3 a 10 dias úteis, dependendo da sua localização. Após a compra, você receberá um código de rastreio.",
        "pagamento": "Aceitamos PIX, cartão de crédito (Visa, Mastercard, Elo) e boleto bancário. Para PIX, o pagamento é instantâneo.",
        "contato": "Você pode nos contatar por e-mail em perigosstoreADS@gmail.com ou pelo telefone (21) 98000-4754.",
        "catalogo": "Nosso catálogo está dividido em 'Brasileirão Série A', 'Times Europeus' e 'Seleções'. Qual você gostaria de explorar?",
        "tchau": "Até mais! Se precisar de algo, é só chamar.",
        "obrigado": "De nada! Fico feliz em ajudar."
    };

    function displayMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(`${sender}-message`);
        messageDiv.innerHTML = message; // Use innerHTML to allow for lists etc.
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        let response = "Desculpe, não entendi sua pergunta. Por favor, tente reformular ou escolha um dos tópicos: Pedidos, Envio, Pagamento, Contato, Catálogo.";

        // Respostas mais detalhadas com base em palavras-chave
        if (lowerCaseMessage.includes("rastreio") || lowerCaseMessage.includes("rastrear")) {
            response = "Para rastrear seu pedido, você receberá um código de rastreio por e-mail assim que o produto for enviado.";
        } else if (lowerCaseMessage.includes("prazo") || lowerCaseMessage.includes("dias uteis")) {
            response = chatbotResponses["envio"];
        } else if (lowerCaseMessage.includes("cartao") || lowerCaseMessage.includes("boleto") || lowerCaseMessage.includes("pix")) {
            response = chatbotResponses["pagamento"];
        } else if (lowerCaseMessage.includes("email") || lowerCaseMessage.includes("telefone")) {
            response = chatbotResponses["contato"];
        } else {
            for (const keyword in chatbotResponses) {
                if (lowerCaseMessage.includes(keyword)) {
                    response = chatbotResponses[keyword];
                    break;
                }
            }
        }
        return response;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        displayMessage(message, 'user');
        userInput.value = '';

        // Simulate a delay for bot response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            displayMessage(botResponse, 'bot');
        }, 500); // 0.5 second delay
    }

    // Event Listeners for Chatbot
    chatToggleButton.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    closeChatButton.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
}

// --- Font Size Changer Functionality ---
const decreaseFontButton = document.getElementById('decrease-font');
const increaseFontButton = document.getElementById('increase-font');
const rootElement = document.documentElement; // Represents the <html> tag

if (decreaseFontButton && increaseFontButton) {
    const minFontSize = 80; // 80% of default
    const maxFontSize = 120; // 120% of default
    let currentFontSize = parseFloat(getComputedStyle(rootElement).fontSize) / 16 * 100; // Get current font size in %

    function updateFontSize(newSize) {
        if (newSize >= minFontSize && newSize <= maxFontSize) {
            rootElement.style.fontSize = `${newSize}%`;
            localStorage.setItem('fontSize', newSize);
            currentFontSize = newSize;
        }
    }

    // Load saved font size on page load
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        currentFontSize = parseFloat(savedFontSize);
        rootElement.style.fontSize = `${currentFontSize}%`;
    }

    decreaseFontButton.addEventListener('click', () => {
        updateFontSize(currentFontSize - 5); // Decrease by 5%
    });

    increaseFontButton.addEventListener('click', () => {
        updateFontSize(currentFontSize + 5); // Increase by 5%
    });
}