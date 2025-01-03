import { getTheme } from "@/app/modules/providers";
import { setCookie } from "cookies-next";

export const setTheme = (name: string) => {
    const theme: { [key: string]: string } = getTheme(name);
    setCookie('theme_main', name, { maxAge: 60 * 24 * 365 * 10 });
    for (let prop in theme) {
        document.documentElement.style.setProperty(prop, theme[prop]);
    }
}