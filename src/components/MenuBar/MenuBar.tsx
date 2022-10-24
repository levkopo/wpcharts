import React from "react";
import {MenuItemProps} from "../MenuItem/MenuItem"
import "./MenuBar.css";

interface MenuBarProps {
    children: MenuItemProps[]
    mode?: "primary"|"secondary"
}

export default function MenuBar(props: MenuBarProps) {
    return <div className={"MenuBar MenuBar-"+(props.mode||"primary")}>
        {
            props.children.map((it, index) =>
                <div key={index} className="MenuBar-Item" onClick={() => {
                    if(it.onClick) it.onClick()
                }}>{it.title}</div>
            )
        }
    </div>
}