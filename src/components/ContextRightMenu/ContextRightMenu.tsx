import React, {ReactElement} from "react";
import {MenuItemProps} from "../MenuItem/MenuItem";
import "./ContextRightMenu.css"
import {Menu} from "@znui/react";

export interface ContextMenuInterface {
    dismiss: () => void
}

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    menu: (menu: ContextMenuInterface) => MenuItemProps[]
    children: ReactElement
}

export default function ContextRightMenu(props: ContextMenuProps) {
    return <Menu density={2}>
        <Menu.Trigger mode='context'>
            {props.children}
        </Menu.Trigger>
        <Menu.Items>
            {props.menu({
                dismiss: () => {}
            }).map((it, index) =>
                <Menu.Item icon={it.icon} key={index} onClick={it.onClick}>
                    {it.title}
                </Menu.Item>
            )}
        </Menu.Items>
    </Menu>
}