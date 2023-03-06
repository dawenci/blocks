let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const template = document.createElement('template');
    template.innerHTML = `
  <div id="layout" tabindex="0">
    <div class="Calc-screen">
      <div
        ref="result"
        class="Calc-screen-result">
        <div class="Calc-screen-input"></div>
      </div>
    </div>
  
    <div class="Calc-keyboard">
      <div class="Calc-keyboard-area Calc-keyboard-memory"></div>
      <div class="Calc-keyboard-group">
        <div class="Calc-keyboard-area Calc-keyboard-actions"></div>
        <div class="Calc-keyboard-area Calc-keyboard-numbers"></div>
      </div>
      <div class="Calc-keyboard-area Calc-keyboard-operators"></div>
    </div>
  </div>
  `;
    return (templateCache = template);
}
