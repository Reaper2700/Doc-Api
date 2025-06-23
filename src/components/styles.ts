import styled from "styled-components";

export const HeaderHomePage = styled.header`
    width: 100%;
    max-width: 1500 px;
    height: 100px;
    background-color: #202024;
`

export const HomePageContainer = styled.div`
    width: 100%;
    max-width: 1500px;
    height: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    background-color: ${props => props.theme['background']};

    .button{
        width: 145px;
        height: 50px;
        border-radius: 8px;

        background-color:  ${props => props.theme['green-light']};
        cursor: pointer;
        
        &:hover{
        transition: 0.4s;
        background-color: ${props => props.theme["green"]};
        }
    }
`