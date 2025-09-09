// possible tab titles
const titles = [
  "🕸 webspinner",
  "Of love, I love, you love, I love, you love, I laugh, you laugh, I move, you move, you move, and one more time with feeling",
  "sudo apt-get install sl && sl 🚂💨",
  "That's not even funny, man!",
  "Born to css, forced to VANILLA JAVASCRIPT!!!",
  "T.M. Yachimovicz",
  "It's a Casio on a plastic beach...it's styrofoam deep sea landfill...it's automated computer speech",
  "They said the memories all fade out, fade out, all played out. Tell me, did you feel that?",
  "Over my shoulder, I'm dying to meet you, but everybody says I'm wrong.",
  "What could he do? Should have been a rock star, but he didn't have the money for a guitar.",
  "Give the kid the pick of pips, and give him all your stripes and ribbons. Now he's sitting in his hole, he might as well have buttons and bows.",
  "Round like a circle in a spiral, like a wheel within a wheel, never ending or beginning on an ever-spinning reel...",
  "...As the images unwind like the circles that you find in the windmills of your mind.",
  "I'm up off my knees, girl. I'm face to face with myself and I know who I am.",
  "Nonagon infinity opens the door!",
  "Breathe in the air, don't be aftaid to care.",
  "Long you live and high you fly, smiles you'll give and tears you'll cry, all you touch and all you see is all your life will ever be.",
  "I am surrendering to gravity and the unknown...", 
  "...Catch me, heal me, lift me back up to the sun.",
  "See my shadow changing, stretching up and over me, soften this old armor...",
  "...Hoping I can clear the way by stepping through my shadow, coming out the other side...",
  "...Step into the shadow. Forty six and two are just ahead of me.",
  "I wanna feel the metamorphosis and cleansing I've endured within.",
  "Cold silence has a tendency to atrophy any sense of compassion.",
  "Come embrace my desire to...swing on the spiral of our divinity and still be a human.",
  "With my feet upon the ground, I lose myself between the sounds and open wide to suck it in; I feel it move across my skin.",
  "I'm reaching up and reaching out, I'm reaching for the random or whatever will bewilder me.",
  "Spiral out! Keep going!",
  "I watched a change in you. It's like you never had wings, now you feel so alive.",
  "Mirrors sideways, who cares what's behind?",
  "Take out the stories they've put into your mind and brace for the glory as you stare into the sky.",
  "Turning in circles, been caught in a stasis, the ancient arrival, cut to the end.",
  "How could you? / You are the morning bird / who sang me into life / everyday / fly away.",
  "If you set me free, I will not run.",
  "Tall I ride. I have the will to survive.",
  ""Fourteen years," he said, "I couldn't look into the sun."",
  ""I still feel the chill as I reveal my shame to you. I wear it like a tattoo."",
];

// pick a random title
function pickRandomTitle(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

// type anim
function typeTitleEffect(str, speed = 100, callback) {
  let index = 0;
  function type() {
    document.title = str.slice(0, index + 1);
    index++;
    if (index < str.length) {
      setTimeout(type, speed);
    } else if (callback) {
      setTimeout(callback, 500); // pause before scrolling
    }
  }
  type();
}

// scroll effect ONCE, then resets to original
function scrollTitleOnce(str, speed = 250, spacer = '     ', callback) {
  let position = 0;
  const scrollString = str + spacer;
  const totalScrolls = scrollString.length; // 1 full cycle
  function scrollStep() {
    let display = scrollString.substring(position) + scrollString.substring(0, position);
    document.title = display;
    position++;
    if (position < totalScrolls) {
      setTimeout(scrollStep, speed);
    } else if (callback) {
      setTimeout(callback, 500); // pause then reset
    }
  }
  scrollStep();
}

window.addEventListener('DOMContentLoaded', function() {
  const pickedTitle = pickRandomTitle(titles);
  typeTitleEffect(pickedTitle, 100, function() {
    // only scroll if title is long
    if (pickedTitle.length > 15) {
      scrollTitleOnce(pickedTitle, 100, '     |     ', function() {
        document.title = pickedTitle; // reset to original (end movement)
      });
    }
  });
});