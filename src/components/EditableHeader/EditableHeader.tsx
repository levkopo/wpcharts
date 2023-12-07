import React from "react";
import {Title} from "@znui/react";

export interface EditableHeaderProps extends React.ImgHTMLAttributes<HTMLElement> {
    before?: any;
    title?: any;
    subtitle?: any;

    aside?: JSX.Element;
    indicator?: any;
    onChangeText: (text: string) => void;
}

export default function EditableHeader(props: EditableHeaderProps) {
    const {
        before,
        title,
        subtitle,
        aside,
        indicator,
        onChangeText,
        ...otherParams
    } = props

    return <div {...otherParams} className={"Header"}>
        <div className={"Header-Titles"} style={{width: '100%'}}>
            <div className="Header-Title" style={{fontWeight: 500, width: '100%', height: 18}}>
                {before&&<div className="Header-Before">{before}</div>}
                <Title cursor='text' size='large' as='span' contentEditable={true} suppressContentEditableWarning={true} role="textbox" onBlur={e => {
                    const text = e.currentTarget.innerText.length === 0 || e.currentTarget.innerText.length > 200 ?
                        "untitled": e.currentTarget.innerText

                    e.currentTarget.innerText = text
                    onChangeText(text)
                }} onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        e.currentTarget.blur()
                    }
                }}>{title}</Title>
                {indicator&&<div className="Header-Indicator">{indicator}</div>}
            </div>
            {subtitle&&<div className="Header-Subtitle">{subtitle}</div>}
        </div>

        {aside&&<div className="Header-Aside">{aside}</div>}
    </div>
}