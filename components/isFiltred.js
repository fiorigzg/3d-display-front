export default function isFiltred(filterStore, tableEl, el) {
    let isFiltredByValue =
        !(filterStore.param in tableEl) ||
        String(tableEl[filterStore.param]).includes(filterStore.value) ||
        filterStore.options.includes(tableEl[filterStore.param]);
    let isFiltredByDate =
        !(filterStore.dateFilter.param in el) ||
        (Date.parse(el[filterStore.dateFilter.param]) >=
            Date.parse(filterStore.dateFilter.from) &&
            Date.parse(el[filterStore.dateFilter.param]) <=
                Date.parse(filterStore.dateFilter.to));
    return isFiltredByDate && isFiltredByValue;
}
