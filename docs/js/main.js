'use strict'

// Burger
const navbar = document.querySelector('.navbar');

const burgerIcon = document.querySelector('.burger-icon');

burgerIcon.addEventListener('click', function () {
	this.classList.toggle('_active');
	navbar.classList.toggle('_visible')
	document.body.classList.toggle('_lock')
});


//Прилипание меню
window.addEventListener('scroll', checkMarginToTop)

let header = document.querySelector('.header');

let stickyValue = header.offsetTop;

function checkMarginToTop() {
	if (window.pageYOffset > stickyValue) {
		header.classList.add("_sticky");
	} else {
		header.classList.remove("_sticky");
	}
}

// Плавный скролл по якорям
const headerH = document.querySelector('.header').getBoundingClientRect().height - 35;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {

		e.preventDefault();

		let currentHref = this.getAttribute('href'),
			currentAnchor = document.getElementById(currentHref.substring(1)),
			currentAnchorT = currentAnchor.getBoundingClientRect().top;

		window.scrollTo({
			top: currentAnchorT - headerH + window.scrollY, // headerH не обязателен (1)
			behavior: 'smooth'
		});

	});
});

//Gallery

// массив со всеми контейнерами изображений галлереи
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
//массив под маски
const masksArray = new Array();
// сам элемент маски
const galleryMaskHover = document.querySelector('.gallery__mask-hover')

galleryItems.forEach(el => {
	// получаем src каждого изображения галлереи
	// let imgSrc = el.querySelector('img').getAttribute('src');

	let newMask = masksArray.push(galleryMaskHover.cloneNode(true));
	// передаем src изображения в href лупы
	masksArray[0].querySelector('.gallery__loop')
	// .setAttribute('href', imgSrc);

	masksArray[0].style.height = '100%'
	// вставляем маску в каждый контейнер для изображения
	el.insertAdjacentElement(
		'beforeend',
		masksArray.pop()
	)

})

// Открытие фото галереи в попапе
// получаем в переменную все ссылки по которым открываются попапы (имеют класс .popup__link)
const popupLinks = document.querySelectorAll('.popup__link');
// Получаем все ссылки-крестики, которые будут закрывать попапы
const popupCloseIcon = document.querySelectorAll('.close-popup');
// Все модальные окна имеют класс .popup, внутри .popup есть .popup__content
const popups = document.querySelectorAll('.popup');
// получаем весь body документа, чтобы блокировать скролл по нему при открытом попапе
const body = document.querySelector('body');
// всем фиксированным элементам (position:fixed) задаем класс .lock-padding, получаем
//коллекцию из этих элементов
const lockPadding = document.querySelectorAll('.lock-padding');

document.addEventListener('click', () => {
	if (event.target.closest('.popup__link')) {
		let imgSrc = event.target.closest('.popup__link').parentElement.parentElement.querySelector('.gallery__img').getAttribute('src');

		if (imgSrc != '#' && imgSrc != '') {
			let popupId = event.target.closest('.popup__link').getAttribute('href').replace('#', '');
			let requiredPopup = document.getElementById(popupId);
			requiredPopup.querySelector('img').setAttribute('src', imgSrc)
			requiredPopup.querySelector('source').setAttribute('srcset', imgSrc)
			openPopup(requiredPopup);
		}
		event.preventDefault();
	}
})

document.addEventListener('click', () => {
	if (event.target.closest('.close-popup')) {
		closePopup(event.target.closest('.popup'))
		event.preventDefault();
	}
})

popups.forEach((el) => {
	el.addEventListener('click', () => {
		if (!event.target.closest('.popup__content')) {
			closePopup(event.target.closest('.popup'))
		}
	})
})
document.addEventListener('keydown', () => {
	if (event.code === 'Escape') {
		const popupActive = document.querySelector('.popup.open');
		closePopup(popupActive)
	}
});

function openPopup(requiredPopup) {
	const popupActive = document.querySelector('.popup.open');
	if (popupActive) {
		closePopup(popupActive);
		requiredPopup.classList.add('open');
	} else {
		requiredPopup.classList.add('open');
		bodyLock();
	}
}
function bodyLock() {
	const addPadding = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
	body.style.paddingRight = addPadding;
	lockPadding.forEach((el) => {
		el.style.paddingRight = addPadding;
	});
	body.classList.add('_lock')
}
function bodyUnlock() {
	body.style.paddingRight = '0px';
	lockPadding.forEach((el) => {
		el.style.paddingRight = '0px';
	});
	body.classList.remove('_lock')
}
function closePopup(willClosePopup) {
	willClosePopup.classList.remove('open');
	bodyUnlock()
}



//Cursor

(function () {
	const cursor = document.getElementById('cursor');
	const aura = document.getElementById('aura');
	const links = Array.from(document.querySelectorAll('a'));

	let mouseX = 0, mouseY = 0, posX = 0, posY = 0;


	function mouseCoords(e) {

		// координаты относительно документа (не окна) 
		// (Свойство event.pageX содержит в себе расстояние от левой границы документа до курсора с учетом прокрутки.)
		mouseX = e.pageX;
		mouseY = e.pageY;
	}

	gsap.to({}, .01, {
		
		repeat: -1, // бесконечное повторение анимации

		//функция, которая вызывается каждый раз, когда анимация входит в новую итерацию
		onRepeat: () => {
			// вычисляем степень задержки ауры от курсора (зависит от значения делителя)

			posX += (mouseX - posX) / 5;
			posY += (mouseY - posY) / 5;

			gsap.set(cursor, {
				css: {
					left: mouseX,
					top: mouseY,
				}
			});

			gsap.set(aura, {
				css: {
					left: posX-16, // 20 - радиус ауры (см в css) минус радиус точки
					top: posY-16,
				}
			});
		}

	})

	document.body.addEventListener('mousemove', function (e) {
		mouseCoords(e);
		cursor.classList.remove('_hidden');
		aura.classList.remove('_hidden');
	}
		);

	document.body.addEventListener('mouseout', function (e) {
		cursor.classList.add('_hidden');
		aura.classList.add('_hidden');
	})

	links.forEach(el => {
		el.addEventListener('mouseover', function (e) {
			cursor.classList.add('_overlink')
			aura.classList.add('_overlink')
		});

		el.addEventListener('mouseout', function (e) {
			cursor.classList.remove('_overlink')
			aura.classList.remove('_overlink')
		})
	})

}())






