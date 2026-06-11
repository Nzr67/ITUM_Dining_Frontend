"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { X, Loader2, Clock, User as UserIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface HistoryEntry {
  id: string
  reported_status: string
  ready_in_minutes: number | null
  rep_snapshot: number
  created_at: string
  was_correct: boolean | null
  profiles: {
    full_name: string
  }
  menu_items?: {
    canteen: string
  }
}

interface ItemHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: string
    name: string
  }
}

export function ItemHistoryModal({ isOpen, onClose, item }: ItemHistoryModalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const loadHistory = async () => {
        setLoading(true)
        try {
          const response = await fetch(`http://localhost:8000/api/items/${item.id}/history`)
          if (response.ok) {
            const data = await response.json()
            setHistory(data)
          }
        } catch (error) {
          console.error('Failed to load history:', error)
        } finally {
          setLoading(false)
        }
      }
      loadHistory()
    }
  }, [isOpen, item.id])

  if (!isOpen) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 dark:text-green-400'
      case 'unavailable': return 'text-red-600 dark:text-red-400'
      case 'coming_soon': return 'text-blue-600 dark:text-blue-400'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-1">Update History</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {item.name}
          {history.length > 0 && history[0].menu_items?.canteen && (
            <span className="ml-1 text-[10px] uppercase font-bold text-primary/70">
              • {history[0].menu_items.canteen}
            </span>
          )}
        </p>

        <div className="flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No reports yet for this item.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="p-3 border border-border rounded-lg bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-xs font-medium">{entry.profiles?.full_name || 'Anonymous'}</span>
                      <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                        Rep: {entry.rep_snapshot.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      Reported <span className={cn(getStatusColor(entry.reported_status))}>
                        {entry.reported_status.replace('_', ' ')}
                      </span>
                      {entry.ready_in_minutes && ` (in ${entry.ready_in_minutes}m)`}
                    </div>
                    {entry.was_correct !== null && (
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                        entry.was_correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {entry.was_correct ? "Accurate" : "Incorrect"}
                      </span>
                    )}
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
