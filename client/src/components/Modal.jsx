import React from 'react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="sh-modal-backdrop" onClick={onClose}>
      <div className="sh-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sh-modal-header">
          <h3>{title}</h3>
          <button className="sh-close" onClick={onClose}>×</button>
        </div>
        <div className="sh-modal-body">{children}</div>
      </div>
    </div>
  )
}
