export function errorSentence(label, errorMessages, verb = "should") {
  if (errorMessages) {
    return `${label} ${verb} ${toSentence(errorMessages)}`;
  }
}

export function toSentence(items, key) {
  return items.reduce((acc, item, idx, _items) => {
    const listed = key ? item[key] : item;

    if (idx == 0 || acc === "") {
      return listed;
    } else if (idx + 1 === _items.length) {
      return [acc, "&", listed].join(" ");
    } else {
      return [`${acc},`, listed].join(" ");
    }
  }, "");
}
