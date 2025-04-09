export const numbersTxt = (
    num: number,
    variations: [string, string, string]
): string => {
    const past = num % 10;
    const first = Math.floor(num / 10) % 10;

    let text: string;
    if (past === 1 && !num.toString().endsWith('11')) {
        text = variations[0]; // голос
    } else if (past >= 2 && past <= 4 && first !== 1) {
        text = variations[1]; // голоса
    } else {
        text = variations[2]; // голосов
    }

    return `${num} ${text}`;
};

export const stringTimeDelta = (delta: number) => {
    if (delta < 60) {
        return numbersTxt(Math.floor(delta), ['секунду', 'секунды', 'секунд']);
    } else if (delta < 3600) {
        return numbersTxt(Math.floor(delta / 60), [
            'минуту',
            'минуты',
            'минут'
        ]);
    } else if (delta < 86400) {
        return numbersTxt(Math.floor(delta / 3600), ['час', 'часа', 'часов']);
    } else if (delta < 2592000) {
        return numbersTxt(Math.floor(delta / 86400), ['день', 'дня', 'дней']);
    } else if (delta < 31104000) {
        return numbersTxt(Math.floor(delta / 2592000), [
            'месяц',
            'месяца',
            'месяцев'
        ]);
    } else {
        return numbersTxt(Math.floor(delta / 31104000), ['год', 'года', 'лет']);
    }
};

export const timeStamp = (timestamp: number): string => {
    const onlineTime = 300;
    const currentTime = Math.floor(Date.now() / 1000);
    const delta = Math.round(currentTime - timestamp);

    if (delta < onlineTime) {
        return 'только что';
    } else {
        return `${stringTimeDelta(delta)} назад`;
    }
};
