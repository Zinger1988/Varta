"use strict"

class Modal {
    static modalElements = null;
    static activeModal = null;
    static modalOverlay = document.createElement('div');

    constructor(modalSelector) {
        Modal.modalElements = Array.from(document.querySelectorAll(modalSelector));
        Modal.modalOverlay.id = 'modal-overlay';
        Modal.setHandlers();
    }

    static setHandlers(){
        const modalButtons = document.querySelectorAll('[data-modal-id]');

        modalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault()
                if(Modal.activeModal){
                    Modal.hide();
                }
                const modalId = button.getAttribute('data-modal-id');
                Modal.show(modalId);
                Modal.showOverlay();
            })
        });

        Modal.modalOverlay.addEventListener('click', (e) => {
            Modal.hide();
            Modal.hideOverlay();
        })

        Modal.modalElements.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if(e.target.classList.contains('modal-close') || e.target.closest('.modal-close')){
                    Modal.hide();
                    Modal.hideOverlay();
                }
            })
        });
    }

    static showOverlay(){
        const overlay = document.querySelector('#modal-overlay');
        if(overlay) return;

        document.body.append(Modal.modalOverlay);
        document.body.classList.add('no-overflow');

        let alpha = .01;
        const timer = setInterval(() => {
            if (alpha >= 0.56){
                clearInterval(timer);
            } else {
                Modal.modalOverlay.style.backgroundColor = `rgba(0,0,0, ${alpha += 0.1})`;
            }
        }, 20);
    }

    static hideOverlay(){
        const overlay = document.querySelector('#modal-overlay');
        if(!overlay) return;

        document.body.classList.remove('no-overflow');

        let alpha = 0.56;
        const timer = setInterval(() => {
            if (alpha <= 0.1){
                overlay.remove()
                clearInterval(timer);
            } else {
                Modal.modalOverlay.style.backgroundColor = `rgba(0,0,0, ${alpha -= 0.1})`;
            }
        }, 20);
    }

    static show(modalId){
        const targetModal = Modal.modalElements.find(element => element.id === modalId);
        Modal.activeModal = targetModal;
        targetModal.classList.add('visible');
    }

    static hide(){
        Modal.activeModal.classList.remove('visible');
        Modal.activeModal = null;
    }
}

const SiteJS = {
    onload: document.addEventListener('DOMContentLoaded', function () {
        SiteJS.init();
    }),
    init: function () {

        if(document.querySelectorAll('.swiper').length){
            const swiper = new Swiper('.swiper', {
                loop: true,
                slidesPerView: 3,
                slidesPerGroup: 1,
                allowTouchMove: false,
                breakpoints: {
                    320: {
                        slidesPerView: 2,
                        slidesOffsetBefore: 34,
                        slidesOffsetAfter: 34,
                    },
                    768: {
                        slidesPerView: 2,
                        slidesOffsetBefore: 54,
                        slidesOffsetAfter: 54,
                    },
                    992: {
                        slidesPerView: 3,
                        slidesOffsetBefore: 60,
                        slidesOffsetAfter: 60,
                    },
                    1900: {
                        slidesOffsetBefore: 100,
                        slidesOffsetAfter: 100,
                    }
                }
            });

            const sliderPrev = document.querySelector('.product-slider__nav-btn--prev');
            sliderPrev.addEventListener('click', () => {
                swiper.forEach(elem => elem.slidePrev());
            });

            const sliderNext = document.querySelector('.product-slider__nav-btn--next');
            sliderNext.addEventListener('click', () => {
                swiper.forEach(elem => elem.slideNext());
            });
        }

        new Modal('.modal');
        this.expandTextarea('.input-text--textarea');
        this.typeDisplay();
        this.modalWinners();
    },
    typeDisplay() {
        if ("ontouchstart" in document.documentElement) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.add('hover-device');
        }
    },
    expandTextarea: function(selector){
        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
            if(el.tagName.toLowerCase() !== 'textarea') return;

            calcHeight(el);
            el.addEventListener('input', (e) => calcHeight(e.currentTarget));
        })

        function calcHeight(element) {
            element.style.height = window.getComputedStyle(element).getPropertyValue("min-height");
            element.style.height = element.scrollHeight + (element.offsetHeight - element.clientHeight) + 'px';
        }
    },
    resizeThrottler: function(cb){
        let throttle = false;

        window.addEventListener('resize', () => {
            if(!throttle) {
                throttle = true;
                setTimeout(() => {
                    cb();
                    throttle = false;
                }, 500)
            }
        })
    },
    modalWinners(){
        const modal = document.querySelector('.modal-winners');

        if(!modal) return;

        const body = modal.querySelector('.modal-winners__body');
        const inner = modal.querySelector('.modal-winners__inner');
        const items = body.querySelectorAll('.modal-winners__item');
        const title = modal.querySelector('.modal-winners__title');

        let titleDefault = null;
        let innerHeight = null;

        const TITLE_ACTIVE_CLASS = 'modal-winners__title--active';
        const BODY_ACTIVE_CLASS = 'modal-winners__body--active';
        const ITEM_ACTIVE_CLASS = 'modal-winners__item--active';
        const BREAKPOINT = '(max-width: 991px)';

        let activeIndex = -1;

        function init(index = -1){

            titleDefault = title.innerHTML;
            innerHeight = inner.offsetHeight;

            setActiveElement(index);

            if(window.matchMedia(BREAKPOINT).matches){
                inner.style.height = `${innerHeight}px`;

                if(index >=0) {
                    updateTitle(index);
                    setHeight(index)
                }
            }

            setHandlers();
        }

        function setHeight(index) {
            const list = items[index].querySelector('.modal-winners__list');
            const listHeight = list.offsetHeight;
            inner.style.height = `${listHeight}px`;
        }

        function setActiveElement(index = -1){
            items.forEach(item => item.classList.remove(ITEM_ACTIVE_CLASS));
            activeIndex = index;

            if(index >= 0){
                items[index].classList.add(ITEM_ACTIVE_CLASS);
                body.classList.add(BODY_ACTIVE_CLASS);
            } else {
                body.classList.remove(BODY_ACTIVE_CLASS);
            }
        }

        function updateTitle(index){
            const titleHTML = items[index].querySelector('.modal-winners__subtitle').innerHTML;
            title.classList.add(TITLE_ACTIVE_CLASS);
            title.innerHTML = `<b>${titleHTML}</b>`;
        }

        function resetTitle(){
            title.classList.remove(TITLE_ACTIVE_CLASS);
            title.innerHTML = titleDefault;
        }

        const buttonHandler = function() {
            const index = this.getAttribute('data-index');

            setActiveElement(index);

            if(window.matchMedia(BREAKPOINT).matches && index >=0){
                updateTitle(index);
                setHeight(index);
            }
        }

        const titleHandler = function() {
            if(title.classList.contains(TITLE_ACTIVE_CLASS) && window.matchMedia(BREAKPOINT).matches){
                inner.style.height = `${innerHeight}px`;
                setActiveElement(-1);
                resetTitle();
            }
        }

        function setHandlers(){
            items.forEach((item, index) => {
                const btn = item.querySelector('.modal-winners__subtitle');
                btn.setAttribute('data-index', index);
                btn.addEventListener('click', buttonHandler);
            })

            title.addEventListener('click', titleHandler);
        }

        function destroy(){

            setActiveElement(-1);
            resetTitle();

            titleDefault = null;
            innerHeight = null;

            body.classList.remove(BODY_ACTIVE_CLASS);
            title.classList.remove(TITLE_ACTIVE_CLASS);

            inner.style = "";

            items.forEach((item, index) => {
                const btn = item.querySelector('.modal-winners__subtitle');
                btn.removeEventListener('click', buttonHandler);
            })

            title.removeEventListener('click', titleHandler);
        }

        document.addEventListener('click', (e) => {

            if(window.matchMedia(BREAKPOINT).matches && !modal.classList.contains('visible')){
                if(activeIndex >= 0){
                    setActiveElement(-1);
                    resetTitle();
                    inner.style.height = `${innerHeight}px`;
                }
            }
        })

        this.resizeThrottler(() => {
            if(window.matchMedia(BREAKPOINT).matches){
                destroy();
                init(-1);
            } else {
                destroy();
                init(0);
            }
        })

        window.matchMedia(BREAKPOINT).matches
            ? init(-1)
            : init(0);
    }
};