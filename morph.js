// morph
(function($) {
  $.fn.MorphText = function(strings, options) {
    if (!Array.isArray(strings) || strings.length < 2) {
      throw new TypeError('need an array with at least 2 strings');
    }

    const settings = $.extend({
      delay: 10000,
      morphTime: 900,
      cooldownTime: 250,
      step: function() {}
    }, options || {});

    return this.each(function() {
      const root = this;
      const $root = $(root);

      $root.empty();
      $root.addClass('morph');

      const text1 = document.createElement('span');
      const text2 = document.createElement('span');
      const sizer = document.createElement('span');

      text1.id = 'shuffle-title-1';
      text2.id = 'shuffle-title-2';
      sizer.id = 'shuffle-title-sizer';

      sizer.style.position = 'absolute';
      sizer.style.visibility = 'hidden';
      sizer.style.whiteSpace = 'nowrap';
      sizer.style.left = '-9999px';
      sizer.style.top = '-9999px';
      sizer.style.fontFamily = 'var(--font-title)';
      sizer.style.fontSize = getComputedStyle(root).fontSize;
      sizer.style.lineHeight = getComputedStyle(root).lineHeight;
      sizer.style.padding = '5px 0';

      root.appendChild(text1);
      root.appendChild(text2);
      root.appendChild(sizer);

      let index = 0;
      let morph = 0;
      let cooldown = settings.delay;
      let time = performance.now();

      const resizeRoot = (str) => {
        sizer.textContent = str;
        root.style.width = `${sizer.getBoundingClientRect().width}px`;
      };

      const setMorph = (fraction) => {
        const f = Math.max(fraction, 0.001);
        const r = Math.max(1 - fraction, 0.001);

        text2.style.filter = `blur(${Math.min(8 / f - 8, 100)}px)`;
        text2.style.opacity = `${Math.pow(fraction, 0.4)}`;

        text1.style.filter = `blur(${Math.min(8 / r - 8, 100)}px)`;
        text1.style.opacity = `${Math.pow(1 - fraction, 0.4)}`;

        text1.textContent = strings[index % strings.length];
        text2.textContent = strings[(index + 1) % strings.length];

        resizeRoot(text1.textContent);
      };

      const setCooldown = () => {
        text2.style.filter = '';
        text2.style.opacity = '0';
        text1.style.filter = '';
        text1.style.opacity = '1';
        text1.textContent = strings[index % strings.length];
        text2.textContent = strings[(index + 1) % strings.length];
        resizeRoot(text1.textContent);
      };

      text1.textContent = strings[0];
      text2.textContent = strings[1 % strings.length];
      text1.style.opacity = '1';
      text2.style.opacity = '0';
      resizeRoot(text1.textContent);

      function animate() {
        const now = performance.now();
        const dt = now - time;
        time = now;

        if (cooldown > 0) {
          cooldown -= dt;
          setCooldown();
        } else {
          morph += dt;
          let fraction = morph / settings.morphTime;

          if (fraction >= 1) {
            morph = 0;
            cooldown = settings.delay;
            index = (index + 1) % strings.length;
            settings.step(strings[index]);
            setCooldown();
          } else {
            setMorph(fraction);
          }
        }

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    });
  };
})(jQuery);

// init
if (typeof $ !== 'undefined' && $('#shuffle-title').length) {
  $('#shuffle-title').MorphText([
    "Hello!",
    "¡Hola!",
    "sl 🚂💨",
    "That's not even funny, man!",
    "Optimal performance in all browsers!",
    "Born to CSS, forced to JAVASCRIPT!!!",
    "T.M.Y.",
    "It's a Casio on a plastic beach!",
    "Nonagon infinity opens the door!",
    "Has it trickled down yet?",
    "Me? Gongaga",
    "I'd just like to interject for a moment...",
    "Feel the rhythm!",
    "You know the business!",
    ":P",
    "Keep it live!",
    "Let's mosey!",
    "Converted to Free Software Evangelicism",
    "Do you have a moment to talk about GNU/Linux?",
    "Linyos Torovoltos wrote Lunix!"
  ], {
    delay: 10000,
    morphTime: 900,
    cooldownTime: 250
  });
}
