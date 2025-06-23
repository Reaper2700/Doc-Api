import { ListConsultation } from "./consultation/ListConsultation";
import HeaderHomePage from "./header/Header";
import ListMedics from "./medic/listMedic";
import ListPatients from "./patients/listPatient";
import { ListPlans } from "./Plans/ListPlans";
import { HomePageContainer } from "./styles";
import { useNavigate } from 'react-router-dom';

export function HomePage() {
    const navigate = useNavigate();
    return (
        <div>
            <HomePageContainer>
                <HeaderHomePage />
                <div>
                    <button className="button" onClick={() => navigate('/filters')}>Filter</button>
                </div>
                <div>
                    <button className="button" onClick={() => navigate('/download')}>download</button>
                </div>
                <ListMedics />
                <ListPatients />
                <ListConsultation />
                <ListPlans />
            </HomePageContainer>
        </div>
    )
}