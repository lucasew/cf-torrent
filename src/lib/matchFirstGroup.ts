export function matchFirstGroup(text: string, regexp: RegExp) {
  const items = [...text.matchAll(regexp)]
  return items.map(l => decodeURIComponent(l[1]))
}