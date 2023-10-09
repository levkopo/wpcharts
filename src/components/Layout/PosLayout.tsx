import React from "react";
import "./Layout.css";
import {Layout, LayoutProps} from "@znui/react";

interface PosLayoutProps extends LayoutProps {
    le?: React.ReactNode
    be?: React.ReactNode
    re?: React.ReactNode
    te?: React.ReactNode
    content?: React.ReactNode,
    nested?: boolean
}

export function PosLayout(props: PosLayoutProps) {
    const {
        te,
        le,
        be,
        re,
        content,
        nested,
        ...rest
    } = props
    return <Layout className="Layout" style={{
        ...(!nested)&&{
            height: "100%"
        }
    }} {...rest}>
        <header className="Layout-Top">
            {te}
        </header>

        <main className="Layout-Vertical">
            <div className="Layout-Left">{le}</div>
            <div className="Layout-Main">{content}</div>
            <div className="Layout-Right">{re}</div>
        </main>

        <footer className={"Layout-Bottom"}>
            {be}
        </footer>
    </Layout>
}