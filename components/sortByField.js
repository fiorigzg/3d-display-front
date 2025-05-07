export default function sortByField(filterStore, data) {
  if (filterStore.fieldSorter.param == "off") return data;
  return data.sort((a, b) => {
    const field = filterStore.fieldSorter.param;
    const direction = filterStore.fieldSorter.direction;
    if (a[field] < b[field]) {
      return direction === "increase" ? -1 : 1;
    }
    if (a[field] > b[field]) {
      return direction === "increase" ? 1 : -1;
    }
    return 0;
  });
}
