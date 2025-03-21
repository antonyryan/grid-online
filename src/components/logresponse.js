import React,{useRef,useState} from "react";
import {LogBox, LogContent} from "../stylized/reactstyles";

export const LogResponse = () =>{
    const loggingRef = useRef(null);
    const [vis, setVis] = useState(false);
    return (
        <div>
            <button onClick={() => setVis(!vis)}>
                Mostrar Logs
            </button>
            <LogBox hidden={vis} >
                <h3>Console de logs.</h3>
                <LogContent ref={loggingRef}></LogContent>
            </LogBox>
        </div>);
}