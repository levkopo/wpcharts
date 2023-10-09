import React, {ReactNode, useState} from "react";
import {Property} from "csstype";
import {HStack, Layout, LayoutProps, ThemeTokens, VStack} from "@znui/react";

interface ResizableLayoutProps extends LayoutProps {
    children: ReactNode
    width?: number
    height?: number
    hide?: boolean
    maxHeight?: Property.MaxHeight
    maxWidth?: Property.MaxWidth
    minHeight?: Property.MinHeight
    minWidth?: Property.MinWidth
}

export default function ResizableLayout(props: ResizableLayoutProps) {
    const {
        hide,
        width,
        height,
        children,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        ...rest
    } = props

    const [[currentWidth, currentHeight], ] = useState([width, height])
    let ref: HTMLDivElement|null = null

    let [calculateWidth, calculateHeight] = [currentWidth, currentHeight]
    let isWindowMouseDown = false;
    let offset = []

    const listener = (e: MouseEvent) => {
        if(isWindowMouseDown) {
            if(calculateWidth) {
                calculateWidth = e.pageX - ref!!.getBoundingClientRect().x
                ref!!.style.width = calculateWidth+"px"
            }

            if(calculateHeight) {
                calculateHeight = e.pageY
                ref!!.style.height = calculateHeight+"px"
            }
        }
    }

    document.body.addEventListener("mousemove", listener)
    document.body.addEventListener("mouseup", e => {
        isWindowMouseDown = false
    })

    return <HStack
        to={{
            h: currentHeight||"100%",
            ml: hide ? '-100%': 0,
            w: {
                transition: hide ? undefined: 'linear',
                duration: hide ? undefined: 0,
                value: hide ? 0: currentWidth||"100%"
            },
            maxWidth: maxWidth,
            minWidth: hide ? 0: minWidth,
            maxHeight: maxHeight,
            minHeight: minHeight,
        }}
        justifyContent='flex-end'
        ref={r => ref=r}
        {...rest}
    >
        <VStack flex={1}>{children}</VStack>
        <Layout
            bg={ThemeTokens.outlineVariant}
            w={3}
            cursor='ew-resize'
            onMouseDown={e => {
                if(ref!=null) {
                    isWindowMouseDown = true

                    offset = []
                    if(calculateWidth) offset.push(calculateWidth - (e.currentTarget.clientLeft - e.clientX))
                    if(calculateHeight) offset.push(calculateHeight - e.clientY)
                }
            }}
        />
    </HStack>
}