import styled from "styled-components";


export const PatientContainer =  styled.div`
    width: 100%;
    max-width: 1120px;
    height: 740px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 0 10px;
    border-radius: 8px;

    background-color:  ${props => props.theme['cards']};
    color: ${props => props.theme['text']}
`

export const HeaderPatientContainer = styled.div`
    width: 100%;
    max-width: 800px;

    display: flex;
    justify-content: space-between;
    align-items: start;
    padding-top: 40px;

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


export const ListPatient = styled.div`
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;
    max-width: 800px;
    height: auto;
    max-height: 500px; /* limite de altura */
    overflow-y: auto;

     &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme["background"]};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #00b37e; /* exemplo com verde */
    border-radius: 10px;
    border: 2px solid #f0f0f0;
  }
`


///////////// create medic

export const CreatePatientContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 100%;
    max-width: 1000px;
    height: auto;
    padding-right: 650px;
    
    .ButtonPatient{
        padding-top: 26px;
        padding-left: 1rem;
    }

    button{
        width: 100%;
        max-width: 145px;
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


export const CampPatient = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 206px;
    height: 40px;
    gap: 1rem;


   input{
    background-color:  ${props => props.theme['background']};
    color: ${props => props.theme['text']};

    width: 206px;
    height: 40px;
    border-radius: 8px;
    padding: 6px;
    border-color: ${props => props.theme['green-light']};
   }

   .HealthPlan{
        width: 206px;
        height: 40px;
        border-radius: 8px;
        padding: 6px;
        border-color: ${props => props.theme['green-light']};
        background-color:  ${props => props.theme['background']};
        color: ${props => props.theme['text']};
   }

`

export const PatientItem = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1rem;
   
   .Patients{
    display: flex;
   }

   span{
    font-size: 16px;
    color: ${props => props.theme['text']}
   }
`

export const Buttons = styled.div`
   gap: 1rem;

   button{
    width: 24px;
    height: 24px;


    color: ${props => props.theme['text']};
    background-color: transparent;
    border-color: transparent;
    border-radius: 8px;
    
    cursor: pointer;

    &:hover{
        transition: 0.4s;
        background-color: ${props => props.theme["green"]};
    }
   }
`