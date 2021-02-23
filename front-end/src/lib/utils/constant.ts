export const generateTableOptions = () => {
    let counter = 0, numberOfItems = 12, list = [];
    list.push({key: 5, text: 5, value: 5});
    list.push({key: 15, text: 15, value: 15});
    for (let i = 0; i < numberOfItems; i++) {
        if (counter > 75) {
            counter += 50;
        } else {
            counter += 25;
        }
        list.push({key: counter, text: counter, value: counter});
    }
    list.push({key: 1000, text: 1000, value: 1000});
    return list;
}

export const DIR = {
    LTR: 'ltr',
    RTL: 'rtl',
    AUTO: 'auto'
}
export const MAX_TEXT_LENGTH = 9999999999999;
export const MAX_VALUE = 1e+308;
