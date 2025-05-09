import { DialogOverlay } from "@radix-ui/react-dialog";
import { styled } from "styled-components";

export const Overlay = styled(DialogOverlay)`
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0;
    background: rgba(0, 0, 0, 0.60);
`

export const Content = styled(DialogOverlay)`
    min-width: 32rem;
    border-radius: 8px;
    padding: 2.5rem 3rem;
    background-color:  ${props => props.theme['cards']};
    color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    input{
        gap: 0.5rem;
        padding: 0.5rem;
        color: ${props => props.theme['text']};
        background-color: ${props => props.theme['background']};
    }
`