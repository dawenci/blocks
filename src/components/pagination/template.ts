import { BlocksIcon } from '../icon/index.js'
import {
  __border_color_base,
  __border_color_disabled,
  __color_primary,
  __color_primary_dark,
  __color_primary_light,
  __fg_base,
  __fg_disabled,
  __height_base,
  __height_large,
  __height_small,
  __radius_base,
  __transition_duration,
} from '../../theme/var-light.js'

let templateCache: {
  comTemplate: HTMLTemplateElement
  itemTemplate: HTMLButtonElement
  moreTemplate: BlocksIcon
}

export function template() {
  if (templateCache) return templateCache

  const comTemplate = document.createElement('template')
  comTemplate.innerHTML = /*html*/ `<style>
  :host {
    --button-size: var(--bl-height-base, ${__height_base});
  
    display: block;
    box-sizing: border-box;
  }
  :host([size="small"]) {
    --button-size: var(--bl-height-small, ${__height_small});
  }
  :host([size="large"]) {
    --button-size: var(--bl-height-large, ${__height_large});
  }
  
  #layout {
    display: flex;
    flex-flow: row nowrap;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    min-width: var(--button-size);
    height: var(--button-size);
    line-height: var(--button-size);
    margin: 0 2px;
    padding: 0 calc(var(--button-size) / 4px);
    border: 0;
    border: 1px solid var(--bl-border-color-base, ${__border_color_base});
    background: none;
    border-radius: var(--bl-radius-base, ${__radius_base});
    cursor: pointer;
    color: var(--bl-fg-base, ${__fg_base});
    fill: var(--bl-fg-base, ${__fg_base});
    transition: all var(--transition-duration, ${__transition_duration});
  }
  button.current {
    color: var(--bl-color-primary-base, ${__color_primary});
    fill: var(--bl-color-primary-base, ${__color_primary});
    border-color: var(--bl-color-primary-base, ${__color_primary});
  }
  button:hover {
    color: var(--bl-color-primary-hover, ${__color_primary_light});
    fill: var(--bl-color-primary-hover, ${__color_primary_light});
    border-color: var(--bl-color-primary-hover, ${__color_primary_light});
  }
  button:active {
    color: var(--bl-color-primary-active, ${__color_primary_dark});
    fill: var(--bl-color-primary-active, ${__color_primary_dark});
    border-color: var(--bl-color-primary-active, ${__color_primary_dark});
  }
  button:focus {
    outline: none;
  }
  
  button[disabled],
  button[disabled]:hover,
  button[disabled]:active,
  :host([disabled]) button,
  :host([disabled]) button:hover,
  :host([disabled]) button:active {
    color: var(--bl-fg-disabled, ${__fg_disabled});
    fill: var(--bl-fg-disabled, ${__fg_disabled});
    border-color: var(--bl-border-color-disabled, ${__border_color_disabled});
    cursor: not-allowed;
  }
  
  bl-icon {
    width: 14px;
    height: 14px;
    vertical-align: middle;
    cursor: inherit;
  }
  
  #pager {
    display: flex;
    flex-flow: row nowrap;
  }
  #items {
    display: flex;
    flex-flow: row nowrap;
  }
  </style>
  
  <div id="layout">
    <div id="total"></div>
    <div id="sizes"></div>
    <div id="pager">
      <button id="prev"><bl-icon value="left"></button>
      <div id="items"></div>
      <button id="next"><bl-icon value="right"></button>
    </div>
    <div id="jump"></div>
  </div>`

  const itemTemplate = document.createElement('button')

  const moreTemplate = document.createElement('bl-icon')
  moreTemplate.value = 'more'

  return (templateCache = {
    comTemplate,
    itemTemplate,
    moreTemplate,
  })
}
