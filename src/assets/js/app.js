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
            button.addEventListener('click', () => {
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
        const swiper = new Swiper('.swiper', {
            loop: false,
            slidesPerView: "auto",
            slidesPerGroup: 1,
            allowTouchMove: false,
            breakpoints: {
                320: {
                    slidesOffsetBefore: 34,
                    slidesOffsetAfter: 34,
                },
                768: {
                    slidesOffsetBefore: 44,
                    slidesOffsetAfter: 44,
                },
                992: {
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

        new Modal('.modal');
        this.expandTextarea('.input-text--textarea');
        // this.tabs();
        this.typeDisplay();
        this.fixedHeader();
    },
    typeDisplay() {
        if ("ontouchstart" in document.documentElement) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.add('hover-device');
        }
    },
    tabs(){
        const elements = document.querySelectorAll('[data-tab-group]');
        if(!elements.length) return;

        const groups = [];

        elements.forEach(element => {
            const groupName = element.getAttribute('data-tab-group');
            let targetGroup = groups.find(group => groupName === group.name);

            if(!targetGroup){
                groups.push({
                    name: groupName,
                    anchors: [],
                    contentElements: []
                })
                targetGroup = groups[groups.length - 1]
            }

            const isAnchor = element.hasAttribute('data-tab-anchor');
            if(isAnchor){
                targetGroup.anchors.push(element);
            } else {
                targetGroup.contentElements.push(element);
            }
        });

        function showContent(activeAnchor, group){
            const anchorTarget = activeAnchor.getAttribute('data-tab-anchor');

            group.contentElements.forEach(element => {
                const elementID = element.getAttribute('data-tab-content-id')
                anchorTarget === elementID
                    ? element.style = ''
                    : element.style.display = 'none';
            })

            group.anchors.forEach(anchor => {
                anchor.removeAttribute('data-tab-active','');

                if(anchor === activeAnchor){
                    anchor.setAttribute('data-tab-active','');
                }
            })
        }

        groups.forEach( group => {
            group.anchors.forEach(anchor => {
                if(anchor.hasAttribute('data-tab-active')){
                    showContent(anchor, group);
                }
                anchor.addEventListener('click', () => {
                    showContent(anchor, group);
                })
            })
        })
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
    fixedHeader() {
        const header = document.querySelector('.page-header');

        window.addEventListener('scroll', (e)=> {
            if (document.documentElement.scrollTop > 300) {
                header.classList.add('page-header--fixed');
            } else {
                header.classList.remove('page-header--fixed');
            }
        })

        window.addEventListener('DOMContentLoaded', () => {
            if (document.documentElement.scrollTop > 300) {
                header.classList.add('page-header--fixed');
            }
        })
    },
};