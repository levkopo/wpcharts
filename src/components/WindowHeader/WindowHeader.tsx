import React, {CSSProperties, ReactNode} from "react";
import "./WindowHeader.css";
import {useTitle} from "../../App";
import {LogoutIcon} from "@zationdev/ui";
import {getCurrentWindow} from "@electron/remote";
import {Center, HStack, IconWrapper, Layout, LayoutProps, Tappable, ThemeTokens, Title} from "@znui/react";

function WindowHeaderButton(params: LayoutProps) {
    const {
        children,
        ...rest
    } = params

    return <Center as={Tappable} style={{
        '-webkit-app-region': 'none'
    } as CSSProperties} w={85} h='100%' {...rest}>
        <IconWrapper style={{
            '--icon-size': '20px'
        } as CSSProperties}>
            {children}
        </IconWrapper>
    </Center>
}

export default function WindowHeader(params: {
    onClose?: () => void
}) {
    const [title] = useTitle()

    return <HStack
        w='100%'
        h={35}
        bg={ThemeTokens.surfaceContainer}
        alignItems='center'
        style={{
            '-webkit-app-region': 'drag'
        } as CSSProperties}
    >
        <Title size='medium' ml={18} flex={1}>
            {"WPCharts - " + title}
        </Title>

        <Layout h='100%'>
            <WindowHeaderButton
                onClick={() => params.onClose ?
                    params.onClose() :
                    getCurrentWindow().close()
                }
            >
                <LogoutIcon/>
            </WindowHeaderButton>
        </Layout>
    </HStack>
}