export interface FileUploadEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

export interface AccordionItemProps {
    header: React.ReactNode;
    dark?: Boolean;
    [key: string]: any;
}

export interface ColorComponentProps {
	rerender: (arg0?: boolean) => void;
}

export interface ColourOption {
    readonly value?: string;
    readonly label: React.JSX.Element;
    readonly isDisabled?: boolean;
}
