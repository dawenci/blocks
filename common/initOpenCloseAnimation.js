import { __transition_duration } from "../components/theme/var.js"

/**
 * @param {Element} $host
 */
export function initOpenCloseAnimation($host, {
  opacity,
  transform,
  onStart,
  onIteration,
  onCancel,
  onEnd
} = {}) {
  if (!$host.shadowRoot.querySelector('style.animation')) {
    const $style = document.createElement('style')
    $style.className = 'animation'
    $style.appendChild(document.createTextNode(`
      @keyframes open-animation {
        from {
          ${opacity === false ? '' : 'opacity: 0;'}
          ${transform === false ? '' : 'transform: scale(0);'}
        }
        to {
          ${opacity === false ? '' : 'opacity: 1;'}
          ${transform === false ? '' : 'transform: scale(1);'}
        }
      }
      @keyframes close-animation {
        from {
          ${opacity === false ? '' : 'opacity: 1;'}
          ${transform === false ? '' : 'transform: scale(1);'}
        }
        to {
          ${opacity === false ? '' : 'opacity: 0;'}
          ${transform === false ? '' : 'transform: scale(0);'}
        }
      }
      :host(.open-animation),
      :host(.close-animation) {
        display: block;
        pointer-events: none;
        animation-delay: 0;
        animation-duration: var(--transition-duration, ${__transition_duration});
        animation-fill-mode: forwards;
        animation-timing-function: ease-in;
      }
      :host(.open-animation) {
        animation-name: open-animation;
      }
      :host(.close-animation) {
        animation-name: close-animation;
      }
    `))
    $host.shadowRoot.insertBefore($style, $host.shadowRoot.firstElementChild)
  }

  const _onStart = e => {
    if (e.target !== $host || e.animationName !== 'open-animation' && e.animationName !== 'close-animation') return
    if (onStart) onStart(e)
  }

  const _onIteration = e => {
    if (e.target !== $host || e.animationName !== 'open-animation' && e.animationName !== 'close-animation') return
    if (onIteration) onIteration(e)
  }

  const _onCancel = e => {
    if (e.target !== $host || e.animationName !== 'open-animation' && e.animationName !== 'close-animation') return
    if (onCancel) onCancel(e)
  }

  const _onEnd = e => {
    if (e.target !== $host || e.animationName !== 'open-animation' && e.animationName !== 'close-animation') return
    $host.classList.remove('open-animation')
    $host.classList.remove('close-animation')
    if (onEnd) onEnd(e)
  }

  $host.addEventListener('animationstart', _onStart)
  $host.addEventListener('animationiteration', _onIteration)
  $host.addEventListener('animationcancel', _onCancel)
  $host.addEventListener('animationend', _onEnd)

  return () => {
    const $style = $host.shadowRoot.querySelector('style.animation')
    if ($style) {
      $host.shadowRoot.removeChild($style)
    }

    $host.removeEventListener('animationstart', _onStart)
    $host.removeEventListener('animationiteration', _onIteration)
    $host.removeEventListener('animationcancel', _onCancel)
    $host.removeEventListener('animationend', _onEnd)
  }
}
