window.onload = function() {

  var messagesEl = document.querySelector('.messages');
  var typingSpeed = 50;
  var loadingText = '<b>•</b><b>•</b><b>•</b>';
  var messageIndex = 0;

function getCurrentTime() {
  // Obter a data e hora atual
  const date = new Date();

  // Obter o fuso horário do navegador
  const options = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: '2-digit',
    minute: '2-digit',
  };

  // Formatar a data e hora no fuso horário local
  const localTime = date.toLocaleTimeString('pt-BR', options);

  // Obter a hora atual
  const hours = parseInt(localTime.split(':')[0]);

  // Definir a saudação
  let greeting;
  if (hours >= 5 && hours < 12) {
    greeting = 'Tenha um excelente dia!';
  } else if (hours >= 12 && hours < 18) {
    greeting = 'Tenha uma ótima tarde!';
  } else {
    greeting = 'Tenha uma ótima noite!';
  }

  // Retornar a saudação
  return greeting;
}

// Exemplo de uso
const greeting = getCurrentTime();

console.log(greeting); // Exibe a saudação "Tenha um bom dia!", "Boa tarde!" ou "Boa noite!"


var messages = [
    'Olá!!',
    'Aqui é o Kleber,',
    'e você pode me contatar',
    'tanto por <a href="#" data-e="a2xlYmVybGVvbmFyZG8ubWVAZ21haWwuY29t" class="email-shadow-link" style="color: #0066cc; text-decoration: underline; cursor: pointer;">email</a> ou <a href="#" data-a="NTUxMTk1OTM2MDkzNg==" data-m="T2zDoSwgS2xlYmVyIQ==" class="wa-shadow-link" style="color: #0066cc; text-decoration: underline; cursor: pointer;">whatsapp</a>',
    'Se falta acertar algo,',
    'meu pix é esse:',
    '<span data-k="cGl4QGtsZWJlcmxlb25hcmRvLm1l" class="pix-shadow-copy" style="color: #0066cc; text-decoration: underline; cursor: pointer; font-weight: bold;">[Clique para copiar a chave PIX]</span>',
    '(é só tocar no endereço que copia',
    'para você só colar) 😉',
    getCurrentTime(),
    '👋🏻',
];


  var getFontSize = function() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  }

  var pxToRem = function(px) {
    return px / getFontSize() + 'rem';
  }

  var createBubbleElements = function(message, position) {
    var bubbleEl = document.createElement('div');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  }

  var getDimentions = function(elements) {
    return dimensions = {
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight)
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight)
      }
    }
  }

  var sendMessage = function(message, position) {
    var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
    var elements = createBubbleElements(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    var dimensions = getDimentions(elements);
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function(i) {return (i * 100) + 50}
    });
    setTimeout(function() {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w ],
        height: [dimensions.loading.h, dimensions.bubble.h ],
        marginTop: 0,
        marginLeft: 0,
        begin: function() {
          if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
        }
      })
    }, loadingDuration - 50);
  }

  var sendMessages = function() {
    var message = messages[messageIndex];
    if (!message) return;
    sendMessage(message);
    ++messageIndex;
    setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
  }

  sendMessages();

  // Decodificador UTF-8 seguro para Base64 (evita caracteres corrompidos em acentos)
  var decodeBase64UTF8 = function(str) {
    var binaryStr = atob(str);
    var bytes = new Uint8Array(binaryStr.length);
    for (var i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  // Decodifica elementos em tela de forma transparente para o usuário
  var revealShadowElements = function() {
    var shadowPix = document.querySelectorAll('.pix-shadow-copy');
    shadowPix.forEach(function(el) {
      if (el.getAttribute('data-k') && !el.dataset.revealed) {
        el.innerHTML = decodeBase64UTF8(el.getAttribute('data-k'));
        el.dataset.revealed = "true";
      }
    });
  };

  // Interceptador global para os elementos com links/ações ofuscadas
  document.addEventListener('pointerdown', function(e) {
    // 1. Ação para WhatsApp (Usando rota wa.me via navegação direta para abrir o aplicativo sem intermédio de pop-up)
    var waTarget = e.target.closest('.wa-shadow-link');
    if (waTarget) {
      e.preventDefault();
      var phone = decodeBase64UTF8(waTarget.getAttribute('data-a'));
      var text = decodeBase64UTF8(waTarget.getAttribute('data-m'));
      var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
      window.location.href = url;
      return;
    }

    // 2. Ação para E-mail (mailto)
    var emailTarget = e.target.closest('.email-shadow-link');
    if (emailTarget) {
      e.preventDefault();
      var email = decodeBase64UTF8(emailTarget.getAttribute('data-e'));
      window.location.href = 'mailto:' + email;
      return;
    }

    // 3. Ação para Copiar Chave PIX
    var pixTarget = e.target.closest('.pix-shadow-copy');
    if (pixTarget) {
      e.preventDefault();
      var pixKey = decodeBase64UTF8(pixTarget.getAttribute('data-k'));
      
      var copyToClipboard = function(text) {
        if (navigator.clipboard && window.isSecureContext) {
          return navigator.clipboard.writeText(text);
        } else {
          var textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          return new Promise(function(resolve, reject) {
            document.execCommand('copy') ? resolve() : reject();
            textArea.remove();
          });
        }
      };

      copyToClipboard(pixKey).then(function() {
        var originalText = pixTarget.innerHTML;
        pixTarget.innerHTML = 'Copiado! ✓';
        setTimeout(function() {
          pixTarget.innerHTML = originalText;
        }, 2000);
      });
    }
  });

  // Executa a renderização do texto assim que as mensagens forem desenhadas
  var observer = new MutationObserver(revealShadowElements);
  if (messagesEl) {
    observer.observe(messagesEl, { childList: true, subtree: true });
  }

}
