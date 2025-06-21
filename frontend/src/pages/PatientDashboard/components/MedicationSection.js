import React, { useEffect, useState } from 'react'
import './MedicationSection.css'
import { FaCamera } from 'react-icons/fa'
import axios from 'axios'

function MedicationSection({ onMarkTaken }) {
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [proofPhoto, setProofPhoto] = useState(null)
  const [medications, setMedications] = useState([])
  const token = localStorage.getItem('token')

  const fetchMedications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMedications(res.data)
    } catch (err) {
      console.error('Error fetching medications:', err)
    }
  }

 useEffect(() => {
  fetchMedications()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [token])
console.log(typeof fetchMedications) // this silences unused warning


  const handleAdd = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/medications',
        { name, dosage, frequency },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setName('')
      setDosage('')
      setFrequency('')
      alert('✅ Medication added successfully')
      fetchMedications()
    } catch (err) {
      console.error('Error adding medication:', err)
      alert('❌ Failed to add medication')
    }
  }

  const handleMark = async (medicationId) => {
    if (!proofPhoto) {
      alert('Please select a photo before marking as taken.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('photo', proofPhoto)
      formData.append('medication_id', medicationId)

      const uploadRes = await axios.post(`http://localhost:5000/api/photos/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      if (uploadRes.data?.success) {
        await axios.post(`http://localhost:5000/api/medications/${medicationId}/mark`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setProofPhoto(null)
        alert('✔️ Medication marked as taken')
        fetchMedications()
        
        // 🔁 Trigger stats refresh in parent component
        if (typeof onMarkTaken === 'function') {
          onMarkTaken()
        }
      }
    } catch (err) {
      console.error('❌ Error uploading or marking:', err.response?.data || err.message)
      alert('❌ Failed to upload photo or mark medication')
    }
  }

  const handleFileChange = (e) => {
    setProofPhoto(e.target.files[0])
  }

  return (
    <div className="medication-container">
      <h2 className="medication-title">📅 Medication Tracker</h2>

      {/* ✅ Medication list with action status */}
      {medications.length === 0 ? (
        <p className="no-medication">No medications found.</p>
      ) : (
        <div className="medication-list">
          {medications.map((med) => (
            <div key={med.id} className="medication-card">
              <div className="medication-icon">💊</div>
              <div className="medication-info">
                <div className="medication-field">
                  <span className="label">Name:</span>
                  <span className="value">{med.name}</span>
                </div>
                <div className="medication-field">
                  <span className="label">Dosage:</span>
                  <span className="value">{med.dosage}</span>
                </div>
                <div className="medication-field">
                  <span className="label">Frequency:</span>
                  <span className="value">{med.frequency}</span>
                </div>
                <div className="medication-field">
                  <span className="label">Status:</span>
                  <span
                    className={`value ${
                      med.action === 1 ? 'status-taken' : 'status-pending'
                    }`}
                  >
                    {med.action === 1 ? '✔ Taken' : '❌ Not Taken'}
                  </span>
                </div>
              </div>

              {med.action === 0 && (
                <button onClick={() => handleMark(med.id)} className="mark-btn">
                  ✔️ Mark as Taken
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload proof photo */}
      <div className="upload-proof">
        <div className="upload-icon">🖼️</div>
        <p className="upload-title">Add Proof Photo</p>
        <p className="upload-subtitle">
          Take a photo of your medication or pill organizer as confirmation
        </p>
        <label className="take-photo-btn">
          <FaCamera /> Take Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
        {proofPhoto && <p className="proof-file-name">📎 {proofPhoto.name}</p>}
      </div>

      {/* Add new medication */}
      <div className="add-form">
        <input
          type="text"
          placeholder="Medication Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        />
        <button onClick={handleAdd} className="add-btn">
          ➕ Add Medication
        </button>
      </div>
    </div>
  )
}

export default MedicationSection
