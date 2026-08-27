/* ==========================================================================
   Microinterações:
   1) Parallax sutil na foto do profissional (mouse no desktop, giroscópio
      no mobile) em relação ao card de fundo.
   2) Ativação de estado "pronto" após as animações de entrada.
   3) Registro de clique no CTA do WhatsApp (placeholder para analytics).
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage = document.querySelector('.photo-stage');
  var front = document.querySelector('[data-parallax="front"]');
  var frontLite = document.querySelector('[data-parallax="front-lite"]');
  var back = document.querySelector('[data-parallax="back"]');

  // Intensidade do deslocamento (px) por camada — a foto se move mais que
  // o card de fundo, criando a sensação de profundidade 3D.
  var LAYERS = [
    { el: front, strength: 14 },
    { el: frontLite, strength: 8 },
    { el: back, strength: -5 }
  ];

  var targetX = 0, targetY = 0;   // -1..1
  var currentX = 0, currentY = 0;
  var rafId = null;

  function applyParallax() {
    // Suaviza o movimento (lerp) para um efeito de câmera fluido.
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    LAYERS.forEach(function (layer) {
      if (!layer.el) return;
      var x = (currentX * layer.strength).toFixed(2);
      var y = (currentY * layer.strength * 0.6).toFixed(2);
      layer.el.style.transform =
        layer.el.dataset.parallax === 'front'
          ? 'translate(' + x + 'px,' + y + 'px)'
          : 'translate(' + x + 'px,' + y + 'px)';
    });

    rafId = requestAnimationFrame(applyParallax);
  }

  function startLoop() {
    if (rafId === null) rafId = requestAnimationFrame(applyParallax);
  }

  // --- Desktop: movimento do mouse sobre o palco da foto ---
  function onPointerMove(e) {
    var rect = document.body.getBoundingClientRect();
    var relX = (e.clientX - rect.left) / rect.width;   // 0..1
    var relY = (e.clientY - rect.top) / rect.height;   // 0..1
    targetX = (relX - 0.5) * 2;
    targetY = (relY - 0.5) * 2;
  }

  // --- Mobile: inclinação do dispositivo (giroscópio) ---
  var GYRO_MAX_BETA = 24;   // inclinação frente/trás (graus) mapeada para o eixo Y
  var GYRO_MAX_GAMMA = 24;  // inclinação esquerda/direita (graus) mapeada para o eixo X

  function onDeviceOrientation(e) {
    if (e.beta === null || e.gamma === null) return;
    var gamma = Math.max(-GYRO_MAX_GAMMA, Math.min(GYRO_MAX_GAMMA, e.gamma));
    var beta = Math.max(-GYRO_MAX_BETA, Math.min(GYRO_MAX_BETA, e.beta - 40)); // ~40° = dispositivo "em mãos"
    targetX = gamma / GYRO_MAX_GAMMA;
    targetY = beta / GYRO_MAX_BETA;
  }

  function enableGyroscope() {
    if (typeof DeviceOrientationEvent === 'undefined') return;

    // iOS 13+: exige permissão explícita, solicitada em um gesto do usuário.
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      var grantOnce = function () {
        DeviceOrientationEvent.requestPermission()
          .then(function (state) {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', onDeviceOrientation, true);
            }
          })
          .catch(function () { /* permissão negada — segue sem parallax de giroscópio */ });
        window.removeEventListener('touchend', grantOnce, true);
      };
      window.addEventListener('touchend', grantOnce, true);
    } else {
      // Android e demais navegadores: não exigem permissão explícita.
      window.addEventListener('deviceorientation', onDeviceOrientation, true);
    }
  }

  function init() {
    if (reduceMotion) return; // respeita preferência de acessibilidade

    if (stage) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }
    enableGyroscope();
    startLoop();
  }

  document.addEventListener('DOMContentLoaded', init);

  // --- CTA do WhatsApp: ponto único para plugar analytics futuramente ---
  var cta = document.getElementById('ctaWhatsapp');
  if (cta) {
    cta.addEventListener('click', function () {
      // Exemplo: window.gtag && gtag('event', 'click_whatsapp_cta');
      cta.setAttribute('data-clicked', 'true');
    });
  }
})();
