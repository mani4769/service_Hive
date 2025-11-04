import React, { useEffect, useState } from 'react'
import { fetchMySwapRequests, postSwapResponse } from '../api'
import Header from '../components/Header'

export default function Requests() {
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const res = await fetchMySwapRequests()
      setIncoming(res.incoming)
      setOutgoing(res.outgoing)
    } catch (err) {
      console.error('Failed to load swap requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function respond(id, accepted) {
    try {
      await postSwapResponse(id, { accepted })
      load()
      if (accepted) {
        alert('Swap request accepted! Events have been exchanged.')
      } else {
        alert('Swap request rejected.')
      }
    } catch (err) {
      console.error('Failed to respond to swap request:', err)
      alert('Failed to respond to request. Please try again.')
    }
  }

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'pending'
      case 'ACCEPTED': return 'swappable'
      case 'REJECTED': return 'busy'
      default: return 'pending'
    }
  }

  return (
    <div>
      <Header />
      <div className="sh-container sh-page">
        <h1 className="sh-page-title">Swap Requests</h1>
        <p className="sh-page-subtitle">Manage incoming and outgoing swap requests</p>

        <div className="sh-card">
          <div className="sh-card-header">
            <h2 className="sh-card-title">Incoming Requests</h2>
            <span className="text-muted">Others want to swap with you</span>
          </div>
          
          {loading ? (
            <div className="empty-state">Loading requests...</div>
          ) : incoming.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📥</div>
              <p>No incoming swap requests</p>
            </div>
          ) : (
            <div>
              {incoming.map(request => (
                <div key={request._id} className="slot-card">
                  <div className="slot-meta">
                    <div className="slot-title">
                      {request.requesterId?.name} wants to swap
                    </div>
                    <div className="slot-owner">
                      Their slot: <strong>{request.mySlotId?.title}</strong> 
                      ({formatDateTime(request.mySlotId?.startTime)})
                    </div>
                    <div className="slot-time">
                      For your slot: <strong>{request.theirSlotId?.title}</strong> 
                      ({formatDateTime(request.theirSlotId?.startTime)})
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`slot-status ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    
                    {request.status === 'PENDING' && (
                      <>
                        <button 
                          className="success"
                          onClick={() => respond(request._id, true)}
                        >
                          Accept
                        </button>
                        <button 
                          className="danger"
                          onClick={() => respond(request._id, false)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sh-card">
          <div className="sh-card-header">
            <h2 className="sh-card-title">Outgoing Requests</h2>
            <span className="text-muted">Your requests to others</span>
          </div>
          
          {loading ? (
            <div className="empty-state">Loading requests...</div>
          ) : outgoing.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📤</div>
              <p>No outgoing swap requests</p>
            </div>
          ) : (
            <div>
              {outgoing.map(request => (
                <div key={request._id} className="slot-card">
                  <div className="slot-meta">
                    <div className="slot-title">
                      Request to {request.responderId?.name}
                    </div>
                    <div className="slot-owner">
                      Your slot: <strong>{request.mySlotId?.title}</strong> 
                      ({formatDateTime(request.mySlotId?.startTime)})
                    </div>
                    <div className="slot-time">
                      For their slot: <strong>{request.theirSlotId?.title}</strong> 
                      ({formatDateTime(request.theirSlotId?.startTime)})
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`slot-status ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
