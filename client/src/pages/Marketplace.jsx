import React, { useEffect, useState } from 'react'
import { getSwappableSlots, fetchMyEvents, postSwapRequest } from '../api'
import Modal from '../components/Modal'
import Header from '../components/Header'

export default function Marketplace() {
  const [slots, setSlots] = useState([])
  const [mySwappable, setMySwappable] = useState([])
  const [selectedTheir, setSelectedTheir] = useState(null)
  const [selectedMy, setSelectedMy] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const [slotsData, myEvents] = await Promise.all([
        getSwappableSlots(),
        fetchMyEvents()
      ])
      setSlots(slotsData)
      setMySwappable(myEvents.filter(e => e.status === 'SWAPPABLE'))
    } catch (err) {
      console.error('Failed to load marketplace data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function requestSwap() {
    if (!selectedMy || !selectedTheir) return alert('Select both slots')
    try {
      await postSwapRequest({ mySlotId: selectedMy, theirSlotId: selectedTheir })
      setModalOpen(false)
      setSelectedMy(null)
      setSelectedTheir(null)
      load()
      alert('Swap request sent successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request')
    }
  }

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const openSwapModal = (slotId) => {
    setSelectedTheir(slotId)
    setModalOpen(true)
  }

  return (
    <div>
      <Header />
      <div className="sh-container sh-page">
        <h1 className="sh-page-title">Marketplace</h1>
        <p className="sh-page-subtitle">Find and request swaps with other users</p>

        <div className="sh-card">
          <div className="sh-card-header">
            <h2 className="sh-card-title">Available Slots</h2>
          </div>
          
          {loading ? (
            <div className="empty-state">Loading available slots...</div>
          ) : slots.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p>No swappable slots available right now. Check back later!</p>
            </div>
          ) : (
            <div>
              {slots.map(slot => (
                <div 
                  key={slot._id} 
                  className={`slot-card ${selectedTheir === slot._id ? 'selected' : ''}`}
                  onClick={() => openSwapModal(slot._id)}
                >
                  <div className="slot-meta">
                    <div className="slot-title">{slot.title}</div>
                    <div className="slot-owner">by {slot.ownerId?.name || 'Unknown'}</div>
                    <div className="slot-time">{formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="slot-status swappable">Available</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sh-card">
          <div className="sh-card-header">
            <h2 className="sh-card-title">Your Swappable Slots</h2>
          </div>
          
          {mySwappable.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <p>You have no swappable slots. Mark events as swappable on your dashboard to offer them for swap.</p>
            </div>
          ) : (
            <div>
              {mySwappable.map(slot => (
                <div key={slot._id} className="slot-card">
                  <div className="slot-meta">
                    <div className="slot-title">{slot.title}</div>
                    <div className="slot-time">{formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="slot-status swappable">Swappable</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal open={modalOpen} title="Request Swap" onClose={() => setModalOpen(false)}>
          <div className="sh-form">
            <p className="mb-4">Choose one of your swappable slots to offer in exchange:</p>
            
            {mySwappable.length === 0 ? (
              <div className="empty-state">
                <p>You need at least one swappable slot to make a swap request.</p>
              </div>
            ) : (
              <div>
                {mySwappable.map(slot => (
                  <label key={slot._id} className={`slot-card ${selectedMy === slot._id ? 'selected' : ''}`}>
                    <div className="slot-meta">
                      <div className="slot-title">{slot.title}</div>
                      <div className="slot-time">{formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}</div>
                    </div>
                    
                    <input 
                      type="radio" 
                      name="my-slot" 
                      value={slot._id}
                      checked={selectedMy === slot._id}
                      onChange={() => setSelectedMy(slot._id)} 
                    />
                  </label>
                ))}
                
                <div className="flex justify-between gap-4 mt-6">
                  <button 
                    type="button"
                    className="secondary" 
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={requestSwap} 
                    disabled={!selectedMy}
                  >
                    Send Swap Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  )
}
