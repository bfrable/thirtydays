(function(){
    'use strict';

    let drumkit, els, state;

    drumkit = {};
    els = { pads: document.querySelectorAll('.pad') };
    state = {};

    drumkit.triggerKeyboardEvent = (el, keyCode, event) => {
        var eventObj = document.createEventObject ? document.createEventObject() : document.createEvent('Events');

        if(eventObj.initEvent){
            eventObj.initEvent(event, true, true);
        }

        eventObj.keyCode = keyCode;
        eventObj.which = keyCode;

        el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent(event, eventObj); // eslint-disable-line
    };

    drumkit.playSound = (e) => {
        e = e || window.event;

        state = {
            pressed: () => {
                els.pad.classList.add('pad--pressed');
            },
            active: () => {
                els.pad.classList.add('pad--active');
            },
            inactive: () => {
                els.pad.classList.remove('pad--active');
            },
            depressed: () => {
                [].forEach.call(els.pads, function(pad) {
                    pad.classList.remove('pad--pressed');
                });
            }
        };

        els = {
            audio: document.querySelector(`audio[data-key="${e.keyCode}"]`),
            pads: document.querySelectorAll('.pad'),
            pad: document.querySelector(`.pad[data-key="${e.keyCode}"]`)
        };

        if (!els.audio) {
            console.log('error');
            return; // stop the function from running all together
        }

        els.pads.forEach(pad => pad.addEventListener('animationend', drumkit.removeAnimation));

        els.audio.currentTime = 0; // rewind to the start
        els.audio.play();
        state.pressed();
        state.inactive();
        void els.pad.offsetWidth; // reset animation
        state.active();
    };

    drumkit.removePressed = () => {
        if (!els.audio) { return; }

        state.depressed();
    };

    drumkit.removeAnimation = function () {
        this.classList.remove('pad--active');
    };

    drumkit.init = () => {
        window.addEventListener('keydown', function(){
            drumkit.playSound();
        });

        window.addEventListener('keyup', drumkit.removePressed.bind(drumkit));

        [].forEach.call(els.pads, function(pad) {
            pad.addEventListener('click', function(){
                drumkit.keyCode = this.dataset.key;

                drumkit.triggerKeyboardEvent(this, drumkit.keyCode, 'keydown');
                setTimeout(function() {
                    drumkit.triggerKeyboardEvent(this, drumkit.keyCode, 'keyup');
                }, 200);
            });
        });
    };

    drumkit.init();
}());
