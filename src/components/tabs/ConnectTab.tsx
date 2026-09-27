import React, { useState } from 'react';
import { Search, UserPlus, MessageSquare, Check, Share2, Send, Eye, X, BookOpen, ExternalLink } from 'lucide-react';
import { ChatMessage, DocumentItem, FriendItem } from '../../types';
import { ScribeSyncHeader } from '../ScribeSyncHeader';

interface ConnectTabProps {
  friends: FriendItem[];
  userNotes: DocumentItem[];
  onAddFriend: (friendId: string) => void;
  onOpenNoteReadOnly: (doc: DocumentItem) => void;
}

export const ConnectTab: React.FC<ConnectTabProps> = ({
  friends,
  userNotes,
  onAddFriend,
  onOpenNoteReadOnly
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'people' | 'myFriends'>('people');
  const [chattingWith, setChattingWith] = useState<FriendItem | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    'friend-raju': [
      { id: '1', sender: 'friend', text: 'Hey Alex! Did you check the Green’s theorem problem set?', time: '10:15 AM' },
      { id: '2', sender: 'me', text: 'Yes, just reviewed it! Sending over my handwritten notes.', time: '10:16 AM' }
    ],
    'friend-keerthi': [
      { id: '1', sender: 'friend', text: 'Hey Alex, do you have notes on 2D Convolution for CNNs?', time: 'Yesterday' }
    ]
  });
  const [inputMessage, setInputMessage] = useState('');
  const [inspectingFriendNotes, setInspectingFriendNotes] = useState<FriendItem | null>(null);
  const [inviteToast, setInviteToast] = useState<string | null>(null);

  // Search filtering
  const q = searchQuery.toLowerCase().trim();
  const peopleYouMayKnow = friends.filter((f) => !f.isAdded && (!q || f.name.toLowerCase().includes(q)));
  const myFriendsList = friends.filter((f) => f.isAdded && (!q || f.name.toLowerCase().includes(q)));

  const showToast = (msg: string) => {
    setInviteToast(msg);
    setTimeout(() => setInviteToast(null), 2500);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !chattingWith) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => ({
      ...prev,
      [chattingWith.id]: [...(prev[chattingWith.id] || []), newMsg]
    }));
    setInputMessage('');

    // Simulated friendly peer response after a brief moment
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'friend',
        text: `Got it! Thanks Alex, studying your notes now. Let's solve the practice quiz together!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => ({
        ...prev,
        [chattingWith.id]: [...(prev[chattingWith.id] || []), replyMsg]
      }));
    }, 1200);
  };

  const handleShareNoteInChat = (doc: DocumentItem) => {
    if (!chattingWith) return;
    const shareMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: `Shared note: "${doc.title}" (${doc.subject})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sharedDoc: { id: doc.id, title: doc.title, subject: doc.subject }
    };
    setChatMessages((prev) => ({
      ...prev,
      [chattingWith.id]: [...(prev[chattingWith.id] || []), shareMsg]
    }));
  };

  // Invite triggers
  const handleInviteWhatsApp = () => {
    const text = encodeURIComponent("Hey! Join me on ScribeSync to share read-only handwritten notes and study quizzes: https://scribesync.app");
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast('Opening WhatsApp to invite friends...');
  };

  const handleInviteInstagram = () => {
    const inviteLink = "https://scribesync.app/join/alex";
    navigator.clipboard?.writeText(inviteLink);
    showToast('Instagram invite link copied to clipboard!');
  };

  const handleInviteShareLink = async () => {
    const shareData = {
      title: 'ScribeSync Study Notes',
      text: 'Join my peer study group on ScribeSync and get read-only access to my notes!',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!');
      } catch {
        // Ignored if cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Invite link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-24 px-4 pt-3 select-none">
      {/* Top Header Logo */}
      <ScribeSyncHeader />

      {/* Search Bar matching Page 6: "Enter Name" */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter Name"
          className="w-full bg-white/90 text-slate-800 placeholder-slate-600 text-sm font-medium py-3 pl-4 pr-11 rounded-sm border-2 border-slate-700/80 shadow-xs focus:outline-none focus:border-slate-950"
        />
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-700">
          <Search className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Subheader & View Toggle matching Page 6 */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 pt-1">
        <span className="text-sm font-serif">
          {activeView === 'people' ? 'People you may know' : `My Friends (${myFriendsList.length})`}
        </span>

        {/* My Friends Toggle Link from Page 6 */}
        <button
          onClick={() => setActiveView(activeView === 'people' ? 'myFriends' : 'people')}
          className="text-xs font-bold text-slate-900 hover:text-black hover:underline cursor-pointer transition-colors"
        >
          {activeView === 'people' ? 'My Friends >' : '< Explore Peers'}
        </button>
      </div>

      {/* Toast Notification */}
      {inviteToast && (
        <div className="p-2.5 bg-slate-900 text-white text-xs font-medium rounded-xl text-center shadow-lg animate-in fade-in">
          {inviteToast}
        </div>
      )}

      {/* VIEW 1: PEOPLE YOU MAY KNOW MATCHING PAGE 6 */}
      {activeView === 'people' && (
        <div className="space-y-3">
          {peopleYouMayKnow.length === 0 ? (
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-300 text-center">
              <p className="text-xs text-slate-600">All suggested peers have been added to My Friends.</p>
            </div>
          ) : (
            peopleYouMayKnow.map((person) => (
              <div
                key={person.id}
                className="p-3.5 rounded-sm bg-white/95 border-2 border-slate-700/80 shadow-xs flex items-center justify-between"
              >
                {/* Avatar & Name */}
                <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-12 h-12 rounded-full border-2 border-slate-700 bg-amber-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {person.name}
                    </h4>
                    <p className="text-[10px] text-slate-600 font-mono truncate">
                      {person.college}
                    </p>
                  </div>
                </div>

                {/* Action Buttons matching Page 6: Add friend & Chat */}
                <div className="flex items-center space-x-3 shrink-0">
                  {/* Add Friend Button */}
                  <button
                    onClick={() => {
                      onAddFriend(person.id);
                      showToast(`Added ${person.name} to My Friends!`);
                    }}
                    className="flex flex-col items-center justify-center text-slate-800 hover:text-black cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full border border-slate-400 bg-slate-100 flex items-center justify-center group-hover:bg-slate-200">
                      <UserPlus className="w-4 h-4 text-slate-700" />
                    </div>
                    <span className="text-[9px] font-semibold mt-0.5">Add friend</span>
                  </button>

                  {/* Chat Button */}
                  <button
                    onClick={() => setChattingWith(person)}
                    className="flex flex-col items-center justify-center text-slate-800 hover:text-black cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-black">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-semibold mt-0.5">Chat</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW 2: MY FRIENDS (WITH READ-ONLY NOTE ACCESS & CHAT) */}
      {activeView === 'myFriends' && (
        <div className="space-y-3">
          {myFriendsList.length === 0 ? (
            <div className="p-6 bg-white/80 rounded-2xl border border-slate-300 text-center">
              <p className="text-xs font-bold text-slate-800">No friends added yet</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Explore "People you may know" or invite your classmates via WhatsApp.
              </p>
            </div>
          ) : (
            myFriendsList.map((friend) => (
              <div
                key={friend.id}
                className="p-3.5 rounded-sm bg-white/95 border-2 border-slate-700/80 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                  <img
                    src={friend.avatarUrl}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full border-2 border-slate-700 bg-emerald-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {friend.name}
                    </h4>
                    <p className="text-[10px] text-slate-600 font-mono truncate">
                      {friend.notes.length} shared notes available
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {/* Seek/Read Notes Button */}
                  <button
                    onClick={() => setInspectingFriendNotes(friend)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold border border-slate-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-700" />
                    <span>Seek Notes</span>
                  </button>

                  {/* Chat Button */}
                  <button
                    onClick={() => setChattingWith(friend)}
                    className="p-2 rounded-xl bg-slate-900 text-white hover:bg-black cursor-pointer"
                    title="Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* BOTTOM SECTION: INVITE FRIENDS MATCHING PAGE 6 */}
      <div className="pt-4 border-t border-slate-300/80 flex items-center justify-between select-none">
        <span className="text-xs font-bold text-slate-800 font-serif">
          Invite Friends
        </span>

        {/* 3 Action Buttons from Page 6: WhatsApp, Instagram, Share Link */}
        <div className="flex items-center space-x-3">
          {/* WhatsApp Button */}
          <button
            onClick={handleInviteWhatsApp}
            className="w-9 h-9 rounded-full bg-[#25D366] hover:opacity-90 active:scale-95 text-white flex items-center justify-center shadow-md cursor-pointer transition-all"
            title="Invite via WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
          </button>

          {/* Instagram Button */}
          <button
            onClick={handleInviteInstagram}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 active:scale-95 text-white flex items-center justify-center shadow-md cursor-pointer transition-all"
            title="Invite via Instagram"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </button>

          {/* Share Link Button */}
          <button
            onClick={handleInviteShareLink}
            className="w-9 h-9 rounded-full bg-[#5b21b6] hover:opacity-90 active:scale-95 text-white flex items-center justify-center shadow-md cursor-pointer transition-all"
            title="Share Invite Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CHAT MODAL WITH FRIEND */}
      {chattingWith && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-4 text-slate-900 shadow-2xl flex flex-col h-[520px] max-h-[90vh]">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2.5">
                <img
                  src={chattingWith.avatarUrl}
                  alt={chattingWith.name}
                  className="w-9 h-9 rounded-full border border-slate-400 bg-slate-100"
                />
                <div>
                  <h3 className="text-sm font-bold leading-tight">{chattingWith.name}</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Studying online</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setChattingWith(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:text-black flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
              {(chatMessages[chattingWith.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2.5 rounded-2xl text-xs ${
                      msg.sender === 'me'
                        ? 'bg-slate-900 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Note Share Bar */}
            <div className="py-2 border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-500 shrink-0">Send Note:</span>
              {userNotes.slice(0, 3).map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleShareNoteInChat(doc)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 hover:bg-slate-200 truncate max-w-[130px] shrink-0"
                >
                  + {doc.title}
                </button>
              ))}
            </div>

            {/* Message Input */}
            <div className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type study message or question..."
                className="flex-1 px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
              />
              <button
                onClick={handleSendMessage}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-black text-white flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* READ-ONLY FRIEND NOTES BROWSER ("SEEK NOTES") */}
      {inspectingFriendNotes && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 text-slate-900 shadow-2xl space-y-4 border border-slate-300 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Read-Only Notes Library
                </span>
                <h3 className="text-sm font-bold">{inspectingFriendNotes.name}’s Shared Notes</h3>
              </div>
              <button
                onClick={() => setInspectingFriendNotes(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:text-black flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You have read-only access to view and study {inspectingFriendNotes.name}’s notes.
            </p>

            <div className="space-y-2">
              {inspectingFriendNotes.notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setInspectingFriendNotes(null);
                    onOpenNoteReadOnly(note);
                  }}
                  className="p-3 rounded-xl border-2 border-slate-200 hover:border-slate-900 bg-slate-50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{note.title}</h4>
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">{note.subject} · {note.date}</p>
                  </div>
                  <span className="text-xs font-bold text-[#3aa6c8] shrink-0">Read &gt;</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setInspectingFriendNotes(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
