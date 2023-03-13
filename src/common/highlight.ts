type Range = [number, number]

function highlightRange(text: string, highlight: string, ranges: Range[] = []) {
  let index = text.indexOf(highlight)
  let end
  while (index !== -1) {
    end = index + highlight.length - 1
    ranges.push([index, end])
    index = text.indexOf(highlight, end + 1)
  }
  return ranges
}

function mergeRanges(ranges: Range[]): Range[] {
  if (!ranges.length) return []
  ranges.sort((r1, r2) => r1[0] - r2[0])
  // 合并相邻的 range
  const merged = [ranges[0]]
  for (let i = 1; i < ranges.length; i += 1) {
    const last = merged[merged.length - 1]
    const range = ranges[i]
    if (range[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], range[1])
    } else {
      merged.push(range)
    }
  }
  return merged
}

function makeSlices(text: string, highlightRanges: Range[]): Array<{ text: string; highlight: boolean }> {
  const results = []
  let index = 0
  highlightRanges.forEach(([s, e]) => {
    if (index < s) {
      results.push({
        text: text.slice(index, s),
        highlight: false,
      })
      index = s
    }
    results.push({
      text: text.slice(s, e + 1),
      highlight: true,
    })
    index = e + 1
  })
  if (index < text.length) {
    results.push({
      text: text.substr(index),
      highlight: false,
    })
  }
  return results
}

export function parseHighlight(
  text: string,
  highlights: string | string[]
): Array<{
  text: string
  highlight: boolean
}> {
  if (typeof text !== 'string') return []

  const ranges: Range[] = []
  if (Array.isArray(highlights)) {
    highlights.forEach(highlight => {
      highlightRange(text, highlight, ranges)
    })
  } else if (typeof highlights === 'string') {
    highlightRange(text, highlights, ranges)
  } else {
    return []
  }

  return makeSlices(text, mergeRanges(ranges))
}
