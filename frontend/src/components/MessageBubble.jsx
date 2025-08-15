import React, { useEffect, useRef, useState } from 'react'

export default function MessageBubble({ who, text }) {
    const isCaller = who === 'Caller'
    const [displayedText, setDisplayedText] = useState('')
    const indexRef = useRef(0)

    // Typing animation for text
    useEffect(() => {
        setDisplayedText('')
        indexRef.current = 0
        if (!text) return
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text[indexRef.current])
            indexRef.current += 1
            if (indexRef.current >= text.length) clearInterval(interval)
        }, 12) // Adjust speed here
        return () => clearInterval(interval)
    }, [text])

    // Fade-in and slide-up animation
    const bubbleRef = useRef(null)
    useEffect(() => {
        if (bubbleRef.current) {
            bubbleRef.current.style.opacity = 0
            bubbleRef.current.style.transform = 'translateY(20px)'
            setTimeout(() => {
                bubbleRef.current.style.transition = 'opacity 0.4s, transform 0.4s'
                bubbleRef.current.style.opacity = 1
                bubbleRef.current.style.transform = 'translateY(0)'
            }, 10)
        }
    }, [])

    return (
        <div
            ref={bubbleRef}
            className={`flex ${isCaller ? 'justify-start' : 'justify-end'} my-1`}
            style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
            <div className={`${isCaller ? 'bg-white border' : 'bg-indigo-600 text-white'} p-3 rounded-lg max-w-[80%]`}>
                <div className="text-xs opacity-70 mb-1">{who}</div>
                <div className="text-sm break-words">{displayedText}</div>
            </div>
        </div>
    )
}