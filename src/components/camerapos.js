import React from "react";
import {CameraBox} from "../stylized/reactstyles";

export const CameraPos = ({x, y, z}) => {
    return (<CameraBox id="camera-info">
        Camera Position:<br/>
        X: <span>{x}</span><br/>
        Y: <span>{y}</span><br/>
        Z: <span>{z}</span>
    </CameraBox>);
}