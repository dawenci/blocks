import {
  __border_color_base,
  __color_primary_light,
} from '../../theme/var-light.js'

let templateCache: {
  cssTemplate: HTMLStyleElement
}

export function template() {
  if (templateCache) return templateCache

  const cssTemplate = document.createElement('style')
  cssTemplate.textContent = /*css*/ `
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
    position: relative;
    z-index: 0;
    background: #f3f3f3;
    color: $--color-text-regular;
  }
  :host([border]) {
    border: 1px solid var(--bl-border-color-base, ${__border_color_base});
  }
  
  #fixed-left-shadow,
  #fixed-right-shadow {
    position: absolute;
    top: 0;
    bottom: 6px;
    width: 5px;
    pointer-events: none;
  }
  #fixed-left-shadow {
    border-left: 1px solid var(--bl-border-color-base, ${__border_color_base});
    background-image: linear-gradient(to right, rgba(0,0,0,.1), rgba(0,0,0,.0))
  }
  #fixed-right-shadow {
    border-right: 1px solid var(--bl-border-color-base, ${__border_color_base});
    background-image: linear-gradient(to left, rgba(0,0,0,.1), rgba(0,0,0,.0))
  }
  
  /* 列宽调整柄 */
  #resize-handle {
    position: absolute;
    z-index: 2;
    top: 0;
    right: auto;
    bottom: auto;
    left: -6px;
    width: 6px;
    user-select: none;
    cursor: col-resize;
  }
  #resize-handle::before,
  #resize-handle::after {
    position: absolute;
    content: '';
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
  #resize-handle::before {
    width: 100%;
    height: 100%;
  }
  #resize-handle::after {
    width: 1px;
    height: 100%;
  }
  #resize-handle:hover::before,
  :host(.resizing) #resize-handle::before {
    background-color: var(--bl-color-primary-hover, ${__color_primary_light});
    opacity: .5;
  }
  #resize-handle:hover::after,
  :host(.resizing) #resize-handle::after {
    background-color: var(--bl-color-primary-hover, ${__color_primary_light});
  }
  `

  return (templateCache = {
    cssTemplate,
  })
}
