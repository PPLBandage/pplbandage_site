export interface ColourOption {
    readonly value: string;
    readonly label: string;
}

export const shapeColourOptions = [
    { value: 'gold', label: 'Золотая'},
    { value: 'silver', label: 'Серебряная'},
    { value: 'moder', label: 'ModErator'},
    { value: 'space', label: 'Космонавт'},
    { value: 'pank', label: 'Панк'},
    { value: 'barbie', label: 'Барби'},
    { value: 'bender', label: 'Бендер'},
    { value: 'rlbl', label: 'Рилавеон'},
    { value: 'mono', label: 'Монохромная'},
    { value: 'nega', label: 'Негатив'},
];

export const pwColourOptions = [
    { value: 'pw', label: 'Повязка Пугода'},
    { value: 'pw_old', label: 'Старая повязка Пугода'}
];

export const kwixieColourOptions = [
    { value: 'gr', label: 'Пепе в гирляндах'},
    { value: 'ice', label: 'Ледяная пепе'},
    { value: 'flower', label: 'Пепе с цветком'},
    { value: 'green_kwix', label: 'Пепе на чёрно-зелёной подкладке'},
    { value: 'kwix_1', label: 'PepeS'}
];

export const customColourOptions = [
    { value: 'pepe', label: 'Пепе 1' },
    { value: 'pepe_1', label: 'Пепе 2' }
];


export const groupedOptions = [
    {
        label: 'Shape',
        options: shapeColourOptions,
    },
    {
        label: 'Повязки Пугода',
        options: pwColourOptions,
    },
    {
        label: 'Своё изображение',
        options: [ { value: 'custom_pepe', label: 'Своё изображение' }],
    },
    {
        label: 'Кастомный цвет',
        options: customColourOptions,
    },
    {
        label: 'by kwixie_',
        options: kwixieColourOptions,
    }
];
