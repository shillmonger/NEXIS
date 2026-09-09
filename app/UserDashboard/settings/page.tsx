"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  Camera,
  User,
  Lock,
  Palette,
  Moon,
  Sun,
  Shield,
  ShieldOff,
  AlertCircle,
  Eye,
  Phone,
  EyeOff,
  Wallet,
  Mail,
  ChevronDown,
  Loader2,
  Globe,
  Clock,
  History,
  Bell,
  ViewIcon,
  Globe2,
  Monitor,
  ShieldCheck,
  Building2,
  Bitcoin,
} from "lucide-react";

// ─── Loading Skeleton Components ───────────────────────────────────────────
function IdentitySkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      </div>
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-2xl bg-muted animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-muted rounded-xl animate-pulse" />
        </div>
        <div className="h-5 w-24 bg-muted rounded animate-pulse mb-2" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

function AccountStatusSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
      <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalInfoSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>
        ))}
        <div className="md:col-span-2 pt-2">
          <div className="h-11 w-full bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}





export default function UserSettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    language: "en",
    timezone: "UTC",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Profile image
  const [profileImage, setProfileImage] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Image crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Privacy toggles
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [leaderboardVisibility, setLeaderboardVisibility] = useState(true);
  const [activityVisibility, setActivityVisibility] = useState(true);
  const [marketingPreferences, setMarketingPreferences] = useState(false);

  // Member since
  const [memberSince, setMemberSince] = useState("");
  // User role
  const [userRole, setUserRole] = useState<string[]>([]);

  // Load user profile data - UI only
  useEffect(() => {
    // Mock data for UI
    setPersonalInfo({
      username: "FUTUREX",
      name: "Future Trader",
      email: "future@nexis.io",
      phone: "+1 234 567 8900",
      country: "United States",
      language: "en",
      timezone: "UTC",
    });
    setProfileImage("https://github.com/shadcn.png");
    setUserRole(["ADMIN"]);
    setMemberSince("JUL 15, 2026, 10:30 AM");
    setIsLoading(false);
  }, []);



  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };



  // Profile image upload - show crop modal
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file as data URL for crop modal
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle cropped image upload - UI only
  const handleCroppedImageUpload = async (croppedBlob: Blob) => {
    setIsUploadingImage(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploadingImage(false);
      setSelectedImageSrc(null);
      toast.success('Profile image updated');
    }, 1000);
  };

  // Profile update - UI only
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setIsUpdating(false);
    }, 500);
  };

  // Password update - UI only
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsUpdatingPassword(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdatingPassword(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 py-5">
      <div className="max-w-5xl mx-auto space-y-8 md:p-10">

        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter  text-foreground">
            Profile & Settings
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
              Manage your identity and preferences
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-violet-600/50 via-violet-500/50 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-6 lg:sticky lg:top-4 lg:self-start">
                {/* Identity */}
                {isLoading ? (
                  <IdentitySkeleton />
                ) : (
                  <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                      <User className="w-4 h-4 text-violet-600" /> Identity
                    </h3>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-violet-600/30 bg-muted shadow-2xl">
                          <img 
                            src={profileImage || "https://github.com/shadcn.png"} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-violet-600 text-white p-2.5 rounded-xl cursor-pointer hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20">
                          {isUploadingImage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Camera className="w-5 h-5" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            disabled={isUploadingImage}
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-sm font-black uppercase text-violet-600">{personalInfo.username}</p>
                      <p className="text-[10px] text-violet-500 font-bold uppercase tracking-tight">Investor Account</p>
                    </div>
                  </div>
                )}

                {/* Account Status */}
                {isLoading ? (
                  <AccountStatusSkeleton />
                ) : (
                  <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative border-violet-500/10">
                    <div className="absolute -right-4 -top-4 opacity-5 text-violet-500">
                      <Shield className="w-24 h-24" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4">Account Status</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Role</span>
                        <span className="text-[10px] bg-violet-600/10 text-violet-600 px-2 py-0.5 rounded-full font-black uppercase border border-violet-600/20">
                          {userRole.join(", ").toUpperCase() || "USER"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Verification</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-black uppercase border border-emerald-500/20">Verified</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Member Since</span>
                        <span className="text-xs font-black">{memberSince || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 border-violet-500/10">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-violet-600" /> Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Dark Mode</p>
                    {mounted ? (
                      <button
                        onClick={toggleTheme}
                        className={`relative w-14 h-8 rounded-full cursor-pointer border border-border transition-colors ${theme === "dark" ? "bg-violet-600" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}>
                          {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-black" /> : <Sun className="w-3.5 h-3.5 text-yellow-500" />}
                        </div>
                      </button>
                    ) : (
                      <div className="relative w-14 h-8 rounded-full border border-border bg-muted">
                        <div className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center translate-x-1">
                          <Sun className="w-3.5 h-3.5 text-yellow-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                {isLoading ? (
                  <PersonalInfoSkeleton />
                ) : (
                  <form onSubmit={handleProfileUpdate} className="bg-card rounded-2xl shadow-lg border border-border p-6 border-violet-500/10">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                      <User className="w-4 h-4 text-violet-600" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                          <input
                            name="username"
                            type="text"
                            value={personalInfo.username}
                            onChange={handleInputChange}
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                          <input
                            name="name"
                            type="text"
                            value={personalInfo.name}
                            onChange={handleInputChange}
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                          <input
                            name="email"
                            type="email"
                            value={personalInfo.email}
                            readOnly
                            className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm cursor-not-allowed opacity-70"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                          <input
                            name="country"
                            type="text"
                            value={personalInfo.country}
                            onChange={handleInputChange}
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                          <input
                            name="phone"
                            type="tel"
                            value={personalInfo.phone}
                            onChange={handleInputChange}
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Language</label>
                        <div className="relative">
                          <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                          <select
                            name="language"
                            value={personalInfo.language}
                            onChange={(e) => handleInputChange(e as any)}
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none appearance-none cursor-pointer"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                            <option value="ja">Japanese</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timezone</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                          <select
                            name="timezone"
                            value={personalInfo.timezone}
                            onChange={(e) => handleInputChange(e as any)}
                            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none appearance-none cursor-pointer"
                          >
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="EST">EST (Eastern Standard Time)</option>
                            <option value="PST">PST (Pacific Standard Time)</option>
                            <option value="GMT">GMT (Greenwich Mean Time)</option>
                            <option value="CET">CET (Central European Time)</option>
                            <option value="JST">JST (Japan Standard Time)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      <div className="md:col-span-2 pt-2">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="w-full md:w-full cursor-pointer bg-violet-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                            </>
                          ) : (
                            "Update Profile"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Active Sessions */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 border-violet-500/10">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-violet-600" /> Active Sessions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-600/10 flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Windows PC - Chrome</div>
                          <div className="text-xs text-muted-foreground">New York, US • Current session</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-black uppercase border border-emerald-500/20">Active</span>
                    </div>
                    <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">iPhone - Safari</div>
                          <div className="text-xs text-muted-foreground">Los Angeles, US • 2 hours ago</div>
                        </div>
                      </div>
                      <button className="text-xs text-red-500 font-bold hover:text-red-600 transition-colors">Revoke</button>
                    </div>
                    <button className="w-full text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors mt-2">
                      Sign out of all devices
                    </button>
                  </div>
                </div>

                {/* Login History */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 border-violet-500/10">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <History className="w-4 h-4 text-violet-600" /> Login History
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="text-sm font-semibold">Successful login</div>
                          <div className="text-[10px] text-muted-foreground">Windows PC - Chrome</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold">Today, 10:30 AM</div>
                        <div className="text-[10px] text-muted-foreground">New York, US</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="text-sm font-semibold">Successful login</div>
                          <div className="text-[10px] text-muted-foreground">iPhone - Safari</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold">Yesterday, 8:15 PM</div>
                        <div className="text-[10px] text-muted-foreground">Los Angeles, US</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="text-sm font-semibold">Failed login attempt</div>
                          <div className="text-[10px] text-muted-foreground">Unknown device</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold">2 days ago</div>
                        <div className="text-[10px] text-muted-foreground">London, UK</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected Accounts */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 border-violet-500/10">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-violet-600" /> Connected Accounts
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-600/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Discord</div>
                          <div className="text-xs text-muted-foreground">Connected as FutureX#1234</div>
                        </div>
                      </div>
                      <button className="text-xs text-red-500 font-bold hover:text-red-600 transition-colors">Disconnect</button>
                    </div>
                    <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-600/10 flex items-center justify-center">
                          <Bitcoin className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Wallet</div>
                          <div className="text-xs text-muted-foreground">0x1234...5678 • Verified</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-violet-600 font-bold hover:text-violet-700 transition-colors">Change</button>
                        <button className="text-xs text-red-500 font-bold hover:text-red-600 transition-colors">Disconnect</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 border-violet-500/10">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ViewIcon className="w-4 h-4 text-violet-600" /> Privacy
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div>
                        <p className="text-sm font-bold">Profile Visibility</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Control who can see your profile</p>
                      </div>
                      <select className="bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-violet-600/20 outline-none">
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div>
                        <p className="text-sm font-bold">Leaderboard Visibility</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Show your ranking on leaderboards</p>
                      </div>
                      <button
                        onClick={() => setLeaderboardVisibility(!leaderboardVisibility)}
                        className={`relative w-14 h-8 rounded-full cursor-pointer border border-border transition-colors ${leaderboardVisibility ? "bg-violet-600" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${leaderboardVisibility ? "translate-x-6" : "translate-x-1"}`}>
                          <ViewIcon className="w-3.5 h-3.5 text-black" />
                        </div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div>
                        <p className="text-sm font-bold">Activity Visibility</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Show your recent activity</p>
                      </div>
                      <button
                        onClick={() => setActivityVisibility(!activityVisibility)}
                        className={`relative w-14 h-8 rounded-full cursor-pointer border border-border transition-colors ${activityVisibility ? "bg-violet-600" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${activityVisibility ? "translate-x-6" : "translate-x-1"}`}>
                          <ViewIcon className="w-3.5 h-3.5 text-black" />
                        </div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">Marketing Preferences</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Receive promotional emails</p>
                      </div>
                      <button
                        onClick={() => setMarketingPreferences(!marketingPreferences)}
                        className={`relative w-14 h-8 rounded-full cursor-pointer border border-border transition-colors ${marketingPreferences ? "bg-violet-600" : "bg-muted"}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${marketingPreferences ? "translate-x-6" : "translate-x-1"}`}>
                          <Bell className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 border-violet-500/10">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-violet-600" /> Security
                  </h3>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                    <div className="flex-1">
                      <p className="text-sm font-bold">Two-Factor Authentication</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`relative w-14 h-8 rounded-full cursor-pointer border border-border transition-colors ${twoFactorEnabled ? "bg-violet-600" : "bg-muted"}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${twoFactorEnabled ? "translate-x-6" : "translate-x-1"}`}>
                        {twoFactorEnabled ? <Shield className="w-3.5 h-3.5 text-black" /> : <ShieldOff className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                    </button>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none"
                          placeholder="Enter current password"
                          required
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPasswordsMatch(e.target.value === confirmPassword);
                            }}
                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none"
                            placeholder="Enter new password"
                            required
                            minLength={8}
                          />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Min 8 chars with uppercase, lowercase, and number</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm New</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setPasswordsMatch(newPassword === e.target.value);
                            }}
                            className={`w-full bg-muted/30 border ${confirmPassword ? (passwordsMatch ? "border-border" : "border-destructive") : "border-border"} rounded-xl px-4 py-3 text-sm focus:ring-2 ring-violet-600/20 outline-none`}
                            placeholder="Confirm new password"
                            required
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                          <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> Passwords don&apos;t match
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword || !passwordsMatch}
                      className="bg-violet-600 w-full md:w-full text-white cursor-pointer px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        "Update Security"
                      )}
                    </button>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 overflow-hidden relative border-red-500/20">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-red-500">
                    <Shield className="w-4 h-4" /> Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={async () => {
                          try {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            toast.success("Logged out successfully from all devices");
                            router.push("/auth-page/login");
                          } catch (error) {
                            console.error("Logout error:", error);
                            toast.error("Failed to sign out");
                          }
                        }}
                        className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        Log out everywhere
                      </button>
                      <button
                        onClick={() => {
                          toast.success("All accounts disconnected");
                        }}
                        className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        Disconnect all accounts
                      </button>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-[10px] text-muted-foreground mb-3">Irreversible and destructive actions</p>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                            toast.success("Account deletion initiated");
                          }
                        }}
                        className="w-full text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer shadow-lg shadow-red-500/20"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Image Crop Modal - UI Only */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-500 p-4">
          <div className="bg-card rounded-2xl shadow-2xl border border-border max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black uppercase tracking-tighter">Crop Profile Image</h3>
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setSelectedImageSrc(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="aspect-square bg-muted rounded-xl mb-4 flex items-center justify-center">
              {selectedImageSrc && (
                <img src={selectedImageSrc} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl" />
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setSelectedImageSrc(null);
                }}
                className="flex-1 border border-border py-3 rounded-xl font-bold text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Simulate crop completion - UI only
                  setShowCropModal(false);
                  setSelectedImageSrc(null);
                  toast.success("Profile image updated");
                }}
                className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20"
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}