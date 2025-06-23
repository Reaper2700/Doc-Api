import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/Global";
import { HomePage } from "./components/page";
import { MedicProvider } from "./context/Medics/MedicProvider";
import { ConsultationProvider } from "./context/consultation/ConsultationProvider";
import { PatientProvider } from "./context/Patients/PatientsProvider";
import { PlansProvider } from "./context/Plans/PlansProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FilterPage } from "./components/filter/filter";
import { DownLoadPage } from "./components/download/download";



export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <MedicProvider>
        <PatientProvider>
          <ConsultationProvider>
            <PlansProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/filters" element={<FilterPage />} />
                  <Route path="/download" element={<DownLoadPage />} />
                </Routes>
              </BrowserRouter>
            </PlansProvider>
          </ConsultationProvider>
        </PatientProvider>
      </MedicProvider>
    </ThemeProvider>
  );
}