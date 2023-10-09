import {Center, HStack, Layout, LayoutProps, ThemeTokens, VStack, znui} from "@znui/react";
import React, {ForwardedRef, useImperativeHandle, useRef, useState} from "react";

export interface TableCellProps extends LayoutProps {
    value: any
    header: boolean
    nextField?: () => void
    onChanged?: (value: string) => void
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
            nextField,
            onChanged,
            ...rest
        } = props

        const editable = !header

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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                e.currentTarget.blur()
                                setTimeout(() => nextField?.call(undefined))
                            }
                        }}
                        defaultValue={value}
                    />
                    : value
            }
        </Layout>
    }
)

export interface TableProps extends LayoutProps {
    xHeaders: string[]
    table: any[][]
    onChanged: (x: number, y: number, value: string) => void
}

export default function Table(props: TableProps) {
    const itemsRef = useRef<TableCellRef[][]>([]);
    const [selection, select] = useState([0,0])

    const {
        table,
        xHeaders,
        onChanged,
        ...rest
    } = props

    return <Layout
        as="table"
        style={{
            borderSpacing: 0,
        }}
        {...rest}
    >
        <Layout>

        </Layout>
        <Layout h={25} as="tr">
            {
                xHeaders.map(it =>
                    <TableCell
                        header={true}
                        value={it}
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
                                ref={item => {
                                    if(item==null) return;
                                    const row = itemsRef.current[y] ?? []
                                    row[x] = item
                                    itemsRef.current[y] = row
                                }}
                                onChanged={(value) => {
                                    onChanged(x, y, value)
                                }}
                                key={x}
                                header={false}
                                value={item}
                                nextField={() => {
                                    const nextRow = itemsRef.current[y+1]
                                    if(nextRow) {
                                        nextRow[x].edit()
                                    }
                                }}
                            />
                        )
                    }
                </Layout>
            )
        }
    </Layout>
}