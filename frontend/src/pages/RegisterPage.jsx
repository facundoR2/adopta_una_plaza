import { useMemo, useState } from 'react'
import './RegisterPage.css'

const plazaImages = {
  1: 'https://images.unsplash.com/photo-1516728778615-2d590ea1856f?auto=format&fit=crop&w=900&q=80',
  2: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  3: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  4: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=900&q=80',
  5: 'https://images.unsplash.com/photo-1493810329807-efec30c52f6d?auto=format&fit=crop&w=900&q=80',
  6: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  7: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  8: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
  9: 'https://images.unsplash.com/photo-1475695744644-7882d6b236fc?auto=format&fit=crop&w=900&q=80',
  10: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
}

const getPlazaImage = (plaza) => plazaImages[plaza.uId] || 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80'

export default function RegisterPage({ onBackToHome, onNext, plazas = [], loading }) {
  const [step, setStep] = useState(1)
  const [isGroup, setIsGroup] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [participantCount, setParticipantCount] = useState(2)
  const [groupMembers, setGroupMembers] = useState([
    { firstName: '', lastName: '', email: '' },
    { firstName: '', lastName: '', email: '' },
  ])
  const [selectedPlazaId, setSelectedPlazaId] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const selectedPlaza = useMemo(
    () => plazas.find((plaza) => String(plaza.uId) === String(selectedPlazaId)),
    [plazas, selectedPlazaId],
  )

  const normalizeGroupMembers = (count, members) => {
    const next = [...members]
    while (next.length < count) {
      next.push({ firstName: '', lastName: '', email: '' })
    }
    if (next.length > count) {
      next.length = count
    }
    return next
  }

  const handleGroupCountChange = (value) => {
    const count = Math.max(2, Math.min(10, Number(value) || 2))
    setParticipantCount(count)
    setGroupMembers((current) => normalizeGroupMembers(count, current))
  }

  const handleToggleGroup = (value) => {
    setIsGroup(value)
    if (value) {
      setParticipantCount(2)
      setGroupMembers([
        { firstName: '', lastName: '', email: '' },
        { firstName: '', lastName: '', email: '' },
      ])
    }
  }

  const handleGroupMemberChange = (index, field, value) => {
    setGroupMembers((current) => {
      const next = [...current]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleNext = (event) => {
    event.preventDefault()
    if (isGroup) {
      const invalid = groupMembers.slice(0, participantCount).some((member) => {
        return !member.firstName.trim() || !member.lastName.trim() || !member.email.trim()
      })
      if (invalid) {
        return
      }
    } else {
      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        return
      }
    }
    setStep(2)
  }

  const handleSelectPlaza = (plazaId) => {
    setSelectedPlazaId(plazaId)
  }

  const handleFinish = () => {
    if (!selectedPlazaId) {
      return
    }

    const payload = isGroup
      ? {
          group: true,
          participantCount,
          members: groupMembers.slice(0, participantCount).map((member) => ({
            firstName: member.firstName.trim(),
            lastName: member.lastName.trim(),
            email: member.email.trim(),
          })),
          plazaId: selectedPlazaId,
        }
      : {
          group: false,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          plazaId: selectedPlazaId,
        }

    onNext(payload)
    setSubmitted(true)
  }

  const title = step === 1 ? 'Paso 1: Datos personales' : 'Paso 2: Elige tu plaza'
  const subtitle =
    step === 1
      ? 'Ingresá tu correo y nombre para empezar el proceso de voluntariado.'
      : 'Seleccioná una plaza para ser voluntario y acompañar su adopción.'

  return (
    <div className="register-page">
      <div className={`register-shell ${step === 2 ? 'register-shell-step2' : ''}`}>
        <section className="register-panel register-intro">
          <div className="register-badge">Registro voluntario</div>
          <h1>Adoptá una plaza en dos pasos</h1>
          <p>Sumate como voluntario y elegí el espacio verde con el que querés colaborar.</p>
          <div className="register-steps">
            <div className={`register-step ${step === 1 ? 'active' : ''}`}>
              <span>1</span>
              <div>
                <strong>Datos personales</strong>
                <p>Correo y nombre</p>
              </div>
            </div>
            <div className={`register-step ${step === 2 ? 'active' : ''}`}>
              <span>2</span>
              <div>
                <strong>Elegir plaza</strong>
                <p>Seleccioná tu lugar de voluntariado</p>
              </div>
            </div>
          </div>
          <button className="btn-link" type="button" onClick={onBackToHome}>
            ← Volver al inicio
          </button>
        </section>

        <section className="register-panel register-form-panel">
          <div className="register-form-header">
            <p className="eyebrow">{title}</p>
            <h2>{subtitle}</h2>
          </div>

          {submitted ? (
            <div className="register-summary">
              <p className="eyebrow">¡Listo!</p>
              <h3>Gracias por registrarte</h3>
              <p>
                Recibimos tu solicitud para ser voluntario en{' '}
                <strong>{selectedPlaza?.nombre ?? 'una plaza'}</strong>.
              </p>
              <button className="btn-primary" type="button" onClick={onBackToHome}>
                Volver al inicio
              </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <form className="register-form register-form-step1" onSubmit={handleNext}>
                  <div className="group-toggle">
                    <label className={`radio-option ${!isGroup ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="registrationType"
                        checked={!isGroup}
                        onChange={() => handleToggleGroup(false)}
                      />
                      <span>Voluntario individual</span>
                    </label>
                    <label className={`radio-option ${isGroup ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="registrationType"
                        checked={isGroup}
                        onChange={() => handleToggleGroup(true)}
                      />
                      <span>Registro como grupo</span>
                    </label>
                  </div>

                  {!isGroup && (
                    <>
                      <div className="two-column-fields">
                        <label className="field-group">
                          <span>Nombre</span>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            placeholder="Nombre"
                            required
                          />
                        </label>
                        <label className="field-group">
                          <span>Apellido</span>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            placeholder="Apellido"
                            required
                          />
                        </label>
                      </div>
                      <label className="field-group">
                        <span>Correo electrónico</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="tu@email.com"
                          required
                        />
                      </label>
                    </>
                  )}

                  {isGroup && (
                    <>
                      <div className="field-group">
                        <span>Cantidad de participantes</span>
                        <input
                          type="number"
                          min="2"
                          max="10"
                          value={participantCount}
                          onChange={(event) => handleGroupCountChange(event.target.value)}
                        />
                      </div>
                      <div className="group-members">
                        {groupMembers.slice(0, participantCount).map((member, index) => (
                          <div key={index} className="group-member-card">
                            <p className="member-label">Participante {index + 1}</p>
                            <div className="two-column-fields">
                              <label className="field-group">
                                <span>Nombre</span>
                                <input
                                  type="text"
                                  value={member.firstName}
                                  onChange={(event) => handleGroupMemberChange(index, 'firstName', event.target.value)}
                                  placeholder="Nombre"
                                  required
                                />
                              </label>
                              <label className="field-group">
                                <span>Apellido</span>
                                <input
                                  type="text"
                                  value={member.lastName}
                                  onChange={(event) => handleGroupMemberChange(index, 'lastName', event.target.value)}
                                  placeholder="Apellido"
                                  required
                                />
                              </label>
                            </div>
                            <label className="field-group">
                              <span>Correo electrónico</span>
                              <input
                                type="email"
                                value={member.email}
                                onChange={(event) => handleGroupMemberChange(index, 'email', event.target.value)}
                                placeholder="email@ejemplo.com"
                                required
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <button className="btn-primary" type="submit">
                    Siguiente paso →
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="register-plaza-step register-plaza-step2">
                  {loading && plazas.length === 0 && (
                    <div className="status-text">Cargando plazas...</div>
                  )}

                  {!loading && plazas.length === 0 && (
                    <div className="status-text status-error">
                      No hay plazas disponibles por el momento.
                    </div>
                  )}

                  <div className="plazas-grid">
                    {plazas.map((plaza) => (
                      <button
                        key={plaza.uId}
                        type="button"
                        className={`plaza-card register-plaza-card ${String(plaza.uId) === String(selectedPlazaId) ? 'selected' : ''}`}
                        style={{ backgroundImage: `url(${getPlazaImage(plaza)})` }}
                        onClick={() => handleSelectPlaza(plaza.uId)}
                      >
                        <span className="plaza-card-overlay" />
                        <div className="plaza-card-content">
                          <span className="plaza-card-id">#{plaza.uId}</span>
                          <h3>{plaza.nombre}</h3>
                          <p>{plaza.barrio}</p>
                        </div>
                        <span className="plaza-card-action">Seleccionar</span>
                      </button>
                    ))}
                  </div>

                  <div className="register-actions">
                    <button className="btn-secondary" type="button" onClick={() => setStep(1)}>
                      ← Volver
                    </button>
                    <button
                      className="btn-primary"
                      type="button"
                      onClick={handleFinish}
                      disabled={!selectedPlazaId}
                    >
                      Confirmar plaza
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
