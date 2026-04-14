import { useState, useRef, type ChangeEvent } from "react";
import { X, Camera } from "lucide-react";
import type { ProfileUser } from "@/data/profile-data";
import { updateProfile, fileToBase64 } from "@/lib/profileApi";
import { updateStoredUser } from "@/lib/auth";
import MainButton from "@/components/ui/MainButton";
import UnderlineField from "@/components/ui/UnderlineField";
import { DEFAULT_PROFILE_AVATAR_URL } from "@/data/profile-data";

interface ProfileEditModalProps {
  user: ProfileUser;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProfileEditModal({ user, onClose, onSaved }: ProfileEditModalProps) {
  const [displayName, setDisplayName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar || DEFAULT_PROFILE_AVATAR_URL
  );
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
        className="relative w-full max-w-xl border border-spora-primary bg-spora-primary-light p-6 font-supply-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 id="profile-edit-title" className="font-bold text-sm uppercase shrink-0">
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-black/5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="relative group focus:ring-2 focus:ring-spora-primary focus:ring-offset-2"
              >
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-24 h-24 object-cover border border-spora-primary aspect-square"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
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

            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <UnderlineField
                label="Name"
                id="displayName"
                value={displayName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                placeholder="e.g. Dawn"
                maxLength={100}
              />
              <div className="sm:col-span-2 sm:col-start-1">
                <UnderlineField
                  label="Bio"
                  id="bio"
                  as="textarea"
                  value={bio}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                  placeholder="e.g. Tell us about yourself..."
                  maxLength={500}
                  minRows={3}
                />
                <p className="text-[10px] opacity-70 mt-0.5">{bio.length}/500</p>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-rose-500 text-xs uppercase">{error}</p>
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
