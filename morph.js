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

    function pickRandomIndex(exclude) {
      let next;
      do {
        next = Math.floor(Math.random() * strings.length);
      } while (next === exclude);
      return next;
    }

    return this.each(function() {
      const root = this;
      const $root = $(root);

      $root.empty();
      $root.addClass('morph');

      const sizer = document.createElement('span');
      const text1 = document.createElement('span');
      const text2 = document.createElement('span');

      sizer.id = 'shuffle-title-sizer';
      text1.id = 'shuffle-title-1';
      text2.id = 'shuffle-title-2';

      root.appendChild(sizer);
      root.appendChild(text1);
      root.appendChild(text2);

      let index = pickRandomIndex(-1);
      let nextIndex = pickRandomIndex(index);
      let morph = 0;
      let cooldown = settings.delay;
      let time = performance.now();

      const syncSizer = (str) => {
        sizer.textContent = str;
      };

      const setMorph = (fraction) => {
        const f = Math.max(fraction, 0.001);
        const r = Math.max(1 - fraction, 0.001);

        text2.style.filter = `blur(${Math.min(8 / f - 8, 100)}px)`;
        text2.style.opacity = `${Math.pow(fraction, 0.4)}`;

        text1.style.filter = `blur(${Math.min(8 / r - 8, 100)}px)`;
        text1.style.opacity = `${Math.pow(1 - fraction, 0.4)}`;

        text1.textContent = strings[index];
        text2.textContent = strings[nextIndex];
        syncSizer(strings[index]);
      };

      const setCooldown = () => {
        text2.style.filter = '';
        text2.style.opacity = '0';
        text1.style.filter = '';
        text1.style.opacity = '1';

        text1.textContent = strings[index];
        text2.textContent = strings[nextIndex];
        syncSizer(strings[index]);
      };

      text1.textContent = strings[index];
      text2.textContent = strings[nextIndex];
      text1.style.opacity = '1';
      text2.style.opacity = '0';
      syncSizer(strings[index]);

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
            index = nextIndex;
            nextIndex = pickRandomIndex(index);
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
    "Optimal performance in all browsers! (except Edge lol screw that)",
    "Born to CSS, forced to JavaScript :(",
    "T.M.Y.",
    "Literally my life",
    "Nonagon infinity opens the door!",
    "Has it trickled down yet?",
    "Me? Gongaga",
    "I'd just like to interject for a moment...",
    "Can't a girl have fun?",
    "You know the business!",
    ":P",
    "Keep it live!",
    "IRC > Slack",
    "Converted to Free Software Evangelicism",
    "Do you have a moment to talk about GNU/Linux?",
    "Linyos Torovoltos wrote Lunix!"
  ], {
    delay: 2500,
    morphTime: 900,
    cooldownTime: 250
  });
}