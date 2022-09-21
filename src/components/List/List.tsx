import React, {ReactNode} from "react";
import "./List.css";

export function List(props: { children?: ReactNode | undefined }) {
    return <div className="List">
        {props.children}
    </div>
}