import {
  __border_color_base,
  __color_primary,
  __fg_secondary,
  __fg_base,
  __height_base,
  __radius_base,
  __transition_duration,
} from '../../theme/var-light.js'

export const style = /*css*/ `
:host {
  display: inline-block;
  width: 300px;
  box-sizing: border-box;
}
#layout {
  position: relative;
}
#choose-file {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
  visibility: hidden;
}
#choose {
  position: relative;
  overflow: hidden;
}

#choose input:hover {
  outline: none;
}
#dropZone {
  position: relative;
  width: 100%;
  height: 100px;
  border: 1px dashed var(--bl-border-color-base, ${__border_color_base});
  border-radius: var(--bl-radius-base, ${__radius_base});
  background-color: rgba(0,0,0,.025);
  text-align: center;
  line-height: 100px;
  font-size: 14px;
  color: var(--bl-fg-secondary, ${__fg_secondary});
  user-select: none;
  cursor: pointer;
  transition: all var(--transition-duration, ${__transition_duration});
}
:host(:not([disabled])) #dropZone:hover {
  border-color: var(--bl-color-primary-base, ${__color_primary});
  color: var(--bl-color-primary-base, ${__color_primary});
}

:host([disabled]) #dropZone {
  cursor: not-allowed;
}


.item {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  margin-top: 5px;
  box-sizing: border-box;
  height: var(--bl-height-base, ${__height_base});
  line-height: var(--bl-height-base, ${__height_base});
  border-radius: var(--bl-radius-base, ${__radius_base});
  background-color: rgba(0,0,0,.025);
  font-size: 12px;
}
bl-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
}
.type {
  position: relative;
  flex: 0 0 var(--bl-height-base, ${__height_base});
  fill: var(--bl-fg-base, ${__fg_base});
}
.type svg {
  margin: 4px;
  width: calc(var(--bl-height-base, ${__height_base}) - 8px);
  height: calc(var(--bl-height-base, ${__height_base}) - 8px);
}
.name {
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.size {
  position: relative;
  flex: 0 0 calc(var(--bl-height-base, ${__height_base}) * 2);
  padding: 0 5px;
  text-align: right;
  color: var(--bl-fg-secondary, ${__fg_secondary});
  font-size: 10px;
}
`
