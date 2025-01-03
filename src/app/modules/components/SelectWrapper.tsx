"use client";

import dynamic from "next/dynamic";
const CreatableSelect = dynamic(() => import("react-select/creatable"), { ssr: false });


const SelectWrapper = (props: any) => {
    return (
        <CreatableSelect
            {...props}
        />
    );
}

export default SelectWrapper;