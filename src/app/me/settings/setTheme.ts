import { getTheme } from "@/app/modules/providers";
import { setCookie } from "cookies-next";

export const setTheme = (name: string) => {
    const theme = getTheme(name);
    setCookie('theme_main', name, { maxAge: 60 * 24 * 365 * 10 });
    Object.entries(theme.data)
        .map(entry => document.documentElement.style.setProperty(entry[0], entry[1] as any));

}