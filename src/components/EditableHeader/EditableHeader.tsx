import React from "react";
import {Layout, LayoutProps, Title} from "@znui/react";

export interface EditableHeaderProps extends LayoutProps {
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

    return <Layout {...otherParams}>
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
    </Layout>
}