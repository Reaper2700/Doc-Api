import CreateMedic from "./medic/createMedic";
import ListMedics from "./medic/listMedic";
import CreatePatient from "./patients/createPatient";
import ListPatients from "./patients/listPatient";
import { HeaderHomePage, HomePageContainer } from "./styles";

export function HomePage(){
    
    return(
        <div>
            <HeaderHomePage/>
            <HomePageContainer>
                <ListMedics/>
                <ListPatients/>
            </HomePageContainer>
        </div>
    )
}