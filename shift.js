(function() {
	const messages = [
		"Hello!",
		"¡Hola!",
		"sl 🚂💨",
		"That's not even funny, man!",
		"I only test on Firefox lmao",
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
		"Do you have a moment to talk about GNU / Linux?",
		"Linyos Torovoltos wrote Lunix!",
        "This guy are sick"
	];

	const wordTime = 400;
	const delay = 1600;
	const title = document.getElementById('shuffle-title');

	if (!title || messages.length < 2) {
		return;
	}

	const container = title.closest('.shuffle-container');
	let previousMessageIndex = -1;

	title.textContent = '';
	title.classList.remove('morph');
	title.style.fontFamily = 'var(--font-title)';
	if (container) {
		container.style.filter = 'none';
	}

	function pickMessageIndex() {
		let nextIndex;
		do {
			nextIndex = Math.floor(Math.random() * messages.length);
		} while (nextIndex === previousMessageIndex);
		previousMessageIndex = nextIndex;
		return nextIndex;
	}

	function typeMessage() {
		const message = messages[pickMessageIndex()];
		const words = message.match(/\S+\s*/g) || [];
		let wordIndex = 0;
		let activeWord = null;

		title.textContent = '';

		function typeNextWord() {
			if (activeWord) {
				activeWord.style.fontFamily = 'var(--font-title)';
			}

			const word = document.createElement('span');
			word.textContent = words[wordIndex++];
			word.style.fontFamily = 'mademoiselle, cursive';
			title.appendChild(word);
			activeWord = word;

			if (wordIndex < words.length) {
				window.setTimeout(typeNextWord, wordTime);
			} else {
				window.setTimeout(function() {
					activeWord.style.fontFamily = 'var(--font-title)';
					window.setTimeout(typeMessage, delay);
				}, wordTime);
			}
		}

		typeNextWord();
	}

	typeMessage();
})();
