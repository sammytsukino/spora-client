import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import type { ProfileUser } from "@/data/profile-data";
import { updateProfile, fileToBase64 } from "@/lib/profileApi";
import { updateStoredUser } from "@/lib/auth";
import MainButton from "@/components/ui/MainButton";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1768395876/Group_33_eu3kbv.svg";

interface ProfileEditModalProps {
  user: ProfileUser;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProfileEditModal({ user, onClose, onSaved }: ProfileEditModalProps) {
  const [displayName, setDisplayName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || DEFAULT_AVATAR);
  const [avatarData, setAvatarData] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const base64 = await fileToBase64(file);
      setAvatarData(base64);
      setAvatarPreview(base64);
    } catch {
      setError("Invalid image format");
    }
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        ...(avatarData ? { avatarData } : {}),
      });
      updateStoredUser({
        displayName: updated.displayName,
        avatar: updated.avatar,
        bio: updated.bio,
      });
      onSaved();
      onClose();
    } catch {
      setError("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-title"
    >
      <div
        className="relative w-full max-w-md border border-[var(--spora-primary)] bg-[#E9E9E9] p-6 font-supply-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="profile-edit-title" className="font-bold text-sm uppercase">
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative group rounded-full focus:ring-2 focus:ring-[#262626] focus:ring-offset-2"
            >
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border border-[var(--spora-primary)]"
              />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-[10px] uppercase opacity-70">
              Click to choose image
            </span>
          </div>

          <div>
            <label htmlFor="displayName" className="block text-[10px] uppercase mb-1">
              Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-[var(--spora-primary)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#262626]"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-[10px] uppercase mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border border-[var(--spora-primary)] bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#262626]"
              maxLength={500}
            />
            <p className="text-[10px] opacity-70 mt-0.5">{bio.length}/500</p>
          </div>

          {error && (
            <p className="text-red-600 text-xs uppercase">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <MainButton
              type="button"
              variant="compact"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </MainButton>
            <MainButton
              type="submit"
              variant="compact"
              size="sm"
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Saving…" : "Save"}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  );
}
