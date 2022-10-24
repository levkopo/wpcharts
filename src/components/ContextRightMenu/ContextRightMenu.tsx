import React, {MouseEvent, useCallback, useState} from "react";
import {Card, ModalRoot} from "@zationdev/ui";
import {MenuItemProps} from "../MenuItem/MenuItem";
import "./ContextRightMenu.css"

export interface ContextMenuInterface {
    dismiss: () => void
}

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    menu: (menu: ContextMenuInterface) => MenuItemProps[]
}

export default function ContextRightMenu(props: ContextMenuProps) {
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false);

    const handleContextMenu = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            const bounds = event.currentTarget.getBoundingClientRect()

            setAnchorPoint({ x: event.clientX, y: event.clientY });
            setShow(true);
        },
        [setAnchorPoint, setShow]
    );

    return <>
        <div onContextMenu={handleContextMenu} onContextMenuCapture={() => setShow(false)}>{props.children}</div>
        {show&&<div style={{background: "transparent", position: "absolute", left: 0, top: 0, zIndex: 10, width: "100vw", height: '100vh'}}
                    onClick={() => setShow(false)} onContextMenu={() => setShow(false)}>
            <Card style={{
                position: "absolute",
                margin: 5,
                marginTop: anchorPoint.y,
                marginLeft: anchorPoint.x,
                borderRadius: 0
            }} className="ContextRightMenu">
                {props.menu({
                    dismiss: () => setShow(false)
                }).map((it, index) =>
                    <div key={index} className="ContextRightMenu-Item" onClick={(e) => {
                        e.preventDefault()
                        if(it.onClick) it.onClick()
                    }}>
                        <div className="ContextRightMenu-Item-Icon">{it.icon}</div>
                        <div className="ContextRightMenu-Item-Text">{it.title}</div>
                    </div>
                )}
            </Card>
        </div>}
    </>
}