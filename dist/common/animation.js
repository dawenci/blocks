export function transitionEnter(el, name) {
    el.classList.remove(`${name}-leave-transition-active`);
    el.classList.remove(`${name}-leave-transition-from`);
    el.classList.remove(`${name}-leave-transition-to`);
    el.classList.add(`${name}-enter-transition-active`);
    el.classList.add(`${name}-enter-transition-from`);
    el.offsetHeight;
    el.classList.replace(`${name}-enter-transition-from`, `${name}-enter-transition-to`);
}
export function transitionLeave(el, name) {
    el.classList.remove(`${name}-enter-transition-active`);
    el.classList.remove(`${name}-enter-transition-from`);
    el.classList.remove(`${name}-enter-transition-to`);
    el.classList.add(`${name}-leave-transition-active`);
    el.classList.add(`${name}-leave-transition-from`);
    el.offsetHeight;
    el.classList.replace(`${name}-leave-transition-from`, `${name}-leave-transition-to`);
}
export function doTransitionEnter(el, name, onEnd) {
    transitionEnter(el, name);
    if (el._clearOnTransitionEnd) {
        ;
        el._clearOnTransitionEnd();
    }
    ;
    el._clearOnTransitionEnd = onTransitionEnd(el, () => {
        ;
        el._clearOnTransitionEnd = null;
        clearTransition(el, name);
        if (typeof onEnd === 'function') {
            onEnd();
        }
    });
}
export function doTransitionLeave(el, name, onEnd) {
    transitionLeave(el, name);
    if (el._clearOnTransitionEnd) {
        ;
        el._clearOnTransitionEnd();
    }
    ;
    el._clearOnTransitionEnd = onTransitionEnd(el, () => {
        ;
        el._clearOnTransitionEnd = null;
        clearTransition(el, name);
        if (typeof onEnd === 'function') {
            onEnd();
        }
    });
}
export function isTransitionEnter(el, name) {
    return el.classList.contains(`${name}-enter-transition-active`);
}
export function isTransitionLeave(el, name) {
    return el.classList.contains(`${name}-leave-transition-active`);
}
export function isTransition(el, name) {
    return isTransitionEnter(el, name) || isTransitionLeave(el, name);
}
export function clearTransition(el, name) {
    el.classList.remove(`${name}-enter-transition-active`);
    el.classList.remove(`${name}-enter-transition-from`);
    el.classList.remove(`${name}-enter-transition-to`);
    el.classList.remove(`${name}-leave-transition-active`);
    el.classList.remove(`${name}-leave-transition-from`);
    el.classList.remove(`${name}-leave-transition-to`);
}
export function onTransitionEnd(el, callback) {
    const { transitionTimeout, transitionPropCount } = getTransitionInfo(el);
    const { animationTimeout, animationPropCount } = getAnimationInfo(el);
    const type = transitionTimeout >= animationTimeout ? 'TRANSITION' : 'ANIMATION';
    const timeout = type === 'TRANSITION' ? transitionTimeout : animationTimeout;
    const propCount = type === 'TRANSITION' ? transitionPropCount : animationPropCount;
    const cancelEvent = type === 'TRANSITION' ? 'transitioncancel' : 'animationcancel';
    const endEvent = type === 'TRANSITION' ? 'transitionend' : 'animationend';
    if (!propCount) {
        callback();
        return noop;
    }
    let ended = 0;
    const onEnd = (e) => {
        if (e.target === el) {
            if (++ended >= propCount || e.type === 'transitioncancel') {
                done();
            }
        }
    };
    const timeoutHandler = setTimeout(() => {
        if (ended < propCount) {
            done();
        }
    }, timeout + 1);
    const done = () => {
        clear();
        callback();
    };
    el.addEventListener(endEvent, onEnd);
    el.addEventListener(cancelEvent, onEnd);
    const clear = () => {
        clearTimeout(timeoutHandler);
        el.removeEventListener(endEvent, onEnd);
        el.removeEventListener(cancelEvent, onEnd);
    };
    return clear;
}
function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
        delays = delays.concat(delays);
    }
    return Math.max(...durations.map((duration, i) => parseFloat(duration) * 1000 + parseFloat(delays[i]) * 1000));
}
function getTransitionInfo(el) {
    const styles = window.getComputedStyle(el);
    const transitionDelays = styles.transitionDelay.split(', ');
    const transitionDurations = styles.transitionDuration.split(', ');
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations) || 0;
    const transitionPropCount = transitionTimeout && transitionDurations.length;
    const hasTransform = /\b(transform|all)(,|$)/.test(styles.transitionProperty);
    return {
        transitionTimeout,
        transitionPropCount,
        hasTransform,
    };
}
function getAnimationInfo(el) {
    const styles = window.getComputedStyle(el);
    const animationDelays = styles.animationDelay.split(', ');
    const animationDurations = styles.animationDuration.split(', ');
    const animationTimeout = getTimeout(animationDelays, animationDurations) || 0;
    const animationPropCount = animationTimeout && animationDurations.length;
    return {
        animationTimeout,
        animationPropCount,
    };
}
function noop() {
}
