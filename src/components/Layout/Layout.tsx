import React from "react";
import "./Layout.css";

interface LayoutProps {
    left?: React.ReactNode
    bottom?: React.ReactNode
    right?: React.ReactNode
    top?: React.ReactNode
    content?: React.ReactNode,
    nested?: boolean
}

export function Layout(props: LayoutProps) {
    return <div className="Layout" style={{
        ...(!props.nested)&&{
            height: "100vh"
        }
    }}>
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