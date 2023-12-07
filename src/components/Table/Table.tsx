import {Center, HStack, Layout, LayoutProps, ThemeTokens, VStack, znui} from "@znui/react";
import React, {ForwardedRef, KeyboardEvent, useImperativeHandle, useRef, useState} from "react";

export interface TableCellProps extends LayoutProps {
    value: any
    header: boolean
    x: number
    y: number
    moveTo?: (x: number, y: number) => void
    onChanged?: (value: string) => void
    remove?: () => void
    clean?: () => void
}

type TableCellRef = {
    edit: () => void
}

const Input = znui('input')

const TableCell = React.forwardRef(
    (props: TableCellProps, ref: ForwardedRef<TableCellRef>) => {
        const [isEditMode, setEditMode] = useState<boolean>(false)
        const {
            value,
            header,
            moveTo,
            remove,
            clean,
            x,
            y,
            onChanged,
            ...rest
        } = props

        const editable = !!onChanged

        useImperativeHandle(ref, () => {
            return {
                edit: () => setEditMode(true)
            }
        })

        return <Layout
            as={header? "th": "td"}
            fontSize={14}
            textAlign='start'
            border='solid 1px'
            w={100}
            cursor='text'
            borderColor={ThemeTokens.outlineVariant}
            bg={header? ThemeTokens.surfaceContainer: undefined}
            onClick={() => {
                if(editable) {
                    setEditMode(true)
                }
            }}
            {...rest}
        >
            {
                isEditMode ?
                    <Input
                        fontWeight={header ? 600: undefined}
                        w='100%'
                        fontSize={14}
                        type="text"
                        autoFocus={true}
                        onBlur={(e) => {
                            setEditMode(false)
                            if(e.currentTarget.value !== value) {
                                onChanged?.call(undefined, e.currentTarget.value)
                            }
                        }}
                        onFocus={(e) => {
                            if(e.currentTarget.value === '0') {
                                e.currentTarget.value = ''
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                setTimeout(() => moveTo?.call(undefined, x, y+1))
                            }

                            if(e.key === 'Delete') {
                                e.preventDefault()
                                if(e.shiftKey) {
                                    setTimeout(() => {
                                        remove?.call(undefined)
                                    })
                                }else{
                                    clean?.call(undefined)
                                    e.currentTarget.value = ''
                                }
                            }

                            if (e.code.startsWith('Arrow')) {
                                const arrowKey = e.code.replaceAll('Arrow', '');
                                if(arrowKey === 'Down') {
                                    e.preventDefault()
                                    setTimeout(() => moveTo?.call(undefined, x, y+1))
                                }else if(arrowKey === 'Up') {
                                    e.preventDefault()
                                    setTimeout(() => moveTo?.call(undefined, x, y-1))
                                }else{
                                    if(arrowKey === 'Left' && (e.currentTarget.selectionStart === 0 || e.ctrlKey)) {
                                        e.preventDefault()
                                        setTimeout(() => moveTo?.call(undefined, x-1, y))
                                    }else if(arrowKey === 'Right' && (e.currentTarget.selectionStart === e.currentTarget.value.length || e.ctrlKey)) {
                                        e.preventDefault()
                                        setTimeout(() => moveTo?.call(undefined, x+1, y))
                                    }
                                }
                            }
                        }}
                        defaultValue={value}
                    />
                    : <Layout ph={2}>
                        {value}
                    </Layout>
            }
        </Layout>
    }
)

export interface TableProps extends LayoutProps {
    xHeaders: string[]
    table: any[][]
    onChangedAxe: (axe: number, title: string) => void
    onChanged: (x: number, y: number, value: string) => void
    remove: (y: number) => void
}

export default function Table(props: TableProps) {
    const itemsRef = useRef<TableCellRef[][]>([]);

    const {
        table,
        xHeaders,
        onChanged,
        onChangedAxe,
        remove,
        ...rest
    } = props

    const moveTo = (x: number, y: number) => {
        const nextRow = itemsRef.current[y]
        if(nextRow) {
            if(x >= 0) {
                nextRow[x].edit()
                return true
            }
        }

        return false
    }

    return <Layout
        as="table"
        style={{
            borderSpacing: 0,
        }}
        {...rest}
    >
        <Layout h={25} as="tr">
            {
                xHeaders.map((it, index) =>
                    <TableCell
                        ref={item => {
                            if(item==null) return;
                            const row = itemsRef.current[0] ?? []
                            row[index] = item
                            itemsRef.current[0] = row
                        }}
                        onChanged={(value) => {
                            onChangedAxe(index, value)
                        }}
                        header={true}
                        value={it}
                        x={index}
                        y={0}
                        moveTo={moveTo}
                    />
                )
            }
        </Layout>

        {
            [...table, ['', '']].map((rows, y) =>
                <Layout
                    h={25}
                    key={y}
                    as="tr"
                >
                    {
                        rows.map((item, x) =>
                            <TableCell
                                y={y+1}
                                x={x}
                                ref={item => {
                                    if(item==null) return;
                                    const row = itemsRef.current[y+1] ?? []
                                    row[x] = item
                                    itemsRef.current[y+1] = row
                                }}
                                onChanged={(value) => {
                                    onChanged(x, y, value)
                                }}
                                key={`${x}_${y}`}
                                clean={() => {
                                    onChanged(0, y, '0')
                                    onChanged(1, y, '0')
                                }}
                                remove={() => {
                                    remove(y)
                                }}
                                header={false}
                                value={item}
                                moveTo={moveTo}
                            />
                        )
                    }
                </Layout>
            )
        }
    </Layout>
}