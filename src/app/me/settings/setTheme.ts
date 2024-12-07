import { getTheme } from "@/app/modules/providers.module";
import { Cookies } from "next-client-cookies";

export const setTheme = (name: string, cookies: Cookies) => {
    const theme: { [key: string]: string } = getTheme(name);
    cookies.set('theme_main', name, { expires: 365 * 10 });
    for (let prop in theme) {
        document.documentElement.style.setProperty(prop, theme[prop]);
    }
}