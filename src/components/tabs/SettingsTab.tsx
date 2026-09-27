import React, { useState } from 'react';
import { User, Shield, HardDrive, Edit3, Check, X, Camera, Moon, Sun, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { CloudStorageInfo, DocumentItem, FolderItem, PhysicalNoteItem, PrivacySettings, UnsyncedScan, UserProfile } from '../../types';
import { ScribeSyncHeader, ScribeSyncLogo } from '../ScribeSyncHeader';
import { ManageStorageModal } from '../ManageStorageModal';

interface SettingsTabProps {
  profile: UserProfile;
  privacy: PrivacySettings;
  storage: CloudStorageInfo;
  documents: DocumentItem[];
  folders: FolderItem[];
  physicalNotes: PhysicalNoteItem[];
  unsyncedScans: UnsyncedScan[];
  theme: 'light' | 'dark';
  onToggleTheme: (newTheme: 'light' | 'dark') => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onUpdatePrivacy: (updated: PrivacySettings) => void;
  onDeleteDocument: (docId: string) => void;
  onDeletePhysicalNote: (noteId: string) => void;
  onDeleteUnsyncedScan: (scanId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onOptimizeStorage: () => void;
  onReplaySplash?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  profile,
  privacy,
  storage,
  documents,
  folders,
  physicalNotes,
  unsyncedScans,
  theme,
  onToggleTheme,
  onUpdateProfile,
  onUpdatePrivacy,
  onDeleteDocument,
  onDeletePhysicalNote,
  onDeleteUnsyncedScan,
  onDeleteFolder,
  onOptimizeStorage,
  onReplaySplash
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editCollege, setEditCollege] = useState(profile.college);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isManageStorageOpen, setIsManageStorageOpen] = useState(false);
  const [hasCustomLogo, setHasCustomLogo] = useState(() => Boolean(localStorage.getItem('scribesync_custom_logo')));

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: editName.trim() || profile.name,
      college: editCollege.trim() || profile.college,
      avatarUrl: editAvatar
    });
    setIsEditingProfile(false);
    showToast('Profile updated successfully!');
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          localStorage.setItem('scribesync_custom_logo', dataUrl);
          setHasCustomLogo(true);
          window.dispatchEvent(new Event('scribesync_logo_changed'));
          showToast('App Logo updated successfully across all views!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    localStorage.removeItem('scribesync_custom_logo');
    setHasCustomLogo(false);
    window.dispatchEvent(new Event('scribesync_logo_changed'));
    showToast('Reset to default ScribeSync vector logo.');
  };

  const physicalPercent = Math.round((storage.physicalGB / storage.totalGB) * 100);
  const digitalPercent = Math.round((storage.digitalGB / storage.totalGB) * 100);

  return (
    <div className="flex flex-col space-y-4 pb-24 px-4 pt-3 select-none">
      {/* Top Header Logo */}
      <ScribeSyncHeader />

      {/* Title & Subtitle matching Page 7 */}
      <div className="pt-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
          App Settings
        </h2>
        <p className="text-xs text-slate-600 font-medium italic mt-0.5">
          Profile, privacy toggles, theme &amp; cloud storage
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-2.5 bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-bold rounded-xl animate-in fade-in flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* SECTION 1: THEME & DISPLAY (DARK THEME / LIGHT THEME AS REQUESTED) */}
      <div className="p-4 rounded-2xl bg-white/95 border-2 border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Appearance &amp; Grid Paper Theme</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {theme === 'dark' ? 'Black Grid Paper' : 'White Grid Paper'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Light Mode Button */}
          <button
            type="button"
            onClick={() => onToggleTheme('light')}
            className={`p-3 rounded-xl border-2 flex items-center space-x-2.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-slate-900 bg-emerald-50 ring-2 ring-slate-900/10 shadow-xs'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 opacity-70'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-[#edf4f1] border border-slate-300 flex items-center justify-center text-amber-600 shrink-0">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-900">Light Paper</h4>
              <p className="text-[10px] text-slate-500">White grid paper</p>
            </div>
          </button>

          {/* Dark Mode Button */}
          <button
            type="button"
            onClick={() => onToggleTheme('dark')}
            className={`p-3 rounded-xl border-2 flex items-center space-x-2.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-slate-900 bg-slate-900 text-white ring-2 ring-slate-900/10 shadow-xs'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 opacity-70'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-[#0d121c] border border-slate-600 flex items-center justify-center text-indigo-400 shrink-0">
              <Moon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dark Paper</h4>
              <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>Black grid paper</p>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 2: APP LOGO / BRANDING AS REQUESTED */}
      <div className="p-4 rounded-2xl bg-white/95 border-2 border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-slate-800" />
            <span>App Logo &amp; Branding</span>
          </div>
          {onReplaySplash && (
            <button
              onClick={onReplaySplash}
              className="text-[11px] font-bold text-slate-700 hover:text-black underline cursor-pointer"
            >
              Replay Intro (7s)
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-3">
            <ScribeSyncLogo size={50} />
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {hasCustomLogo ? 'Custom Uploaded Logo' : 'ScribeSync Vector Emblem'}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                {hasCustomLogo ? 'Active on all tabs and headers' : 'Stylized dual-curve pen sync badge'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Logo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>

            {hasCustomLogo && (
              <button
                type="button"
                onClick={handleResetLogo}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                title="Reset to default logo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: STUDENT PROFILE MATCHING PAGE 7 */}
      <div className="p-4 rounded-2xl bg-white/95 border-2 border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
            <User className="w-4 h-4 text-slate-800" />
            <span>Student Profile</span>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center space-x-1 text-xs font-bold text-slate-800 hover:text-black cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {!isEditingProfile ? (
          <div className="flex items-center space-x-3.5 pt-1">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-14 h-14 rounded-full border-2 border-slate-700 bg-sky-50 object-cover shadow-xs"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {profile.name}
              </h3>
              <p className="text-xs text-slate-700 font-medium">
                {profile.college}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={editAvatar}
                  alt="avatar"
                  className="w-14 h-14 rounded-full border-2 border-slate-700 bg-sky-50 object-cover"
                />
                <label className="absolute -bottom-1 -right-1 p-1 bg-slate-900 text-white rounded-full cursor-pointer hover:bg-black">
                  <Camera className="w-3 h-3" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                </label>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Tap camera icon to change profile picture
              </span>
            </div>

            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-700 font-bold block mb-1">
                College / University
              </label>
              <input
                type="text"
                value={editCollege}
                onChange={(e) => setEditCollege(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl"
            >
              Save Profile
            </button>
          </form>
        )}
      </div>

      {/* SECTION 4: DATA PRIVACY & SECURITY WITH RED/GREEN TOGGLES AS EXPLICITLY REQUESTED */}
      <div className="p-4 rounded-2xl bg-white/95 border-2 border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
          <Shield className="w-4 h-4 text-slate-800" />
          <span>Data privacy &amp; security</span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Toggle 1: Biometric Lock */}
          {/* USER SPECIFICATION: If off -> red color (#ef4444 / bg-rose-500). If on -> green color (#10b981 / bg-emerald-500) */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Biometric Lock (Face Lock / Fingerprint)
              </span>
              <span className={`text-[10px] font-bold ${privacy.biometricLock ? 'text-emerald-600' : 'text-rose-600'}`}>
                {privacy.biometricLock ? '● ON (Protected)' : '○ OFF (Disabled)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePrivacy({ ...privacy, biometricLock: !privacy.biometricLock })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                privacy.biometricLock ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              title={privacy.biometricLock ? 'Toggle Off' : 'Toggle On'}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform duration-200 ${
                  privacy.biometricLock ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: End to End Encryption */}
          {/* USER SPECIFICATION: If off -> red color. If on -> green color */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                End to End Encryption
              </span>
              <span className={`text-[10px] font-bold ${privacy.endToEndEncryption ? 'text-emerald-600' : 'text-rose-600'}`}>
                {privacy.endToEndEncryption ? '● ON (Encrypted)' : '○ OFF (Disabled)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePrivacy({ ...privacy, endToEndEncryption: !privacy.endToEndEncryption })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                privacy.endToEndEncryption ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              title={privacy.endToEndEncryption ? 'Toggle Off' : 'Toggle On'}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform duration-200 ${
                  privacy.endToEndEncryption ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 5: SCRIBESYNC CLOUD STORAGE WITH WORKING MANAGE STORAGE AS REQUESTED */}
      <div className="p-4 rounded-2xl bg-white/95 border-2 border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
            {/* Outline Server / Hard Drive Icon */}
            <div className="w-8 h-6 border-2 border-slate-800 rounded-sm flex flex-col justify-between p-0.5">
              <div className="flex items-center justify-between px-0.5">
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <div className="w-1 h-1 rounded-full bg-slate-800" />
              </div>
              <div className="h-0.5 w-full bg-slate-800 rounded-full" />
            </div>
            <span className="font-serif text-sm">ScribeSync Cloud storage</span>
          </div>

          <span className="text-xs font-bold font-mono text-slate-800">
            {storage.usedGB} GB / {storage.totalGB} GB
          </span>
        </div>

        {/* Two-Tone Progress Bar from Page 7 */}
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-[#36b37e]"
            style={{ width: `${physicalPercent}%` }}
            title="Physical Notes"
          />
          <div
            className="h-full bg-[#4355a4]"
            style={{ width: `${digitalPercent}%` }}
            title="Digital Notes"
          />
        </div>

        {/* Legend matching Page 7 */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#36b37e]" />
              <span className="text-slate-700 font-medium">Physical notes</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4355a4]" />
              <span className="text-slate-700 font-medium">Digital notes</span>
            </div>
          </div>

          {/* Manage Storage Button - Opens interactive deletion & cleanup modal */}
          <button
            type="button"
            onClick={() => setIsManageStorageOpen(true)}
            className="text-xs font-serif font-bold italic text-slate-900 hover:underline cursor-pointer px-2 py-1 rounded-md hover:bg-slate-100"
          >
            Manage Storage &gt;
          </button>
        </div>
      </div>

      {/* MANAGE STORAGE MODAL */}
      <ManageStorageModal
        isOpen={isManageStorageOpen}
        onClose={() => setIsManageStorageOpen(false)}
        storage={storage}
        documents={documents}
        folders={folders}
        physicalNotes={physicalNotes}
        unsyncedScans={unsyncedScans}
        onDeleteDocument={onDeleteDocument}
        onDeletePhysicalNote={onDeletePhysicalNote}
        onDeleteUnsyncedScan={onDeleteUnsyncedScan}
        onDeleteFolder={onDeleteFolder}
        onOptimizeStorage={onOptimizeStorage}
      />
    </div>
  );
};
