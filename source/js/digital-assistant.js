window.addEventListener("load", () => {
	let nanoid = function () {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	};

	function convertText(e) {
		var utterThis = new SpeechSynthesisUtterance(e);
		utterThis.voice = voices[4];
		synth.speak(utterThis);
	}

	const head = document.querySelector("head");
	const globalStyles = document.querySelector('link[rel="stylesheet"]');

	function loadScript(src) {
		return new Promise((resolve) => {
			if (src.split(".").pop() === "css") {
				const link = document.createElement("link");
				link.rel = "stylesheet";
				link.type = "text/css";
				link.onload = resolve;
				link.setAttribute("href", src);
				head.insertBefore(link, globalStyles);
			}
			if (src.split(".").pop() === "js") {
				const script = document.createElement("script");
				script.setAttribute("async", "");
				script.onload = resolve;
				script.setAttribute("src", src);
				head.insertBefore(script, globalStyles);
			}
		});
	}

	const libsUrls = [
		"https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.css",
		"https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.js",
	];

	Promise.all(libsUrls.map(loadScript)).then(libsIsLoaded);

	const DIGITAL_ASSISTANT_HEIGHT = 420;

	const clueTemplate = (y) => {
		return `<div class="clue js-clue" style="top:${
			y - DIGITAL_ASSISTANT_HEIGHT
		}px;">
		<div class="clue__head">
			<p class="clue__notification">У вас <span>6</span> уведомлений!</p>
			<a href="javascript:void(0)">
				<img src="https://cdn.tmweb.ru/other/youthbit/icon-notification-reset.svg" alt="Очистка уведомлений">
			</a>
		</div>
		<div class="clue__panel js-toggler">
			<span class="clue__panel-checked clue__panel-checked--notification">Уведомления</span>
			<a class="clue__panel-toggler" href="javascript:void(0)"><span></span></a>
			<span class="clue__panel-checked clue__panel-checked--helper">Помощник</span>
		</div>
		<div class="clue__tabs">
			<div
				class="clue__scroll-container clue__scroll-container--notification js-custom-scroll js-notification-tab active">
				<ul class="clue__notification js-clue-notification"></ul>
			</div>
			<div class="clue__scroll-container clue__scroll-container--helper js-custom-scroll js-helper-tab">
				<ul class="clue__helper js-clue-helper"></ul>
			</div>
		</div>
	</div>`;
	};

	const clueNotificationTemplate = () => {
		return `<li>
		<div>
			<p class="js-voice-text">Ваша заявка на конкурс успешно прошла модерацию!</p>
			<a class="render-voice-btn js-render-voice-btn" href="javascript:void(0)">
				<img src="https://cdn.tmweb.ru/other/youthbit/icon-mic.svg" alt="Иконка микрофона">
			</a>
		</div>
		<a class="link" href="javascript:void(0)">Перейти к заявке</a>
	</li>`;
	};

	const clueHelperTemplate = (text, link, helperId) => {
		return `<li id=${helperId}>
		<div>
			<p class="js-voice-text">${text}</p>
			<a class="render-voice-btn js-render-voice-btn" href="javascript:void(0)">
				<img src="https://cdn.tmweb.ru/other/youthbit/icon-mic.svg" alt="Иконка микрофона">
			</a>
		</div>
		${
			link === undefined
				? ""
				: '<a class="link" href="javascript:void(0)">Перейти к заявке</a>'
		} 
	</li>`;
	};

	const clueTollTemplate = (y, x, id) => {
		console.log(y, x, id);
		return `<a class="js-clue-toll clue-toll" href="javascript:void(0)" style="top: ${y}px; right:${x}px" id="${id}">
		<img src="https://cdn.tmweb.ru/other/youthbit/icon-toll.svg" alt="Иконка помощи">
	</a>`;
	};

	const clues = document.querySelectorAll("[data-clue-text]");
	const digitalAssistant = document.querySelector(".js-digital-assistant");
	const digitalAssistantCoords = digitalAssistant.getBoundingClientRect();

	document
		.querySelector("body")
		.insertAdjacentHTML("beforeend", clueTemplate(digitalAssistantCoords.top));

	const digitalAssistantClue = document.querySelector(".js-clue");

	digitalAssistant.addEventListener("click", (e) => {
		digitalAssistantClue.classList.add("isOpen");
	});

	window.addEventListener("resize", (e) => {
		console.log(digitalAssistantClue);
		digitalAssistantClue.style.top = `${
			document.querySelector(".js-digital-assistant").getBoundingClientRect()
				.top - DIGITAL_ASSISTANT_HEIGHT
		}px`;
	});

	clues.forEach((clue) => {
		clue.classList.add("clue-item");
		let clueCoords = clue.getBoundingClientRect();

		let tollId = nanoid();
		let helperId = nanoid();
		document
			.querySelector("body")
			.insertAdjacentHTML(
				"beforeend",
				clueTollTemplate(clueCoords.top, clueCoords.right, tollId),
			);
		document.querySelector(`#${tollId}`).addEventListener("focus", () => {
			const helperList = digitalAssistantClue.querySelector(".js-clue-helper");
			helperList.innerHTML = "";
			if (clue.getAttribute("data-clue-link")) {
				helperList.insertAdjacentHTML(
					"beforeend",
					clueHelperTemplate(
						clue.getAttribute("data-clue-text"),
						clue.getAttribute("data-clue-link"),
						helperId,
					),
				);
			} else {
				helperList.insertAdjacentHTML(
					"beforeend",
					clueHelperTemplate(
						clue.getAttribute("data-clue-text"),
						undefined,
						helperId,
					),
				);
			}

			let soundBtn = document.querySelector(
				`#${helperId} .js-render-voice-btn`,
			);

			soundBtn.addEventListener("click", (e) => {
				e.preventDefault();
				let text = clue.getAttribute("data-clue-text");
				convertText(text);
			});

			digitalAssistantClue.classList.add("isOpen");
		});
	});

	const initLibs = () => {
		document.querySelectorAll(".js-custom-scroll").forEach((el) => {
			console.log(el);
			new SimpleBar(el, {
				autoHide: false,
			});
		});
	};

	function libsIsLoaded() {
		initLibs();
	}

	const clueToggler = document.querySelector(".js-toggler");
	const clueBtn = clueToggler.querySelector("a");
	const notificationTab = document.querySelector(".js-notification-tab");
	const helperTab = document.querySelector(".js-helper-tab");

	clueBtn.addEventListener("click", (e) => {
		e.preventDefault();
		clueToggler.classList.toggle("isHelper");
		new Audio("https://cdn.tmweb.ru/other/youthbit/toggle.mp3").play();
		if (clueToggler.classList.contains("isHelper")) {
			notificationTab.classList.remove("active");
			helperTab.classList.add("active");
		} else {
			notificationTab.classList.add("active");
			helperTab.classList.remove("active");
		}
	});

	var synth = window.speechSynthesis;
	var voices = [];
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = function () {
			voices = synth.getVoices();
		};
	}
});
