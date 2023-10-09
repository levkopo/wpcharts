import React from "react";
import {MenuItemProps} from "../MenuItem/MenuItem"
import "./MenuBar.css";
import {Body, Center, HStack, Menu, Tappable, ThemeTokens} from "@znui/react";

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
            props.children.map((it, index) => {
                const item = <Body>
                    {it.title}
                </Body>

                if(it.children) {
                    return <Menu key={index} density={1}>
                        <Menu.Trigger mode='click'>
                            <Center
                                as={Tappable}
                                ph={10}>
                                {item}
                            </Center>
                        </Menu.Trigger>

                        <Menu.Items>
                            {it.children.map((it, index) =>
                                <Menu.Item icon={it.icon} key={index} onClick={it.onClick}>
                                    {it.title}
                                </Menu.Item>
                            )}
                        </Menu.Items>
                    </Menu>
                }

                return <Center
                    as={Tappable}
                    key={index}
                    ph={10}
                    onClick={() => {
                        if(it.onClick) it.onClick()
                    }}>
                    {item}
                </Center>

            })
        }
    </HStack>
}