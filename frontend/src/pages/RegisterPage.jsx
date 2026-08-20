import  useMultiStepRegister from  '../hooks/useMultiStepRegister';
import Step1Form from '../components/Step1Form';
import Step2PlazaSelection from '../components/Step2PlazaSelection';
import NavBar  from '../components/NavBar';
import Footer from '../components/Footer';





export default function RegisterPage({ onBackToHome, onGoToPlazas, onGoToLogin, onRegisterSuccess, plazas, loading}) {
  const {step, userData, updateFields, nextStep, prevStep} = useMultiStepRegister();
  return (
    <div className='register-page'>
      <NavBar active="home" onGoToHome={() => {}} onGoToPlazas={onGoToPlazas} onGoToLogin={onGoToLogin}  />
      <button onClick={onBackToHome}>Volver al Inicio</button>
      {step == 1 && (
        <Step1Form
          data={userData}
          updateFields={updateFields}
          onNext={nextStep}
        />
      )
    }

    {step == 2 && (
      <Step2PlazaSelection
        data={userData}
        updateFields={updateFields}
        onBack={prevStep}
      />
    )}
    <Footer onGoToPlazas={onGoToPlazas} />
    </div>
    
  );
}