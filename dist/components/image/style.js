import { __fg_placeholder, __height_base, __transition_duration } from '../../theme/var-light.js';
export const style = `
/* <component>image */
:host {
  overflow: hidden;
  display: inline-block;
  box-sizing: border-box;
  min-width: calc(var(--bl-height-base, ${__height_base}) * 2);
  min-height: calc(var(--bl-height-base, ${__height_base}) * 2);
}
#layout {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
}
#img {
  position: relative;
  overflow: hidden;
  display: block;
  width: 100%;
  height: 100%;
  transition: opacity var(--bl-transition-duration, ${__transition_duration});
}

#placeholder,
#fallback {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  pointer-events: none;
}

#placeholder img,
#fallback img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}

#placeholder .default,
#fallback .default {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

#placeholder .custom,
#fallback .custom {
  width: 100%;
  height: 100%;
}

:host([placeholder]) #placeholder .default,
:host([fallback]) #fallback .default {
  display: none;
}

:host(:not([placeholder])) #placeholder .custom,
:host(:not([fallback])) #fallback .custom {
  display: none;
}

#placeholder bl-loading,
#fallback bl-icon {
  position: relative;
  margin: 0;
  width: var(--bl-height-base, ${__height_base});
  height: var(--bl-height-base, ${__height_base});
  fill: #aaa;
}

.placeholderText,
.fallbackText {
  margin-top: 5px;
  font-size: 12px;
  color: var(--bl-fg-placeholder, ${__fg_placeholder});
}
`;
