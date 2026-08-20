import { useState, useEffect } from "react";

export default function useMultiStepRegister() {
    const [step, setStep] = useState(1);
    const[userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        esGrupo: false, // para manejar logica solo vs grupo.
        plazaId: null // para el paso 2
    });

    const updateFields = (fields) => {
        setUserData(prev => ({ ...prev, ...fields}));
    };


    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return { step, userData, updateFields, nextStep, prevStep };
};