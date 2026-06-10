'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

// --- INLINE STYLE OBJECTS FOR THE PERFECT UI ---
const styles = {
  screenCentering: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    padding: '16px',
    boxSizing: 'border-box' as const,
    zIndex: 1000,
    overflow: 'hidden' as const
  },
  // --- TOAST NOTIFICATION STYLES ---
  toast: (type: 'success' | 'error') => ({
    position: 'absolute' as const,
    top: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#18181b',
    border: type === 'success' ? '1px solid #22c55e' : '1px solid #ef4444',
    borderRadius: '12px',
    padding: '12px 20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
    zIndex: 1100,
    fontFamily: 'sans-serif',
    transition: 'all 0.3s ease-in-out',
  }),
  cardContainer: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '360px', 
    borderRadius: '2.2rem', 
    border: '1px solid #27272a',
    backgroundColor: '#121212',
    padding: '28px',
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: 'sans-serif',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  rowGap: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  topLabel: {
    textAlign: 'left' as const,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '4px'
  },
  actionButton: (isActive: boolean) => ({
    width: '100%',
    padding: '16px 0',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '12px',
    border: isActive ? '2px solid #3b82f6' : '1px solid #27272a',
    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(22, 22, 22, 0.4)',
    color: isActive ? '#3b82f6' : '#a1a1aa',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box' as const,
    outline: 'none',
  }),
  readyInButton: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: isActive ? '2px solid #3b82f6' : '1px solid #27272a',
    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(22, 22, 22, 0.3)',
    borderRadius: '12px',
    padding: '10px 16px',
    boxSizing: 'border-box' as const,
    width: '100%',
    outline: 'none',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden' as const,
    height: '54px'
  }),
  readyInText: (isActive: boolean) => ({
    fontSize: '14px',
    color: isActive ? '#3b82f6' : '#a1a1aa',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap' as const
  }),
  timerContainer: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    opacity: isActive ? 1 : 0,
    maxWidth: isActive ? '200px' : '0px',
    transform: isActive ? 'translateX(0)' : 'translateX(20px)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    marginLeft: isActive ? 'auto' : '0px',
    pointerEvents: (isActive ? 'auto' : 'none') as any
  }),
  timerDisplayBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
    border: '1px solid #27272a',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '0 8px',
    overflow: 'hidden' as const,
    boxSizing: 'border-box' as const
  },
  updateButton: {
    width: '100%',
    marginTop: '8px',
    backgroundColor: 'rgba(22, 22, 22, 0.2)',
    border: '1px solid #27272a',
    color: '#d4d4d8',
    borderRadius: '12px',
    padding: '16px 0',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.15em',
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
    outline: 'none'
  }
};

// --- MOBILE INTERACTIVE SCROLL PICKER ---
const ScrollPicker = ({ max, value, onChange, onUserScroll }: { max: number, value: number, onChange: (v: number) => void, onUserScroll: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);
  const scrollTimeout = useRef<any>(null);
  const items = Array.from({ length: max + 1 }, (_, i) => i);

  useEffect(() => {
    if (containerRef.current) {
      isAutoScrolling.current = true;
      containerRef.current.scrollTop = value * 32;
      setTimeout(() => { isAutoScrolling.current = false; }, 50);
    }
  }, [value]);

  const handleScroll = (e: any) => {
    if (isAutoScrolling.current) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    const index = Math.round(e.target.scrollTop / 32);
    if (index !== value && index >= 0 && index <= max) {
      onUserScroll(); 
      onChange(index);
    }
  };

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll} 
      className="no-scrollbar"
      style={{ 
        height: '32px', 
        width: '24px', 
        overflowY: 'auto', 
        scrollSnapType: 'y mandatory', 
        WebkitOverflowScrolling: 'touch', 
        cursor: 'ns-resize',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {items.map(i => (
        <div 
          key={i} 
          style={{ 
            height: '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            scrollSnapAlign: 'start', 
            fontSize: '14px', 
            color: '#ffffff',
            userSelect: 'none'
          }}
        >
          {i.toString().padStart(2, '0')}
        </div>
      ))}
    </div>
  );
};

interface FoodStatusPopupProps {
    isOpen: boolean;
    onClose: () => void;
    foodId: number;
    foodName: string;
    studentId: string;
    onUpdateSuccess: () => void;
}

// --- MAIN APPLICATION ---
export default function FoodStatusPopup({ isOpen, onClose, foodId, foodName, studentId, onUpdateSuccess }: FoodStatusPopupProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Picker States
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Countdown States
  const [isCounting, setIsCounting] = useState(false);

  // Toast Notification States
  const [toast, setToast] = useState<{ show: boolean, type: 'success' | 'error', message: string }>({ show: false, type: 'success', message: '' });

  useEffect(() => {
    let interval: any;
    if (isCounting && selectedStatus === 'timer') {
      interval = setInterval(() => {
        const totalSecs = (hours * 3600) + (minutes * 60) + seconds;
        
        if (totalSecs <= 1) {
          setHours(0); setMinutes(0); setSeconds(0);
          setIsCounting(false);
          setSelectedStatus('available'); 
          showToast('success', 'Update Submitted: Food is now Available! ✅');
          clearInterval(interval);
        } else {
          const newTime = totalSecs - 1;
          setHours(Math.floor(newTime / 3600));
          setMinutes(Math.floor((newTime % 3600) / 60));
          setSeconds(newTime % 60);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCounting, hours, minutes, seconds, selectedStatus]);

  // Toast පෙන්වන සහ තත්පර 3කින් auto-hide කරන function එක
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
    }, 3000);
  };

  const handleUpdate = async () => {
    if (!selectedStatus) {
      showToast('error', 'Update Failed: No status selected! ❌');
      return;
    }

    let statusType = '';
    let minutesToReady = 0;

    if (selectedStatus === 'available') {
      statusType = 'available';
    } else if (selectedStatus === 'not_available') {
      statusType = 'out_of_stock';
    } else if (selectedStatus === 'timer') {
      statusType = 'cooking';
      // Calculate total minutes for the backend
      minutesToReady = (hours * 60) + minutes + (seconds > 0 ? 1 : 0);
      
      if (minutesToReady <= 0) {
        showToast('error', 'Update Failed: Please set a valid time! ❌');
        return;
      }
    }

    try {
      // Note: Using the backend URL from the original code provided by user
      const response = await fetch('http://localhost:8000/api/v1/food-status/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: foodId, // Mapping foodId to product_id
          user_id: studentId, // Mapping studentId to user_id
          status_type: statusType,
          minutes_to_ready: minutesToReady
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (selectedStatus === 'timer') {
          setIsCounting(true);
          showToast('success', 'Update Submitted: Countdown Started! ⏳');
        } else {
          setIsCounting(false);
          setHours(0); setMinutes(0); setSeconds(0);
          showToast('success', 'Update Submitted Successfully! ');
        }
        // Small delay before closing or calling success callback
        setTimeout(() => {
            onUpdateSuccess();
            if (selectedStatus !== 'timer') onClose();
        }, 1500);
      } else {
        showToast('error', `Update Failed: ${result.detail || 'Server Error'} ❌`);
      }
    } catch (error) {
      console.error('API Error:', error);
      showToast('error', 'Update Failed: Could not connect to backend! ❌');
    }
  };

  const handleUserInteracted = () => {
    setSelectedStatus('timer');
    setIsCounting(false); 
  };

  if (!isOpen) return null;

  return (
    <div style={styles.screenCentering}>
      
      {/* --- FLOATING TOAST NOTIFICATION VIEW --- */}
      {toast.show && (
        <div style={styles.toast(toast.type)}>
          {toast.type === 'success' ? (
            <CheckCircle size={18} color="#22c55e" />
          ) : (
            <AlertCircle size={18} color="#ef4444" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Card UI */}
      <div style={styles.cardContainer}>
        
        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', width: '100%' }}>
          <button 
            onClick={onClose} 
            style={{ backgroundColor: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center' }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content Stack */}
        <div style={styles.rowGap}>
          
          {/* Title Label */}
          <h2 style={styles.topLabel}>
            {foodName}
          </h2>

          {/* Available Button */}
          <button 
            style={styles.actionButton(selectedStatus === 'available')}
            onClick={() => { setSelectedStatus('available'); setIsCounting(false); }}
          >
            Available
          </button>

          {/* Not Available Button */}
          <button 
            style={styles.actionButton(selectedStatus === 'not_available')}
            onClick={() => { setSelectedStatus('not_available'); setIsCounting(false); }}
          >
            Not Available
          </button>

          {/* Will be ready in (Timer Row) */}
          <div 
            style={styles.readyInButton(selectedStatus === 'timer')}
            onClick={() => { setSelectedStatus('timer'); setIsCounting(false); }}
          >
            <div style={{ flex: selectedStatus === 'timer' ? 0 : 1, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            
            <span style={styles.readyInText(selectedStatus === 'timer')}>
              Will be ready in
            </span>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
              <div style={styles.timerContainer(selectedStatus === 'timer')}>
                <div style={styles.timerDisplayBox}>
                  <ScrollPicker max={24} value={hours} onChange={setHours} onUserScroll={handleUserInteracted} />
                  <span style={{ color: '#52525b', fontSize: '11px', marginLeft: '2px', marginRight: '6px', fontFamily: 'monospace' }}>h</span>
                  
                  <ScrollPicker max={59} value={minutes} onChange={setMinutes} onUserScroll={handleUserInteracted} />
                  <span style={{ color: '#52525b', fontSize: '11px', marginLeft: '2px', marginRight: '6px', fontFamily: 'monospace' }}>m</span>
                  
                  <ScrollPicker max={59} value={seconds} onChange={setSeconds} onUserScroll={handleUserInteracted} />
                  <span style={{ color: '#52525b', fontSize: '11px', marginLeft: '2px', fontFamily: 'monospace' }}>s</span>
                </div>
              </div>
            </div>
          </div>

          {/* UPDATE MAIN BUTTON */}
          <button style={styles.updateButton} onClick={handleUpdate}>
            UPDATE
          </button>

        </div>
      </div>
    </div>
  );
}
