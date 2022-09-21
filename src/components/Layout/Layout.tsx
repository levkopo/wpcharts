import React from "react";
import "./Layout.css";

interface LayoutProps {
    left?: JSX.Element[]
    bottom?: JSX.Element[]
    right?: JSX.Element[]
    top?: JSX.Element[]
    content?: JSX.Element
}

export function Layout(props: LayoutProps) {
    return <div className="Layout">
        <header className="Layout-Top">
            {props.top}
        </header>

        <main className="Layout-Vertical">
            <div className="Layout-Left">{props.left}</div>
            <div className="Layout-Main">{props.content}</div>
            <div className="Layout-Right">{props.right}</div>
        </main>

        <footer className={"Layout-Bottom"}>
            {props.bottom}
        </footer>
    </div>
}