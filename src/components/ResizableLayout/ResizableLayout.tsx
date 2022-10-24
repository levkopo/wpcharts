import React, {ReactNode, useState} from "react";
import {Property} from "csstype";
import "./ResizableLayout.css"

interface ResizableLayoutProps {
    children: ReactNode
    width?: number
    height?: number
    maxHeight?: Property.MaxHeight
    maxWidth?: Property.MaxWidth
    minHeight?: Property.MinHeight
    minWidth?: Property.MinWidth
}

export default function ResizableLayout(props: ResizableLayoutProps) {
    const [[width, height], ] = useState([props.width, props.height])
    let ref: HTMLDivElement|null = null

    let [calculateWidth, calculateHeight] = [width, height]
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

    return <div style={{
        width: width||"100%",
        height: height||"100%",
        maxWidth: props.maxWidth,
        maxHeight: props.maxHeight,
        minWidth: props.minWidth,
        minHeight: props.minHeight,
    }} className="ResizableLayout" ref={r => ref=r}>
        <div className="ResizableLayout-Content">{props.children}</div>
        <div className="ResizableLayout-Handle" onMouseDown={e => {
            if(ref!=null) {
                isWindowMouseDown = true

                offset = []
                if(calculateWidth) offset.push(calculateWidth - (e.currentTarget.clientLeft - e.clientX))
                if(calculateHeight) offset.push(calculateHeight - e.clientY)
            }
        }}/>
    </div>
}