import React from 'react'
import ScamMeter from './components/ScamMeter.jsx'
import MessageBubble from './components/MessageBubble.jsx'
import useCallManager from './hooks/useCallManager.js'

export default function App({ user, onLogout }) {
  const {
    recognitionReady,
    recognizing,
    messages,
    currentSpeakerState,
    callActive,
    scamLevel,
    suggestedReply,
    error,
    transcriptRef,
    handleStartStop,
    handleEndCall,
    handleCopyReply
  } = useCallManager(user)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f7971e 100%)',
        transition: 'background 0.5s'
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">ScamSevak</h1>
              <p className="text-sm text-gray-500">Real-time conversation security assistant</p>
              {user?.guest && (
                <div className="mt-2 px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold inline-block">
                  Guest Mode: Overviews will not be saved.
                </div>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={handleStartStop}
                className={`px-4 py-2 rounded-md text-white ${callActive ? 'bg-red-500' : 'bg-green-600'}`}>
                {callActive ? 'End Call' : 'Start Call'}
              </button>
              <button onClick={handleEndCall} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800">Reset</button>
              <button onClick={onLogout} className="px-4 py-2 rounded-md bg-yellow-400 text-black">Logout</button>
            </div>
          </header>

          <div
            className="flex-1 border-2 border-indigo-100 rounded-2xl p-4 md:p-8 overflow-auto bg-gradient-to-br from-indigo-50 via-white to-orange-50 shadow-xl mb-4 transition-all w-full"
            ref={transcriptRef}
            style={{
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
              minHeight: '320px',           // Increased for mobile
              maxHeight: '480px',           // Increased for desktop
              letterSpacing: '0.01em',
              lineHeight: '1.7',
              transition: 'background 0.5s'
            }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12 italic tracking-wide text-base md:text-lg select-none">
                No transcript yet. Click <span className="font-bold text-indigo-500">Start</span> to begin.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m, idx) => (
                  <MessageBubble key={idx} who={m.who} text={m.text} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enhanced Scam Confidence Card */}
            <div className="p-5 rounded-xl shadow bg-gradient-to-br from-indigo-50 via-white to-orange-50 border border-indigo-100 flex flex-col items-center">
              <h3 className="text-lg font-bold mb-2 text-indigo-700 tracking-wide flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-orange-400 to-indigo-500 rounded-full animate-pulse"></span>
                Scam Confidence
              </h3>
              <div className="w-full flex flex-col items-center">
                <ScamMeter level={scamLevel} />
                <div className="mt-3 text-base font-semibold text-orange-600 tracking-wide drop-shadow">
                  {scamLevel}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center italic">
                This score reflects the likelihood of a scam based on your conversation.
              </p>
            </div>

            {/* Suggested Reply Card (modified) */}
            <div className="p-5 rounded-xl shadow bg-gradient-to-br from-white via-indigo-50 to-orange-50 border border-indigo-100 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-orange-600 tracking-wide flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-indigo-400 to-orange-400 rounded-full animate-pulse"></span>
                  Suggested Reply
                </h3>
                <button
                  onClick={handleCopyReply}
                  className="text-xs px-3 py-1 rounded bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200 transition"
                >
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                value={suggestedReply}
                rows={4}
                className="w-full resize-none p-3 border border-orange-100 rounded-lg text-base bg-gradient-to-br from-orange-50 via-white to-indigo-50 font-mono text-gray-700 shadow-inner focus:outline-none"
                style={{ minHeight: '80px', letterSpacing: '0.01em' }}
              />
              <p className="mt-2 text-xs text-gray-500 italic text-center">
                Use this as a safe response if you feel unsure.
              </p>
            </div>
          </div>

          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>

        <aside className="md:col-span-1">
          <div className="p-4 border rounded-lg bg-white shadow-md sticky top-6">
            <h4 className="font-bold mb-4 text-lg text-indigo-700 tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              Session Info
            </h4>
            <dl className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <dt className="font-medium text-gray-700">Recognition</dt>
                <dd className={`font-semibold ${recognitionReady ? 'text-green-600' : 'text-yellow-600'}`}>
                  {recognitionReady ? 'Ready' : 'Initializing...'}
                </dd>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <dt className="font-medium text-gray-700">Listening</dt>
                <dd className={`font-semibold ${recognizing ? 'text-green-600' : 'text-gray-400'}`}>
                  {recognizing ? 'Yes' : 'No'}
                </dd>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <dt className="font-medium text-gray-700">Speaker</dt>
                <dd className="font-semibold text-indigo-600">{currentSpeakerState}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="font-medium text-gray-700">Conversation</dt>
                <dd className="font-semibold text-orange-500">{messages.length} messages</dd>
              </div>
            </dl>
            <div className="mt-6 text-xs text-gray-500">
              This UI sends the full conversation to your backend at
              <div className="break-all text-xs mt-1 font-mono text-indigo-500">{import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/classify</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}