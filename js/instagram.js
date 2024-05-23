
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
    greeting = 'Tenha um bom dia por aí! 👋🏻';
  } else if (hours >= 12 && hours < 18) {
    greeting = 'Tenha uma ótima tarde por aí! 👋🏻';
  } else {
    greeting = 'Tenha uma boa noite por aí! 👋🏻';
  }

  // Retornar a saudação
  return greeting;
}

// Exemplo de uso
const greeting = getCurrentTime();

console.log(greeting); // Exibe a saudação "Tenha um bom dia!", "Boa tarde!" ou "Boa noite!"


var messages = [
    'Olá! 🙋🏻 Sou o Kleber e',
    'desenvolvo páginas web impactantes para',
    'otimizar sua presença digital. Isso faz',
    'com que você atraia mais clientes e',
    'aumente suas vendas! 🤑',
    'Por aqui, escolhi fazer',
    'algo que prenda a sua',
    'atenção e assim fazer você ler',
    'minha apresentação. Mas',
    'cada site tem seu propósito único,',
    'projetado para que você ganhe',
    'vantagens competitivas sobre seus',
    'concorrentes na avenida mais',
    'movimentada do mundo; o Google.',
    'Mas isso é só o pré-requisito inicial',
    'para que possamos aplicar estratégias',
    'de grandes marcas na sua empresa.',
    'Você ficaria entediado de ler',
    'por aqui como que o seu melhor mês',
    'será sempre o próximo usando tecnologia',
    'que cumpre o papel de toda uma equipe',
    'de marketing focada na inteligência',
    'particular do seu negócio.',
    'Espero um 👉🏻<a href="https://tally.so/r/nPAV2d">alô</a>👈🏻 da sua parte',
    'e então marcamos um café',
    'ou um whisky. 🫡',
    getCurrentTime(),
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

}
