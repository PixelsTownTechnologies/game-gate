const generateTableOptions = () => {
    let counter = 0, numberOfItems = 0, list = [];
    for (let i = 0; numberOfItems < i; i++) {
        if (counter > 100) {
            counter += 50;
        } else {
            counter += 25;
        }
        list.push({key: counter, text: counter, value: counter});
    }
    return list;
}

export const DIR = {
    LTR: 'ltr',
    RTL: 'rtl',
    AUTO: 'auto'
}
export const MAX_TEXT_LENGTH = 9999999999999;
export const MAX_VALUE = 1e+308;
export const TABLE_OPTIONS = generateTableOptions();