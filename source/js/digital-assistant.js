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
		"https://cdn.tmweb.ru/other/youthbit/simplebar.css",
		"https://cdn.tmweb.ru/other/youthbit/simplebar.js",
		"https://cdn.tmweb.ru/other/youthbit/digital-assistant.css",
	];

	Promise.all(libsUrls.map(loadScript)).then(libsIsLoaded);

	const DIGITAL_ASSISTANT_HEIGHT = 435;

	const digitalAssistantTemplate = () => {
		return `<a class="digital-assistant js-digital-assistant" href="javascript:void(0)">
		<span class="counter js-digital-counter" data-counter="0">0</span>
		<div class="digital-assistant__wrap">
			<ul class="digital-assistant__ball">
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
				<li class="ring"></li>
			</ul>
		</div>
	</a>`;
	};

	document
		.querySelector("body")
		.insertAdjacentHTML("beforeend", digitalAssistantTemplate());

	const clueTemplate = (y) => {
		return `<div class="clue js-clue" style="top:${
			y - DIGITAL_ASSISTANT_HEIGHT - 100
		}px;">
		<div class="clue__head">
			<p class="clue__notification">Уведомления : <span class="js-notification-counter">0</span></p>
			<a class="js-clear-notification" href="javascript:void(0)">
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
				<ul class="clue__notification js-clue-notification">
				
				</ul>
			</div>
			<div class="clue__scroll-container clue__scroll-container--helper js-custom-scroll js-helper-tab">
				<ul class="clue__helper js-clue-helper"></ul>
			</div>
		</div>
	</div>`;
	};

	const clueHelperTemplate = (text, link, name, helperId) => {
		return `<li id=${helperId}>
		<div>
			<p class="js-voice-text">${text}</p>
			<a class="render-voice-btn js-render-voice-btn" href="javascript:void(0)">
				<img src="https://cdn.tmweb.ru/other/youthbit/icon-mic.svg" alt="Иконка микрофона">
			</a>
		</div>
		${link === undefined ? "" : `<a class="link" href="${link}">${name}</a>`} 
	</li>`;
	};

	const clueTollTemplate = (id) => {
		return `<i class="js-clue-toll clue-toll" id="${id}">
		<img src="https://cdn.tmweb.ru/other/youthbit/icon-toll.svg" alt="Иконка помощи">
	</i>`;
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

	window.addEventListener("click", (e) => {
		const target = e.target;
		if (
			!target.closest(".js-clue") &&
			!target.closest(".js-digital-assistant") &&
			!target.closest(".js-clue-toll") &&
			!target.closest("button") &&
			!target.closest("label")
		) {
			digitalAssistantClue.classList.remove("isOpen");
			synth.cancel();
		}
	});

	window.addEventListener("resize", (e) => {
		digitalAssistantClue.style.top = `${
			document.querySelector(".js-digital-assistant").getBoundingClientRect()
				.top - DIGITAL_ASSISTANT_HEIGHT
		}px`;
	});

	clues.forEach((clue) => {
		clue.classList.add("clue-item");

		let tollId = nanoid();
		let helperId = nanoid();
		let clueId = nanoid();

		clue.setAttribute("id", clueId);

		clue.insertAdjacentHTML("beforeend", clueTollTemplate(tollId));
		let toolElement = document.querySelector(`#${tollId}`);
		toolElement.addEventListener("click", (e) => {
			e.stopPropagation();
			const helperList = digitalAssistantClue.querySelector(".js-clue-helper");
			helperList.innerHTML = "";
			if (clue.getAttribute("data-clue-link")) {
				if (clue.hasAttribute("data-clue-link-name")) {
					if (clue.getAttribute("data-clue-link") === "") {
						clue.setAttribute("data-clue-link-name", "Ссылка");
					}
				} else {
					clue.setAttribute("data-clue-link-name", "Ссылка");
				}
				helperList.insertAdjacentHTML(
					"beforeend",
					clueHelperTemplate(
						clue.getAttribute("data-clue-text"),
						clue.getAttribute("data-clue-link"),
						clue.getAttribute("data-clue-link-name"),
						helperId,
					),
				);
			} else {
				helperList.insertAdjacentHTML(
					"beforeend",
					clueHelperTemplate(
						clue.getAttribute("data-clue-text"),
						undefined,
						undefined,
						helperId,
					),
				);
			}

			let soundBtn = document.querySelector(
				`#${helperId} .js-render-voice-btn`,
			);

			synth.cancel();

			soundBtn.addEventListener("click", (e) => {
				e.preventDefault();
				let text = clue.getAttribute("data-clue-text");
				convertText(text);
			});

			digitalAssistantClue.classList.add("isOpen");
			document.querySelector(".js-toggler").classList.add("isHelper");
			document.querySelector(".js-notification-tab").classList.remove("active");
			document.querySelector(".js-helper-tab").classList.add("active");
			new Audio("https://cdn.tmweb.ru/other/youthbit/notification.mp3").play();
		});
	});

	const notificationList = document.querySelector(".js-clue-notification");

	window.addNotificationGrand = (text) => {
		let id = nanoid();
		notificationList.insertAdjacentHTML(
			"afterbegin",
			`<li id="${id}">
<div>
	<p class="js-voice-text">${text}</p>
	<a class="render-voice-btn js-render-voice-btn" href="javascript:void(0)">
		<img src="https://cdn.tmweb.ru/other/youthbit/icon-mic.svg" alt="Иконка микрофона">
	</a>
</div>
</li>`,
		);

		let speachElement = document.querySelector(`#${id} .js-render-voice-btn`);

		speachElement.addEventListener("click", (e) => {
			e.preventDefault();
			let text = speachElement
				.closest("li")
				.querySelector(".js-voice-text").innerHTML;
			convertText(text);
		});

		digitalAssistantClue.classList.add("isOpen");
		document.querySelector(".js-toggler").classList.remove("isHelper");
		document.querySelector(".js-helper-tab").classList.remove("active");
		document.querySelector(".js-notification-tab").classList.add("active");
		const digitalCounter = document.querySelector(".js-digital-counter");

		const notificationCounter = document.querySelector(
			".js-notification-counter",
		);
		notificationCounter.innerHTML = Number(notificationCounter.innerHTML) + 1;
		digitalCounter.innerHTML = Number(digitalCounter.innerHTML) + 1;
		digitalCounter.setAttribute(
			"data-counter",
			Number(digitalCounter.innerHTML) + 1,
		);

		new Audio("https://cdn.tmweb.ru/other/youthbit/notification.mp3").play();
	};

	window.addNotificationDefault = (text, url, linkName) => {
		let id = nanoid();
		notificationList.insertAdjacentHTML(
			"afterbegin",
			`<li id="${id}">
<div>
	<p class="js-voice-text">${text}</p>
	<a class="render-voice-btn js-render-voice-btn" href="javascript:void(0)">
		<img src="https://cdn.tmweb.ru/other/youthbit/icon-mic.svg" alt="Иконка микрофона">
	</a>
</div>
		${url === undefined ? "" : `<a class="link" href="${url}">${linkName}</a>`}
</li>`,
		);

		let speachElement = document.querySelector(`#${id} .js-render-voice-btn`);

		speachElement.addEventListener("click", (e) => {
			e.preventDefault();
			let text = speachElement
				.closest("li")
				.querySelector(".js-voice-text").innerHTML;
			convertText(text);
		});

		digitalAssistantClue.classList.add("isOpen");
		document.querySelector(".js-toggler").classList.remove("isHelper");
		document.querySelector(".js-helper-tab").classList.remove("active");
		document.querySelector(".js-notification-tab").classList.add("active");
		const digitalCounter = document.querySelector(".js-digital-counter");

		const notificationCounter = document.querySelector(
			".js-notification-counter",
		);
		notificationCounter.innerHTML = Number(notificationCounter.innerHTML) + 1;
		digitalCounter.innerHTML = Number(digitalCounter.innerHTML) + 1;
		digitalCounter.setAttribute(
			"data-counter",
			Number(digitalCounter.innerHTML) + 1,
		);
		new Audio("https://cdn.tmweb.ru/other/youthbit/notification.mp3").play();
	};

	const initLibs = () => {
		document.querySelectorAll(".js-custom-scroll").forEach((el) => {
			new SimpleBar(el, {
				autoHide: false,
			});
		});
	};

	document
		.querySelector(".js-clear-notification")
		.addEventListener("click", (e) => {
			e.preventDefault();
			document.querySelector(".js-notification-counter").innerHTML = "0";
			document.querySelector(".js-digital-counter").innerHTML = "0";
			document
				.querySelector(".js-digital-counter")
				.setAttribute("data-counter", 0);
			document.querySelector(".js-clue-notification").innerHTML = "";
			synth.cancel();
		});

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
		synth.cancel();
	});

	var synth = window.speechSynthesis;
	var voices = [];
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = function () {
			voices = synth.getVoices();
		};
	}
});
