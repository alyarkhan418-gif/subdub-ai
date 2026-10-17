'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState('Urdu');
  const [voiceGender, setVoiceGender] = useState('Male');
  const [voiceTone, setVoiceTone] = useState('Natural');
  const [voiceSpeed, setVoiceSpeed] = useState('1.0');
  const [voiceMode, setVoiceMode] = useState('preset');
  const [clonedVoiceFile, setClonedVoiceFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputResult, setOutputResult] = useState('');
  
  // Database / LocalStorage History
  const [dubHistory, setDubHistory] = useState([]);
  
  // Authentication States
  const [authModal, setAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('subdub_history');
    if (savedHistory) {
      setDubHistory(JSON.parse(savedHistory));
    }
    const savedUser = localStorage.getItem('subdub_user');
    if (savedUser) {
      setIsLoggedIn(true);
      setUserEmail(savedUser);
    }
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDubbing = () => {
    if (uploadedFiles.length === 0 && !inputText) {
      alert('براہ کرم کوئی ویڈیو فائل اپ لوڈ کریں یا متن/لنک درج کریں!');
      return;
    }
    if (voiceMode === 'clone' && !clonedVoiceFile) {
      alert('براہ کرم اپنی آواز کلون کرنے کے لیے آڈیو فائل اپ لوڈ کریں!');
      return;
    }

    setIsProcessing(true);
    setOutputResult('');
    setTimeout(() => {
      setIsProcessing(false);
      const fileSummary = uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s)` : `Text content`;
      const voiceSource = voiceMode === 'clone' ? `Custom Voice (${clonedVoiceFile?.name})` : `${voiceGender}, ${voiceTone}`;
      const resText = `Successfully dubbed ${fileSummary} into ${selectedLanguage} using ${voiceSource}!`;
      setOutputResult(resText);
      
      const newEntry = { 
        id: Date.now(), 
        text: uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(', ') : inputText, 
        lang: selectedLanguage, 
        settings: `${voiceSource} | ${voiceSpeed}x`,
        time: new Date().toLocaleTimeString() 
      };
      
      const updatedHistory = [newEntry, ...dubHistory];
      setDubHistory(updatedHistory);
      localStorage.setItem('subdub_history', JSON.stringify(updatedHistory));
      setInputText('');
      setUploadedFiles([]);
      setClonedVoiceFile(null);
    }, 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (userEmail) {
      setIsLoggedIn(true);
      localStorage.setItem('subdub_user', userEmail);
      setAuthModal(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('subdub_user');
  };

  const clearHistory = () => {
    setDubHistory([]);
    localStorage.removeItem('subdub_history');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center max-w-5xl mx-auto w-full">
        <h1 className="text-xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">SubDub AI</h1>
        <nav className="hidden md:flex gap-6 text-sm text-slate-300">
          <a href="#studio" className="hover:text-indigo-400 transition">Studio</a>
          <a href="#history" className="hover:text-indigo-400 transition">History</a>
          <a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400 hidden sm:block">Support: <a href="mailto:info.salman08@gmail.com" className="text-indigo-400 hover:underline">info.salman08@gmail.com</a></div>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full">{userEmail}</span>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white px-2 py-1">Logout</button>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModal(true)} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-indigo-500/20"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* Hero & Studio */}
      <div className="max-w-3xl mx-auto px-6 py-10 flex-grow w-full">
        <div className="text-center mb-10">
          <span className="inline-block mb-3 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">AI Video & Audio Dubbing Studio</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">Translate & Dub in <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Regional Languages</span></h2>
          <p className="text-slate-400 text-sm">Try for free! Upload videos or use AI voice cloning to start instantly.</p>
        </div>

        {/* Studio Box */}
        <div id="studio" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-10 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">Target Language</label>
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Urdu">Urdu (اردو)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Arabic">Arabic (العربية)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="English">English</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Chinese">Chinese (中文)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">AI Engine</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-emerald-400 flex justify-between items-center">
                <span>Gemini Pro Core</span>
                <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Multiple File & Video Upload Drag & Drop Box */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400 uppercase">Upload Video / Audio Files (Drag & Drop)</label>
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-slate-950/60 rounded-xl p-5 text-center cursor-pointer relative transition"
            >
              <input 
                type="file" 
                multiple 
                accept="video/*,audio/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="text-xl">📁</div>
                <div className="text-xs font-semibold text-indigo-400">Drag & drop video/audio files here, or click to browse</div>
                <div className="text-[10px] text-slate-500">Supports MP4, MOV, MP3, WAV (Multiple files allowed)</div>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Selected Files ({uploadedFiles.length}):</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-900 px-3 py-1.5 rounded-lg text-xs">
                      <span className="text-slate-300 truncate max-w-[260px]">{file.name}</span>
                      <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-300 font-bold ml-2">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Voice Selection & Custom Cloning Mode */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Voice Customization & Cloning</span>
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 gap-1">
                <button 
                  onClick={() => setVoiceMode('preset')} 
                  className={`text-xs px-3 py-1 rounded-md transition ${voiceMode === 'preset' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  AI Presets
                </button>
                <button 
                  onClick={() => setVoiceMode('clone')} 
                  className={`text-xs px-3 py-1 rounded-md transition ${voiceMode === 'clone' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  🎙️ Voice Cloning
                </button>
              </div>
            </div>

            {voiceMode === 'preset' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Gender</label>
                  <select value={voiceGender} onChange={(e) => setVoiceGender(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200">
                    <option value="Male">Male Voice</option>
                    <option value="Female">Female Voice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tone</label>
                  <select value={voiceTone} onChange={(e) => setVoiceTone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200">
                    <option value="Natural">Natural</option>
                    <option value="Professional">Professional</option>
                    <option value="Dramatic">Dramatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Speed ({voiceSpeed}x)</label>
                  <input type="range" min="0.75" max="1.5" step="0.05" value={voiceSpeed} onChange={(e) => setVoiceSpeed(e.target.value)} className="w-full accent-indigo-500 cursor-pointer mt-1.5" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">Upload Voice Sample (.mp3, .wav for cloning)</label>
                <div className="border border-indigo-500/30 bg-slate-900/50 rounded-xl p-3 text-center cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={(e) => setClonedVoiceFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {clonedVoiceFile ? (
                    <span className="text-xs text-emerald-400 font-semibold">✓ {clonedVoiceFile.name}</span>
                  ) : (
                    <span className="text-xs text-indigo-400">Click to upload voice sample for cloning</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">Or Paste Script / YouTube Link</label>
            <textarea 
              rows="2" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste text or video link here..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button 
            onClick={handleDubbing}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl text-sm shadow-lg transition disabled:opacity-50"
          >
            {isProcessing ? 'Processing AI Dubbing...' : 'Start 1-Click Dubbing Studio'}
          </button>

          {outputResult && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex justify-between items-center">
              <span>{outputResult}</span>
              <button onClick={() => alert('Downloading file...')} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-white font-semibold">Download</button>
            </div>
          )}
        </div>

        {/* Database History Section */}
        {dubHistory.length > 0 && (
          <div id="history" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-200">Dubbing History (Saved in DB)</h3>
              <button onClick={clearHistory} className="text-xs text-red-400 hover:underline">Clear History</button>
            </div>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {dubHistory.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-medium text-slate-300">{item.text}</p>
                    <span className="text-[10px] text-indigo-400">Lang: {item.lang} | Settings: {item.settings} | {item.time}</span>
                  </div>
                  <button onClick={() => alert(`Downloading: ${item.text}`)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700">Download</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Section with FREE Plan */}
        <div id="pricing" className="mb-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Simple & Transparent Pricing</h3>
            <p className="text-slate-400 text-xs">Start for free, scale as your content grows.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {/* Free Plan */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Free Tier</span>
                <h4 className="font-bold text-sm text-white mt-2 mb-1">Free Starter</h4>
                <div className="text-2xl font-extrabold mb-3">$0<span className="text-xs text-slate-400">/mo</span></div>
                <ul className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <li>✓ 5 Minutes Dubbing</li>
                  <li>✓ Basic AI Voices</li>
                  <li>✓ Short Videos Support</li>
                </ul>
              </div>
              <button onClick={() => alert('Free plan activated!')} className="w-full bg-slate-800 hover:bg-slate-700 text-xs py-2 rounded-xl">Get Started Free</button>
            </div>

            {/* Starter Plan */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Creator</h4>
                <div className="text-2xl font-extrabold mb-3">$9<span className="text-xs text-slate-400">/mo</span></div>
                <ul className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <li>✓ 60 Mins Dubbing</li>
                  <li>✓ Urdu & Hindi</li>
                  <li>✓ Standard Voices</li>
                </ul>
              </div>
              <button onClick={() => alert('Selected Creator Plan')} className="w-full bg-slate-800 hover:bg-slate-700 text-xs py-2 rounded-xl">Choose Plan</button>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 border-2 border-indigo-500 p-5 rounded-2xl flex flex-col justify-between relative shadow-lg">
              <span className="absolute -top-2.5 right-4 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Popular</span>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Pro Studio</h4>
                <div className="text-2xl font-extrabold mb-3">$29<span className="text-xs text-slate-400">/mo</span></div>
                <ul className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <li>✓ 300 Mins Dubbing</li>
                  <li>✓ All Languages</li>
                  <li>✓ Voice Cloning & Tuning</li>
                </ul>
              </div>
              <button onClick={() => alert('Selected Pro Plan')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs py-2 rounded-xl">Choose Plan</button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Enterprise</h4>
                <div className="text-2xl font-extrabold mb-3">$99<span className="text-xs text-slate-400">/mo</span></div>
                <ul className="text-xs text-slate-300 space-y-1.5 mb-4">
                  <li>✓ Unlimited Minutes</li>
                  <li>✓ Custom API Access</li>
                </ul>
              </div>
              <button onClick={() => alert('Selected Enterprise')} className="w-full bg-slate-800 hover:bg-slate-700 text-xs py-2 rounded-xl">Contact Sales</button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold mb-2">Welcome to SubDub AI</h3>
            <p className="text-xs text-slate-400 mb-6">Sign in or create an account to manage your studio access.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@domain.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm shadow-lg transition">
                Continue to Studio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-4 px-6 text-center text-xs text-slate-500">
        <p>&copy; 2026 SubDub AI. Support: <a href="mailto:info.salman08@gmail.com" className="text-indigo-400 hover:underline">info.salman08@gmail.com</a></p>
      </footer>
    </main>
  );
}
