type SingleThemeType = {
    '--main-bg-color': string;
    '--main-card-color': string;
    '--main-element-color': string;
    '--main-action-color': string;
    '--main-menu-color': string;
    '--dark-hover': string;
    '--hr-color': string;
    '--focus-color': string;
    '--category-color': string;
    '--main-text-color': string;
    '--main-shadow-color': string;
    '--card-background-image': string;
};

type ThemeType = { [key: string]: { title: string; data: SingleThemeType } };

const themes: ThemeType = {
    default: {
        title: 'Default',
        data: {
            '--main-bg-color': '#17181c',
            '--main-card-color': '#262930',
            '--main-element-color': '#434957',
            '--main-action-color': '#00ADB5',
            '--main-menu-color': '#252a30',
            '--dark-hover': '#1d2025',
            '--hr-color': '#596172',
            '--focus-color': '#717b91',
            '--category-color': '#717b91',
            '--main-text-color': '#ffffff',
            '--main-shadow-color': '#1d2025',
            '--card-background-image':
                "url('/static/backgrounds/background_default.svg')"
        }
    },
    amoled: {
        title: 'Amoled',
        data: {
            '--main-bg-color': '#000000',
            '--main-card-color': '#101013',
            '--main-element-color': '#222329',
            '--main-action-color': '#00ADB5',
            '--main-menu-color': '#101013',
            '--dark-hover': '#1d2025',
            '--hr-color': '#292c33',
            '--focus-color': '#717b91',
            '--category-color': '#333845',
            '--main-text-color': '#ffffff',
            '--main-shadow-color': '#121212',
            '--card-background-image':
                "url('/static/backgrounds/background_amoled.svg')"
        }
    }
};

export default themes;
