import React, { useEffect, useState } from 'react'
import { fetchMyEvents, createEvent, updateEvent, deleteEvent } from '../api'
import { useAuth } from '../auth'
import Header from '../components/Header'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [eventLoading, setEventLoading] = useState(true)

  async function load() {
    try {
      setEventLoading(true)
      const ev = await fetchMyEvents()
      setEvents(ev)
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setEventLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function add(e) {
    e.preventDefault()
    if (!title || !startTime || !endTime) return
    
    setLoading(true)
    try {
      await createEvent({ title, startTime, endTime })
      setTitle('')
      setStartTime('')
      setEndTime('')
      load()
    } catch (err) {
      console.error('Failed to create event:', err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleSwappable(ev) {
    const newStatus = ev.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE'
    try {
      await updateEvent(ev._id, { status: newStatus })
      load()
    } catch (err) {
      console.error('Failed to update event:', err)
    }
  }

  async function remove(ev) {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await deleteEvent(ev._id)
      load()
    } catch (err) {
      console.error('Failed to delete event:', err)
    }
  }

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <Header />
      <div className="sh-container sh-page">
        <h1 className="sh-page-title">Dashboard</h1>
        <p className="sh-page-subtitle">Manage your events and time slots</p>

        <div className="sh-card">
          <div className="sh-card-header">
            <h2 className="sh-card-title">Create New Event</h2>
          </div>
          
          <form onSubmit={add} className="sh-form">
            <div className="sh-form-group">
              <label htmlFor="title">Event Title</label>
              <input 
                id="title"
                placeholder="e.g., Team Meeting, Focus Block" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                required 
              />
            </div>
            
            <div className="sh-form-row">
              <div className="sh-form-group">
                <label htmlFor="startTime">Start Time</label>
                <input 
                  id="startTime"
                  type="datetime-local" 
                  value={startTime} 
                  onChange={e => setStartTime(e.target.value)}
                  required 
                />
              </div>
              
              <div className="sh-form-group">
                <label htmlFor="endTime">End Time</label>
                <input 
                  id="endTime"
                  type="datetime-local" 
                  value={endTime} 
                  onChange={e => setEndTime(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>

        <div className="sh-card">
          <div className="sh-card-header">
            <h2 className="sh-card-title">Your Events</h2>
          </div>
          
          {eventLoading ? (
            <div className="empty-state">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <p>No events yet. Create your first event above!</p>
            </div>
          ) : (
            <div>
              {events.map(ev => (
                <div key={ev._id} className="slot-card">
                  <div className="slot-meta">
                    <div className="slot-title">{ev.title}</div>
                    <div className="slot-time">{formatDateTime(ev.startTime)} - {formatDateTime(ev.endTime)}</div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`slot-status ${ev.status.toLowerCase()}`}>
                      {ev.status}
                    </span>
                    
                    <button 
                      className={ev.status === 'SWAPPABLE' ? 'secondary' : 'success'}
                      onClick={() => toggleSwappable(ev)}
                      disabled={ev.status === 'SWAP_PENDING'}
                    >
                      {ev.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}
                    </button>
                    
                    <button 
                      className="danger"
                      onClick={() => remove(ev)}
                      disabled={ev.status === 'SWAP_PENDING'}
                    >
                      Delete
                    </button>
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
