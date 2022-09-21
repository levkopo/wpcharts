import React from "react";
import "./WindowHeader.css";
import {useTitle} from "../../App";
import {AddIcon, LogoutIcon} from "@zationdev/ui";
const { app } = require("@electron/remote")


export default function WindowHeader() {
    const [title] = useTitle() ?? []

    return <div className="WindowHeader">
        <div className="WindowHeader-Title">
            {"KPresentations - " + title}
        </div>

        <div className="WindowHeader-Buttons">
            <div className="WindowHeader-Button" onClick={() => app.quit()}>
                <LogoutIcon/>
            </div>
        </div>
    </div>
}