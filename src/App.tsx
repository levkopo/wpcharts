import React, {createContext, Dispatch, SetStateAction, useContext, useMemo, useState} from 'react';
import './App.css';
import {AddIcon, AppRoot, Card, Cell, FloatingActionButton, Header, Hosts, Toolbar} from "@zationdev/ui";
import WindowHeader from "./components/WindowHeader/WindowHeader";
import {Layout} from "./components/Layout/Layout";
import {List} from "./components/List/List";
import NavigationLayout from "./components/NavigationLayout/NavigationLayout";

const titleContext = createContext<[string, (title: string) => void]|undefined>(undefined);
export function useTitle() {
    return useContext(titleContext);
}

function App() {
    const [title, setTitle] = useState("Главная")
    if(title!=="Главная") setTitle("Главная")

    useMemo(() => window.document.title = "KPresentations - " + title, [title])

    return (
        <titleContext.Provider value={[title, setTitle]}>
            <AppRoot>
                <Layout
                    top={
                        [
                            <WindowHeader/>
                        ]
                    }

                    left={
                        [
                            <NavigationLayout>
                                <FloatingActionButton icon={
                                    <AddIcon/>
                                } size={"56px"}/>
                            </NavigationLayout>
                        ]
                    }
                    content={
                        <>
                            <Header
                                before={<div style={{width: 5}}/>}
                                title="Недавнее"
                                mode="tertiary"
                            />
                            <List>
                                {
                                    "a".repeat(500).split("").map(it =>
                                        <Cell
                                            before={<div style={{width: 30}}/>}
                                            description="Последнее изменение: 70 лет назад"
                                        >{"MyPresentation.kppf"}</Cell>
                                    )
                                }
                            </List>
                        </>
                    }
                />
            </AppRoot>
        </titleContext.Provider>
    );
}

export default App;
