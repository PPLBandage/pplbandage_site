import { GroupProps, components } from 'react-select';
import { ColourOption } from "./interfaces";

export const shapeColourOptions: readonly ColourOption[] = [
    { value: 'not_set', label: <>—Нет—</>},
    { value: 'gold', label: <>Золотая</>},
    { value: 'silver', label: <>Серебряная</>},
    { value: 'moder', label: <>ModErator</>},
    { value: 'space', label: <>Космонавт</>},
    { value: 'pank', label: <>Панк</>},
    { value: 'barbie', label: <>Барби</>},
    { value: 'bender', label: <>Бендер</>},
    { value: 'rlbl', label: <>Рилавеон</>},
    { value: 'mono', label: <>Монохромная</>},
    { value: 'nega', label: <>Негатив</>},
];

export const pwColourOptions: readonly ColourOption[] = [
    { value: 'pw', label: <>Повязка Пугода</>},
    { value: 'pw_old', label: <>Старая повязка Пугода</>}
];

export const kwixieColourOptions: readonly ColourOption[] = [
    { value: 'gr', label: <>Пепе в гирляндах</>},
    { value: 'ice', label: <>Ледяная пепе</>},
    { value: 'flower', label: <>Пепе с цветком</>},
    { value: 'green_kwix', label: <>Пепе на чёрно-зелёной подкладке</>},
    { value: 'kwix_1', label: <>PepeS</>}
];

export const customColourOptions: readonly ColourOption[] = [
    { value: 'pepe', label: <>Пепе 1</> },
    { value: 'pepe_1', label: <>Пепе 2</> }
];

export interface GroupedOption {
    readonly label: string;
    readonly options: readonly ColourOption[];
}

export const groupedOptions: readonly GroupedOption[] = [
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
        options: [ { value: 'custom_pepe', label: <>Своё изображение</> } ],
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

const groupStyles = {
	borderRadius: '5px',
	background: '#f2fcff',
};

export const Group = (props: GroupProps<ColourOption, false>) => (
	<div style={groupStyles}>
		<components.Group {...props} />
	</div>
);