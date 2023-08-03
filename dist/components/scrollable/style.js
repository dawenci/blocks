import { __transition_duration } from '../../theme/var-light.js';
export const style = `
:host {
  --shadow-color: rgba(0,0,0,.1);
}
::-webkit-scrollbar {
  display: none;
}
:host {
  box-sizing: border-box;
  display: block;
}

#layout {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}
#viewport::-webkit-scrollbar {
  display: none;
}

.track {
  opacity: 0;
  display: block;
  box-sizing: border-box;
  position: absolute;
  z-index: 1;
  border-radius: 3px;
  user-select: none;
  transition: opacity var(--bl-transition-duration, ${__transition_duration});
  backgrond: var(--bg-track, transparent);
  cursor: default;
}
#horizontal {
  top: auto;
  right: 6px;
  left: 0;
  bottom: 0;
  width: calc(100% - 6px);
  height: 6px;
}
#vertical {
  top: 0;
  right: 0;
  bottom: 6px;
  left: auto;
  width: 6px;
  height: calc(100% - 6px);
}

.thumb {
  display: block;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
  background: var(--bg-thumb, #000);
  user-select: none;
  transition: opacity var(--bl-transition-duration, ${__transition_duration});
  opacity: .3;
}
#horizontal .thumb {
  height: 100%;
}
#vertical .thumb {
  width: 100%;
}
.thumb:hover,
.dragging-horizontal #horizontal .thumb,
.dragging-vertical #vertical .thumb {
  opacity: .5;
}

#layout.dragging .track,
#layout:hover .track {
  opacity: 1;
}

#top,
#right,
#bottom,
#left {
  display: none;
  position: absolute;
  pointer-events: none;
}
:host([shadow]) .shadow-top #top {
  display: block;
  height: 10px;
  top: -10px;
  right: 0;
  left: 0;
  box-shadow: 0 3px 7px var(--shadow-color);
}
:host([shadow]) .shadow-right #right {
  display: block;
  width: 10px;
  top: 0;
  bottom: 0;
  right: -10px;
  box-shadow: -3px 0px 7px var(--shadow-color);
}
:host([shadow]) .shadow-bottom #bottom {
  display: block;
  height: 10px;
  right: 0;
  bottom: -10px;
  left: 0;
  box-shadow: 0 -3px 7px var(--shadow-color);
}
:host([shadow]) .shadow-left #left {
  display: block;
  width: 10px;
  top: 0;
  bottom: 0;
  left: -10px;
  box-shadow: 3px 0px 7px var(--shadow-color);
}
`;
