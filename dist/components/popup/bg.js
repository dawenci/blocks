function makeTopData(rectWidth, rectHeight, arrowHeight, arrowOffset, radius) {
    const left = -rectWidth / 2;
    const right = rectWidth / 2;
    const top = -arrowHeight - rectHeight;
    const bottom = -arrowHeight;
    const data = `M ${arrowOffset},0
  L ${-arrowHeight + arrowOffset},${bottom}
  H ${left + radius}
  Q ${left},${bottom} ${left},${bottom - radius}
  V ${top + radius}
  Q ${left},${top} ${left + radius},${top}
  H ${right - radius}
  Q ${right},${top} ${right},${top + radius}
  V ${bottom - radius}
  Q ${right},${bottom} ${right - radius},${bottom}
  H ${arrowHeight + arrowOffset}
  L ${arrowOffset},0 z`;
    return data;
}
function makeBottomData(rectWidth, rectHeight, arrowHeight, arrowOffset, radius) {
    const left = -rectWidth / 2;
    const right = rectWidth / 2;
    const bottom = arrowHeight + rectHeight;
    const top = arrowHeight;
    const data = `M ${arrowOffset},0
  L ${-arrowHeight + arrowOffset},${top}
  H ${left + radius}
  Q ${left},${top} ${left},${top + radius}
  V ${bottom - radius}
  Q ${left},${bottom} ${left + radius},${bottom}
  H ${right - radius}
  Q ${right},${bottom} ${right},${bottom - radius}
  V ${top + radius}
  Q ${right},${top} ${right - radius},${top}
  H ${arrowHeight + arrowOffset}
  L ${arrowOffset},0 z`;
    return data;
}
function makeLeftData(rectWidth, rectHeight, arrowWidth, arrowOffset, radius) {
    const left = -arrowWidth - rectWidth;
    const right = -arrowWidth;
    const top = -rectHeight / 2;
    const bottom = rectHeight / 2;
    const data = `M 0,${arrowOffset}
  L ${right},${-arrowWidth + arrowOffset}
  V ${top + radius}
  Q ${right},${top} ${right - radius},${top}
  H ${left + radius}
  Q ${left},${top} ${left},${top + radius}
  V ${bottom - radius}
  Q ${left},${bottom} ${left + radius},${bottom}
  H ${right - radius}
  Q ${right},${bottom} ${right},${bottom - radius}
  V ${arrowWidth + arrowOffset}
  L 0,${arrowOffset} z`;
    return data;
}
function makeRightData(rectWidth, rectHeight, arrowWidth, arrowOffset, radius) {
    const left = arrowWidth;
    const right = arrowWidth + rectWidth;
    const top = -rectHeight / 2;
    const bottom = rectHeight / 2;
    const data = `M 0,${arrowOffset}
  L ${left},${-arrowWidth + arrowOffset}
  V ${top + radius}
  Q ${left},${top} ${left + radius},${top}
  H ${right - radius}
  Q ${right},${top} ${right},${top + radius}
  V ${bottom - radius}
  Q ${right},${bottom} ${right - radius},${bottom}
  H ${left + radius}
  Q ${left},${bottom} ${left},${bottom - radius}
  V ${arrowWidth + arrowOffset}
  L 0,${arrowOffset} z`;
    return data;
}
export function updateBg({ $svg, width, height, arrowSize, lineWidth, radius, stroke, fill, origin }) {
    const $path = $svg.children[0];
    let arrowOffset = 0;
    if (origin === 'left-start' || origin === 'right-start') {
        arrowOffset = Math.min(-(height - (radius + lineWidth) * 2) / 4, -height / 2 + (arrowSize + radius) * 2);
    }
    else if (origin === 'left-end' || origin === 'right-end') {
        arrowOffset = Math.max((height - radius * 2) / 4, height / 2 - (arrowSize + radius) * 2);
    }
    else if (origin === 'top-start' || origin === 'bottom-start') {
        arrowOffset = Math.min(-(width - radius * 2) / 4, -width / 2 + (arrowSize + radius) * 2);
    }
    else if (origin === 'top-end' || origin === 'bottom-end') {
        arrowOffset = Math.max((width - radius * 2) / 4, width / 2 - (arrowSize + radius) * 2);
    }
    let data;
    let transform;
    switch (origin) {
        case 'top-start':
        case 'top-end':
        case 'top-center': {
            data = makeBottomData(width - lineWidth, height - arrowSize - lineWidth, arrowSize, arrowOffset, radius);
            transform = `translate(${width / 2}, ${lineWidth / 2})`;
            break;
        }
        case 'bottom-start':
        case 'bottom-end':
        case 'bottom-center': {
            data = makeTopData(width - lineWidth, height - arrowSize - lineWidth, arrowSize, arrowOffset, radius);
            transform = `translate(${width / 2}, ${height - lineWidth / 2})`;
            break;
        }
        case 'right-start':
        case 'right-end':
        case 'right-center': {
            data = makeLeftData(width - arrowSize - lineWidth, height - lineWidth, arrowSize, arrowOffset, radius);
            transform = `translate(${width - lineWidth / 2}, ${height / 2})`;
            break;
        }
        case 'left-start':
        case 'left-end':
        case 'left-center': {
            data = makeRightData(width - arrowSize - lineWidth, height - lineWidth, arrowSize, arrowOffset, radius);
            transform = `translate(${lineWidth / 2}, ${height / 2})`;
            break;
        }
        default: {
            data = makeBottomData(width - lineWidth, height - arrowSize - lineWidth, arrowSize, arrowOffset, radius);
            transform = `translate(${width / 2}, ${lineWidth / 2})`;
        }
    }
    $path.setAttribute('d', data);
    $path.setAttribute('transform', transform);
    $svg.setAttribute('stroke', stroke);
    $svg.setAttribute('fill', fill);
    $svg.setAttribute('stroke-width', '' + lineWidth);
    $svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    $svg.setAttribute('vector-effect', 'non-scaling-stroke');
    return $svg;
}
