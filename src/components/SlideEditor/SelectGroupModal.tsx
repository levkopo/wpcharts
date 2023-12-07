import React, {useState} from "react";
import {Button, IconButton, ListItem, Modal, ModalDialogInterface} from "@znui/react";
import {ZnUIIconDeleteFilled} from "@znui/icons";
import Chart from "../../core/models/Chart";

export interface SelectGroupModalProps {
    dialogInterface: ModalDialogInterface
    groups: Chart['points']
    updateGroups: (groups: Chart['points']) => void
    selectGroup: (group: number) => void
}

export const SelectGroupModal = (props: SelectGroupModalProps) => {
    const {
        dialogInterface,
        groups: initialGroups,
        updateGroups,
        selectGroup
    } = props

    const [groups, setGroups] = useState(initialGroups)

    const exit = () => {
        updateGroups(groups)
        dialogInterface.close()
    }

    return <Modal
        title='Менеджер групп'
        bottomAction={<>
            <Button
                mode='text'
                onClick={() => {
                    groups.push({points: []})
                    setGroups([...groups])
                }}
            >
                Создать группу
            </Button>

            <Button
                mode='text'
                onClick={exit}
            >
                Закрыть
            </Button>
        </>}
    >
        {
            groups.map((group, i) =>
                <ListItem
                    heading={`Группа ${i+1}`}
                    trailing={
                        <IconButton onClick={(e) => {
                            e.stopPropagation()
                            groups.splice(i, 1)
                            setGroups([...groups])
                        }}>
                            <ZnUIIconDeleteFilled/>
                        </IconButton>
                    }
                    onClick={() => {
                        exit()
                        selectGroup(i)
                    }}
                />
            )
        }
    </Modal>
}