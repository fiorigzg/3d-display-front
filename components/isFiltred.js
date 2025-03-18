export default function isFiltred(filterStore, tableEl, el) {
    let isFiltredByValue =
        !(filterStore.fieldFilter.param in tableEl) ||
        String(tableEl[filterStore.fieldFilter.param]).includes(filterStore.fieldFilter.value) ||
        filterStore.fieldFilter.options.includes(tableEl[filterStore.fieldFilter.param]);
    let isFiltredByDate =
        !(filterStore.dateFilter.param in el) ||
        (Date.parse(el[filterStore.dateFilter.param]) >=
            Date.parse(filterStore.dateFilter.from) &&
            Date.parse(el[filterStore.dateFilter.param]) <=
                Date.parse(filterStore.dateFilter.to));
    return isFiltredByDate && isFiltredByValue;
}
