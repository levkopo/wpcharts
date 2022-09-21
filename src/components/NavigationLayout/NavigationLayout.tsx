import React, {ReactNode} from "react";
import "./NavigationLayout.css"

export default function NavigationLayout(props: { children?: ReactNode | undefined }) {
    return <div className="NavigationLayout">
        {props.children}
    </div>
}