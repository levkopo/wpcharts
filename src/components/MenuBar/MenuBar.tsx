import React from "react";
import {MenuItemProps} from "../MenuItem/MenuItem"
import "./MenuBar.css";
import {Body, Center, HStack, Tappable, ThemeTokens} from "@znui/react";

interface MenuBarProps {
    children: MenuItemProps[]
    mode?: "primary"|"secondary"
}

export default function MenuBar(props: MenuBarProps) {
    return <HStack
        bg={ThemeTokens.surfaceContainer}
        h={30}
        ph={15}
    >
        {
            props.children.map((it, index) =>
                <Center
                    as={Tappable}
                    key={index}
                    ph={10}
                    onClick={() => {
                        if(it.onClick) it.onClick()
                    }}>
                    <Body>
                        {it.title}
                    </Body>
                </Center>
            )
        }
    </HStack>
}