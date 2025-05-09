import logo from "../../assets/ignite.svg"
import { HeaderContainer } from "./styles"

export default function HeaderHomePage(){
    return(
        <HeaderContainer>
                <img src={logo} />
                <h2>Talk Doc</h2>
        </HeaderContainer>
    )
}