(function(){
    'use strict';

    let drumkit = {};
    let els = {};
    let state = {};

    drumkit.playSound = (e) => {
        e = e || window.event;

        els = {
            audio: document.querySelector(`audio[data-key="${e.keyCode}"]`),
            pads: document.querySelectorAll('.pad'),
            pad: document.querySelector(`.pad[data-key="${e.keyCode}"]`)
        };

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

        els.pads.forEach(pad => pad.addEventListener('keyup', drumkit.removePressed));
        els.pads.forEach(pad => pad.addEventListener('animationend', drumkit.removeAnimation));

        if (!els.audio) {
            return; // stop the function from running all together
        }

        els.audio.currentTime = 0; // rewind to the start
        els.audio.play();
        state.pressed();
        state.inactive();
        void els.pad.offsetWidth; // reset animation
        state.active();
    };

    drumkit.removePressed = () => {
        if (!els.audio) {
            return;
        }
        state.depressed();
    };

    drumkit.removeAnimation = function () {
        this.classList.remove('pad--active');
    };

    drumkit.init = () => {
        window.addEventListener('keydown', drumkit.playSound.bind(drumkit));
        window.addEventListener('keyup', drumkit.removePressed.bind(drumkit));
    };

    drumkit.init();
}());
