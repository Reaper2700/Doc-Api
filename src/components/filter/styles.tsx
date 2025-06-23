// Container.ts
import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column; /* ou row, se preferir */
  align-items: center;
  justify-content: center; /* ou flex-start, space-between, etc. */
  background-color: ${props => props.theme['background']}; /* opcional */
  padding: 1rem; /* opcional */
`;

export const HeaderFilterContainer = styled.div`
    width: 100%;
    max-width: 800px;

    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 4rem;
    gap: 3rem;
    .Name{
        display: flex;
        padding-bottom: 2rem;
        align-items: start;
        h2{
            font-size: 16px;
            font-weight: bold;
        }
        
        img{
        width: 60px;
        height: 60px;
        border-radius: 8px;
        border-color: ${props => props.theme['green-light']};
        }
    }
`