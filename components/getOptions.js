export default function getOptions(options, optionField = "name") {
    let realOptions = {};
    for (const optionId in options) {
        const option = options[optionId];
        realOptions[optionId] = option[optionField];
    }
    return realOptions;
}
