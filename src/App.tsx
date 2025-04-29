import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/Global";
import { HomePage } from "./components/page";



export function App() {

  return (
    <>
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle/>
        <HomePage/>
    </ThemeProvider>
    </>
  )
}
