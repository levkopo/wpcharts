import React from "react";
import "./Placeholder.css";

export default function Placeholder(params: {
    emoji: string,
    title: any,
    actions?: JSX.Element
}) {
    return <div className="Placeholder">
        <div className="Placeholder-inner">
            <div style={{
                fontSize: 75,
                lineHeight: "100%"
            }}>{params.emoji}</div>

            <div style={{ marginTop: 30, lineHeight: "1.2em" }}>
                {params.title}
            </div>

            <div className="Placeholder-Actions">
                {params.actions}
            </div>
        </div>
    </div>
}