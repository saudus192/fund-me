"use client"
import React from 'react'

// Fades/slides its children in once, when they scroll into view.
// Needs the .fm-reveal / .fm-reveal-in styles defined in the Home page.
const Reveal = ({ children, delay = 0, className = '' }) => {
    const ref = React.useRef(null)
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
        const el = ref.current
        if (!el) return
        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true)
            return
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.15 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className={`fm-reveal ${visible ? 'fm-reveal-in' : ''} ${className}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    )
}

export default Reveal