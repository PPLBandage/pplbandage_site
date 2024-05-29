export interface FileUploadEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

export interface AccordionItemProps {
    header: React.ReactNode;
    dark?: Boolean;
    [key: string]: any;
}

export interface rerenderInterface {
    (param: string): void;
}
export interface ColorComponentProps {
	triggerEvent: rerenderInterface;
}

export interface ColourOption {
    readonly value?: string;
    readonly label: React.JSX.Element;
    readonly isDisabled?: boolean;
}
