// Updated SymptomAnalysis UI to match the provided image layout and use pink color styling

import React, { useState, useContext } from "react";
import styled from "styled-components";
import { FilterContext } from "../../context/FilterContext";
import AIConsult from "./AIConsult";
import { notes } from "../../utils/Icons";
import DiseaseMapping from '../../config/disease.json'

const SymptomAnalysis = ({ updateActive }) => {
  const { setDoctorSpec } = useContext(FilterContext);
  const [submitted, setSubmitted] = useState(false);
  const [diagnosis, setDiagnosis] = useState("undefined");
  const [outcome, setOutcome] = useState(false);
  const [consultAI, setConsultAI] = useState(false);

  const [formData, setFormData] = useState({
    fever: "Yes",
    cough: "Yes",
    fatigue: "Yes",
    difficulty_breathing: "Yes",
    age: 25,
    gender: "Male",
    blood_pressure: "Low",
    cholesterol: "Normal"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConsultDoctor = () => {
    console.log("diagnosis : ", diagnosis);
    if (diagnosis != "undefined" || diagnosis != undefined) {
      console.log(DiseaseMapping[diagnosis]);
      setDoctorSpec(DiseaseMapping[diagnosis]);
    }
    updateActive(4);
  };

  const handleConsultAI = () => {
    setConsultAI(true);
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, age: parseInt(e.target.value) });
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    // Send to backend here
    const url = "http://127.0.0.1:5000/predict";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response:", data);
        setDiagnosis(data.disease);
        setOutcome(data.status)

      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });

    setSubmitted(true);
  };

  return (
    <>
        {!submitted && (<FormContainer>
        <h2>Please fill out the form below:</h2>
        <FormGrid>
            <FormGroup>
            <label>Fever</label>
            <Select name="fever" value={formData.fever} onChange={handleChange}>
                <option>Yes</option>
                <option>No</option>
            </Select>
            </FormGroup>
            <FormGroup>
            <label>Age</label>
            <SliderContainer>
                <Slider
                type="range"
                min="0"
                max="100"
                value={formData.age}
                onChange={handleSliderChange}
                />
                <AgeLabel>{formData.age}</AgeLabel>
            </SliderContainer>
            </FormGroup>
            <FormGroup>
            <label>Cough</label>
            <Select name="cough" value={formData.cough} onChange={handleChange}>
                <option>Yes</option>
                <option>No</option>
            </Select>
            </FormGroup>
            <FormGroup>
            <label>Gender</label>
            <Select name="gender" value={formData.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
            </Select>
            </FormGroup>
            <FormGroup>
            <label>Fatigue</label>
            <Select name="fatigue" value={formData.fatigue} onChange={handleChange}>
                <option>Yes</option>
                <option>No</option>
            </Select>
            </FormGroup>
            <FormGroup>
            <label>Blood Pressure</label>
            <Select name="blood_pressure" value={formData.blood_pressure} onChange={handleChange}>
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
            </Select>
            </FormGroup>
            <FormGroup>
            <label>Difficulty Breathing</label>
            <Select
                name="difficulty_breathing"
                value={formData.difficulty_breathing}
                onChange={handleChange}
            >
                <option>Yes</option>
                <option>No</option>
            </Select>
            </FormGroup>
            <FormGroup>
            <label>Cholesterol Level</label>
            <Select
                name="cholesterol"
                value={formData.cholesterol}
                onChange={handleChange}
            >
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
            </Select>
            </FormGroup>
        </FormGrid>
        <SubmitButton onClick={handleSubmit}>Predict Disease</SubmitButton>
        </FormContainer>)}
        {submitted && !consultAI && (
        <Divv>
        <div className="head">
            Analysis report:
        </div>
            <Diagnosis>
                {outcome && (<Dig>
                    <p>{notes}</p>
                    {diagnosis != "undefined" ? (
                    <>
                        <p>
                            The predicted outcome is: Positive
                        </p>
                        <p>
                        It seems like you may be experiencing symptoms of{" "}
                        <strong>{diagnosis}</strong>.
                        </p>
                        <p>Please consult a {DiseaseMapping[diagnosis]}.</p>
                    </>
                    ) : (
                    "Your symptoms do not match any disease. Please consult a doctor."
                    )}
                </Dig>)}
                {!outcome && (<Dig>
                    <p>{notes}</p>
                        <p>
                            Your symptoms do not match any disease. Please consult a doctor.
                        </p>
                </Dig>)}
                <div className="consultation-options">
                    <div className="consultation-option">
                    <p>Would you like assistance in finding a doctor nearby?</p>
                    <ConsultDoctorButton onClick={handleConsultDoctor}>
                        Yes, please find me a doctor
                    </ConsultDoctorButton>
                    </div>
                    <div className="consultation-option">
                    <p>Would you like any AI assistance regarding your symptoms?</p>
                    <ConsultAI onClick={handleConsultAI}>
                        Yes, get me AI assistance
                    </ConsultAI>
                    </div>
                </div>
                </Diagnosis>
            </Divv>
      )}
      {consultAI && (
        <AIConsult
          symptoms={formData}
          diagnosis={diagnosis}
        ></AIConsult>
      )}
    </>
  );
};

const FormContainer = styled.div`
  padding: 40px;
  color: #333;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
  h2 {
    font-size: 24px;
    margin-bottom: 30px;
  }
`;

const Divv = styled.div`
  .head{
    color: darkviolet;
    font-size: 25px;
    font-weight: 605;
    margin: 50px 40px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 8px;
    color: #101010;
    font-size: 14px;
  }
`;

const Select = styled.select`
  background-color:rgb(163, 42, 233);
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Slider = styled.input`
  width: 100%;
  margin-right: 10px;
  accent-color: #f472b6;
`;

const AgeLabel = styled.span`
  color: #f472b6;
  font-weight: bold;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  margin-top: 40px;
  padding: 12px 24px;
  background-color: #f472b6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #ec4899;
  }
`;

const Diagnosis = styled.div`
  margin: 4px 0px;
  text-align: center;
  color: #222260;
  font-weight: 400;
  font-size: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .consultation-options {
    margin: 60px 25px;
    display: flex;
    justify-content: space-between;
  }

  .consultation-option {
    flex: 1;
    margin-right: 18px; /* Adjust spacing between cards */
    cursor: pointer;
  }
`;

const Dig = styled.div`
  padding: 15px;
  color: white;
  border: 1px solid darkviolet;
  border-radius: 5px;
  font-size: 23px;
  // max-width: 10rem;
  background-color: darkviolet;
  margin: 38px auto;
`;

const ConsultDoctorButton = styled.button`
  padding: 10px 20px;
  background-color: #222260;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: white;
    color: darkviolet;
  }
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ConsultAI = styled.button`
  padding: 10px 20px;
  background-color: #222260;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: white;
    color: darkviolet;
  }
  margin-top: 20px;
`;

export default SymptomAnalysis;
