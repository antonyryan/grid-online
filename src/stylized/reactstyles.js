import styled, {css} from "styled-components";
export const RendererContainer = styled.div`
    position: asolute;
`
export const Renderer = styled.div`
    height: 720px;
    width: 1280px;
`;
export const LogContent = styled.div`
    max-height: 200px;
    overflow-y: auto;
    font-size: 12px;
    line-height: 1.4;
    color: #ccc;
    white-space: pre-wrap; /* Preserva quebras de linha */
`;
export const LogBox = styled.div`
    position: relative;
    bottom: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    font-family: Arial, sans-serif;
    border-radius: 5px;
    width: 300px;
    z-index: 10;
`;
export const CameraBox= styled.div`
    position: relative;
    background-color: rgba(0, 0, 0, 0.7);
    color: rgb(255, 255, 255);
    padding: 10px;
    font-family: Arial, sans-serif;
    border-radius: 10px;
    z-index: 10;
`