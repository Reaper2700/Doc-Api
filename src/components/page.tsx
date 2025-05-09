import HeaderHomePage from "./header/Header";
import ListMedics from "./medic/listMedic";
import ListPatients from "./patients/listPatient";
import { HomePageContainer } from "./styles";

export function HomePage(){
    
    return(
        <div>
            <HomePageContainer>
                <HeaderHomePage/>
                <ListMedics/>
                <ListPatients/>
            </HomePageContainer>
        </div>
    )
}