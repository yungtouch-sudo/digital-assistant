window.addEventListener("load", () => {
	const mockNotification = {
		notification1: {
			text: "Добро пожаловать на наш сайт! <br> <br> Я - цифровой помощник, который будет помогать тебе в заполнении заявки на грант/конкурс, а также буду уведомлять тебя о разных событиях на сайте. ",
			url: undefined,
			linkName: undefined,
		},
		notification2: {
			text: "Для участия необходимо: <br> <br> 1. Пройти верификацию учетной записи в системе «Молодёжь России» с помощью портала Госуслуг. (С этим вы успешно справились)",
			url: undefined,
			linkName: undefined,
		},
		notification3: {
			text: "2. Заполнить все обязательные поля проектной формы в разделе «Мои проекты»",
			url: "javascript:void(0)",
			linkName: "Перейти в мои проекты",
		},
		notification4: {
			text: "3. Подать заявку на грантовый конкурс в разделе «Мои мероприятия»",
			url: "javascript:void(0)",
			linkName: "Перейти в мои мероприятия",
		},
		notification5: {
			text: "Всероссийский конкурс молодёжных проектов проводится в соответствии с Постановлением Правительства Российской Федерации от 15 сентября 2020 года № 1436 «Об утверждении Правил предоставления грантов в форме субсидий из федерального бюджета победителям Всероссийского конкурса молодёжных проектов» (далее – Правила) не менее 1 раза в год. Цель конкурса – вовлечение молодёжи в творческую деятельность и социальную практику, повышение гражданской активности, формирование здорового образа жизни, создание эффективной системы социальных лифтов для самореализации молодежи и раскрытие потенциала молодежи в интересах развития страны.",
			url: undefined,
			linkName: undefined,
		},
	};

	const grandForm = document.querySelector(".grand-form");
	const grandFormSend = document.querySelector(".js-submit-grand-form");
	const grandFormInputs = grandForm.querySelectorAll("input");
	grandFormInputs.forEach((el) => {
		el.addEventListener("input", (e) => {
			if (e.target.value.length <= 5) {
				el.style.borderColor = "#FF0000";
				el.setAttribute("data-valid", false);
			} else {
				el.style.borderColor = "#8C62D9";
				el.setAttribute("data-valid", true);
			}
		});
	});

	grandFormSend.addEventListener("click", () => {
		let formData = {};

		for (let i = 0; i < grandFormInputs.length; i++) {
			if (grandFormInputs[i].getAttribute("data-valid") === "false") {
				if (document.querySelector(".digital-assistant")) {
					window.addNotificationDefault(
						"Форму не получится отправить, пока она не будет заполнена полностью))",
						undefined,
						undefined,
					);
				}
				return false;
			}
		}
		for (let i = 0; i < grandFormInputs.length; i++) {
			formData[grandFormInputs[i].name] = grandFormInputs[i].value;
		}
		let dataArray = Object.values(formData);
		let result = dataArray
			.map((el) => {
				return `<span>${el}</span>`;
			})
			.join("<br>");

		if (document.querySelector(".digital-assistant")) {
			window.addNotificationGrand(
				`Спасибо за заявку, но меня еще не внедрили на настоящий сайт росмолодёжи, но данные мы от вас получили. Сохраните их и не потеряйте! <br> <br> ${result}`,
			);
		}
	});

	new StickySidebar("#sidebar", {
		topSpacing: 0,
		bottomSpacing: 0,
		containerSelector: ".js-content",
		innerWrapperSelector: ".sidebar__inner",
	});

	new Swiper(".swiper.ticker__swiper", {
		slidesPerView: 5,
		spaceBetween: 220,
		speed: 1000,
		loopedSlides: 5,
		loop: true,
		allowTouchMove: false,
		autoplay: {
			delay: 0,
			disableOnInteraction: false,
		},
		breakpoints: {
			0: {
				direction: "vertical",
				autoplay: {
					reverseDirection: false,
				},
			},
		},
	});

	const addProjectBtn = document.querySelector(".js-add-project");
	const addProjectPopup = document.querySelector(".js-project-popup");
	const closeProjectPopup = document.querySelector(
		".js-project-template-popup-close",
	);
	const dom = document.querySelector("html");

	addProjectBtn.addEventListener("click", (e) => {
		e.preventDefault();
		addProjectPopup.classList.add("isOpen");
		dom.classList.add("scroll-disabled");
	});

	closeProjectPopup.addEventListener("click", (e) => {
		e.preventDefault();
		addProjectPopup.classList.remove("isOpen");
		dom.classList.remove("scroll-disabled");
	});

	const leftMainMenu = document.querySelector(".js-left-main");
	const rigthMainMenu = document.querySelector(".js-left-project");

	const mainTab = document.querySelector(".js-main-tab");
	const myProjectTab = document.querySelector(".js-myproject-tab");
	const grandTab = document.querySelector(".js-grant-tab");

	const backTabBtn = document.querySelector(".js-go-back");
	const myProjectBtn = document.querySelector(".js-my-project");
	const indexBtn = document.querySelector(".js-index-btn");
	const openGrandForm = document.querySelector(".js-open-grand");

	myProjectBtn.addEventListener("click", (e) => {
		e.preventDefault();
		myProjectTab.classList.add("active");
		mainTab.classList.remove("active");
	});

	indexBtn.addEventListener("click", (e) => {
		e.preventDefault();
		myProjectTab.classList.remove("active");
		mainTab.classList.add("active");

		leftMainMenu.classList.add("active");
		rigthMainMenu.classList.remove("active");
		grandTab.classList.remove("active");
	});

	backTabBtn.addEventListener("click", (e) => {
		e.preventDefault();
		myProjectTab.classList.add("active");
		mainTab.classList.remove("active");
		grandTab.classList.remove("active");

		leftMainMenu.classList.add("active");
		rigthMainMenu.classList.remove("active");
	});

	openGrandForm.addEventListener("click", (e) => {
		e.preventDefault();
		myProjectTab.classList.remove("active");
		mainTab.classList.remove("active");
		grandTab.classList.add("active");

		addProjectPopup.classList.remove("isOpen");
		dom.classList.remove("scroll-disabled");

		leftMainMenu.classList.remove("active");
		rigthMainMenu.classList.add("active");
	});

	// Тесты

	if (document.querySelector(".digital-assistant")) {
		let click = 0;

		window.addEventListener("click", function () {
			click++;
			if (click == 1) {
				this.removeEventListener("click", arguments.callee, false);
			}

			setTimeout(() => {
				window.addNotificationDefault(
					mockNotification["notification1"].text,
					mockNotification["notification1"].url,
					mockNotification["notification1"].linkName,
				);
			}, 3000);

			setTimeout(() => {
				window.addNotificationDefault(
					mockNotification["notification2"].text,
					mockNotification["notification2"].url,
					mockNotification["notification2"].linkName,
				);
			}, 5000);

			setTimeout(() => {
				window.addNotificationDefault(
					mockNotification["notification3"].text,
					mockNotification["notification3"].url,
					mockNotification["notification3"].linkName,
				);
			}, 6000);
			setTimeout(() => {
				window.addNotificationDefault(
					mockNotification["notification4"].text,
					mockNotification["notification4"].url,
					mockNotification["notification4"].linkName,
				);
			}, 7000);

			setTimeout(() => {
				window.addNotificationDefault(
					mockNotification["notification5"].text,
					mockNotification["notification5"].url,
					mockNotification["notification5"].linkName,
				);
			}, 7000);
		});
	}
});
