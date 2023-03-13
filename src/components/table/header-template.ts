let templateCache: {
  comTemplate: HTMLTemplateElement
  cellTemplate: HTMLDivElement
  groupTemplate: HTMLDivElement
}

export function template() {
  if (templateCache) return templateCache

  const comTemplate = document.createElement('template')
  comTemplate.innerHTML = /*html*/ `
  <div id="viewport"><div class="columns"></div></div>`

  const cellTemplate = document.createElement('div')
  cellTemplate.className = 'cell'
  cellTemplate.appendChild(document.createElement('div')).className = 'cell-content'

  const groupTemplate = document.createElement('div')
  groupTemplate.className = 'group'
  groupTemplate.appendChild(document.createElement('div')).className = 'group_label'
  groupTemplate.appendChild(document.createElement('div')).className = 'columns'

  return (templateCache = {
    comTemplate,
    cellTemplate,
    groupTemplate,
  })
}
