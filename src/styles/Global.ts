import { createGlobalStyle } from "styled-components";
// src/styles/styled.d.ts
import 'styled-components'
import { defaultTheme } from './themes/default'

type ThemeType = typeof defaultTheme

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}


export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :focus {
        border: 2px solid ${(props) => props.theme['purple-light']};
        box-shadow: 0 0 4px ${(props) => props.theme['purple-light']};
    }

    body {
        background-color: ${(props) => props.theme['background']};
        
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        line-height: 1.5;    
    }

    body, input, textarea, button {
        font: 400 1rem Roboto, sans-serif;
    }
`;
