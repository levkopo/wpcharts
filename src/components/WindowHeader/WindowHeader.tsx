import React from "react";
import "./WindowHeader.css";
import {useTitle} from "../../App";
import {LogoutIcon} from "@zationdev/ui";
import {getCurrentWindow} from "@electron/remote";

export default function WindowHeader(params: {
    onClose?: () => void
}) {
    const [title] = useTitle()

    return <div className="WindowHeader">
        <div className="WindowHeader-Title">
            {"WPCharts - " + title}
        </div>

        <div className="WindowHeader-Buttons">
            <div className="WindowHeader-Button" onClick={() => params.onClose ? params.onClose() : getCurrentWindow().close()}>
                <LogoutIcon/>
            </div>
        </div>
    </div>
}