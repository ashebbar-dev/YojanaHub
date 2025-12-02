// Simplified toast hook
import * as React from "react"

type ToastProps = {
    title?: string
    description?: string
}

type ToastState = {
    toasts: Array<ToastProps & { id: string }>
}

let toastId = 0
const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(state: ToastState) {
    memoryState = state
    listeners.forEach((listener) => listener(state))
}

export function toast({ title, description }: ToastProps) {
    const id = (toastId++).toString()
    const newToasts = [...memoryState.toasts, { id, title, description }]
    dispatch({ toasts: newToasts })

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        const filtered = memoryState.toasts.filter(t => t.id !== id)
        dispatch({ toasts: filtered })
    }, 3000)

    return { id, dismiss: () => { } }
}

export function useToast() {
    const [state, setState] = React.useState<ToastState>(memoryState)

    React.useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [])

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => {
            if (toastId) {
                const filtered = memoryState.toasts.filter(t => t.id !== toastId)
                dispatch({ toasts: filtered })
            }
        },
    }
}
