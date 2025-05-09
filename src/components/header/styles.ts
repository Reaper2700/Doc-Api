import styled from "styled-components";

export const HeaderContainer = styled.div`
    width: 100%;
    max-width: 1540px;
    height: 100px;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${props => props.theme['cards']};

    color: ${props => props.theme['text']};
`
