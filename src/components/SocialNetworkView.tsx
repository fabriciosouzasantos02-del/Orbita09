import React, { useState, useEffect } from 'react';
import { 
  Heart, Users, Sparkles, UserPlus, UserMinus, Search, 
  MapPin, Award, Check, TrendingUp, RefreshCw, MessageSquare, 
  Eye, X, Globe, Compass, ArrowLeft, Send, Bell, Instagram, Facebook, Edit
} from 'lucide-react';
import { 
  getFirestoreDB, 
  saveProfileToDatabase, 
  handleFirestoreError,
  OperationType,
  UserProfileData
} from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { performAstroCalculation } from './astroMath';
import { getAvatarUrl } from '../lib/avatars';

interface SocialProfile extends UserProfileData {
  bio?: string;
  instagram?: string;
  facebook?: string;
  followersCount?: number;
  followingCount?: number;
  likesCount?: number;
  friendsCount?: number;
}

interface SocialNotification {
  id: string;
  type: 'like' | 'follow' | 'friend';
  senderEmail: string;
  senderName: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface SocialNetworkViewProps {
  currentUser: {
    email?: string;
    name: string;
    birthDate: string;
    birthTime?: string;
    birthCity: string;
    hasCreatedMap?: boolean;
    isPremium?: boolean;
    profilePhoto?: string;
    bio?: string;
    instagram?: string;
    facebook?: string;
    followersCount?: number;
    followingCount?: number;
    likesCount?: number;
    friendsCount?: number;
  };
  onUpdateCurrentUser: (updated: any) => void;
}

const SEED_USERS = [
  {
    email: "mariana.astro@starportal.com",
    name: "Mariana Alencar",
    birthDate: "2001-10-12",
    birthTime: "14:30",
    birthCity: "São Paulo, SP",
    sign: "Libra",
    bio: "Amante da harmonia, constelações de ar e design minimalista. Procuro trocas inteligentes e sinceras.",
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    hasCreatedMap: true,
    instagram: "@mari.alencar",
    facebook: "mariana.alencar.9",
    followersCount: 15,
    followingCount: 22,
    likesCount: 34
  },
  {
    email: "gustavo.gemini@starportal.com",
    name: "Gustavo Rocha",
    birthDate: "1998-06-05",
    birthTime: "08:15",
    birthCity: "Rio de Janeiro, RJ",
    sign: "Gêmeos",
    bio: "Curioso por natureza, baterista e leitor voraz de ficção. Sagitário me move a buscar novos horizontes.",
    profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    hasCreatedMap: true,
    instagram: "@guto.rocha",
    facebook: "gustavo.rocha.curioso",
    followersCount: 29,
    followingCount: 18,
    likesCount: 52
  },
  {
    email: "anabeatriz.sag@starportal.com",
    name: "Ana Beatriz",
    birthDate: "2003-12-01",
    birthTime: "19:00",
    birthCity: "Curitiba, PR",
    sign: "Sagitário",
    bio: "Vivendo guiadora pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.",
    profilePhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200",
    hasCreatedMap: true,
    instagram: "@anabea_celeste",
    facebook: "anabeatriz.cafes",
    followersCount: 41,
    followingCount: 30,
    likesCount: 88
  },
  {
    email: "felipe.aqua@starportal.com",
    name: "Felipe Mendes",
    birthDate: "1996-01-28",
    birthTime: "23:45",
    birthCity: "Belo Horizonte, MG",
    sign: "Aquário",
    bio: "Empreendedor social, astrônomo amador e desenvolvedor. Amigo acima de tudo, idealista ao extremo.",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    hasCreatedMap: true,
    hasPremium: true,
    instagram: "@lipemendes",
    facebook: "felipe.mendes.ideais",
    followersCount: 50,
    followingCount: 32,
    likesCount: 110
  }
];

export default function SocialNetworkView({ currentUser, onUpdateCurrentUser }: SocialNetworkViewProps) {
  const currentEmail = (currentUser.email || "viajante@starportal.com").toLowerCase().trim();
  
  // State variables
  const [allUsers, setAllUsers] = useState<SocialProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SocialProfile[]>([]);
  const [featuredProfiles, setFeaturedProfiles] = useState<SocialProfile[]>([]);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  
  // Navigation
  const [activeProfile, setActiveProfile] = useState<SocialProfile | null>(null);
  
  // Relationships
  const [myFollows, setMyFollows] = useState<string[]>([]); // emails of people I follow
  const [myLikes, setMyLikes] = useState<string[]>([]); // emails of people I liked
  const [activeFollowers, setActiveFollowers] = useState<SocialProfile[]>([]);
  const [activeFollowing, setActiveFollowing] = useState<SocialProfile[]>([]);
  const [activeFriends, setActiveFriends] = useState<SocialProfile[]>([]);
  
  // Modals / Overlays
  const [listModalType, setListModalType] = useState<'followers' | 'following' | 'friends' | null>(null);
  const [listModalUsers, setListModalUsers] = useState<SocialProfile[]>([]);
  const [showPublicMap, setShowPublicMap] = useState<boolean>(false);
  const [showCompatibility, setShowCompatibility] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  
  // Editing state
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editInstagram, setEditInstagram] = useState(currentUser.instagram || '');
  const [editFacebook, setEditFacebook] = useState(currentUser.facebook || '');
  
  // Loading indicators
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Helper: Zodiac Sign Finder
  const getZodiacSign = (dateStr: string): string => {
    if (!dateStr) return "Touro";
    try {
      const date = new Date(dateStr + "T00:00:00");
      const month = date.getMonth() + 1;
      const day = date.getDate();
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário";
      if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Peixes";
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries";
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro";
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos";
      if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer";
      if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão";
      if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem";
      if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
      if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião";
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário";
      return "Capricórnio";
    } catch {
      return "Touro";
    }
  };

  // 1. Initial Load and Seed Database
  useEffect(() => {
    const db = getFirestoreDB();
    if (!db) {
      // Offline fallback
      setFeaturedProfiles(SEED_USERS);
      setAllUsers(SEED_USERS);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const usersCol = collection(db, "users");
        const snap = await getDocs(usersCol);
        let docsList: SocialProfile[] = [];
        
        snap.forEach(d => {
          docsList.push(d.data() as SocialProfile);
        });

        // Ensure we exclude other visitant placeholders, but filter valid records
        docsList = docsList.filter(u => u.email && u.name);

        // Seeding mechanism: if there are no seed users, automatically write them to Firestore to populate the system
        const otherDocs = docsList.filter(u => u.email.toLowerCase().trim() !== currentEmail);
        if (otherDocs.length < 3) {
          for (const s of SEED_USERS) {
            if (!docsList.some(u => u.email.toLowerCase().trim() === s.email)) {
              const seedRef = doc(db, "users", s.email);
              await setDoc(seedRef, {
                ...s,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
              docsList.push(s as SocialProfile);
            }
          }
        }

        setAllUsers(docsList);
        
        // Featured profiles are basically any real users registered excluding the logged in user
        const others = docsList.filter(u => u.email.toLowerCase().trim() !== currentEmail);
        setFeaturedProfiles(others);
        
        // Fetch My Follows
        const followsCol = collection(db, "users", currentEmail, "following");
        const followsSnap = await getDocs(followsCol);
        const activeFollowEmails: string[] = [];
        followsSnap.forEach(d => activeFollowEmails.push(d.id));
        setMyFollows(activeFollowEmails);

        // Fetch My Likes
        const likesCol = collection(db, "users", currentEmail, "likesGiven");
        const likesSnap = await getDocs(likesCol);
        const activeLikeEmails: string[] = [];
        likesSnap.forEach(d => activeLikeEmails.push(d.id));
        setMyLikes(activeLikeEmails);

      } catch (e) {
        console.error("Erro ao sintonizar rede social:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen to notifications real-time!
    const notificationsPath = `users/${currentEmail}/notifications`;
    const notificationsCol = collection(db, "users", currentEmail, "notifications");
    const unsubscribeNotifications = onSnapshot(notificationsCol, (snap) => {
      const list: SocialNotification[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as SocialNotification);
      });
      // Sort: newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(list);
    }, (error) => {
      console.warn("Snapshot error details delayed:", error);
    });

    return () => {
      unsubscribeNotifications();
    };

  }, [currentEmail]);

  // Handle Search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    // Filter out our own account
    const matched = allUsers.filter(u => 
      u.email.toLowerCase().trim() !== currentEmail && 
      u.name.toLowerCase().includes(term)
    );
    setSearchResults(matched);
    setHasSearched(true);
  };

  // Sync edits to database
  const handleSaveMyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingAction("Ajustando perfil...");
      const updatedProfile = {
        ...currentUser,
        bio: editBio,
        instagram: editInstagram,
        facebook: editFacebook,
        updatedAt: new Date().toISOString()
      };
      
      await saveProfileToDatabase(currentEmail, updatedProfile as any);
      onUpdateCurrentUser(updatedProfile);
      setIsEditingProfile(false);
      
      // Update local allUsers
      setAllUsers(prev => prev.map(u => u.email.toLowerCase() === currentEmail ? { ...u, bio: editBio, instagram: editInstagram, facebook: editFacebook } : u));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  // Load relationships for an active user profile
  const fetchActiveRelations = async (targetEmail: string) => {
    const db = getFirestoreDB();
    if (!db) return;
    try {
      targetEmail = targetEmail.toLowerCase().trim();
      // Fetch followers
      const followersSnap = await getDocs(collection(db, "users", targetEmail, "followers"));
      const followersList: SocialProfile[] = [];
      followersSnap.forEach(f => {
        const matched = allUsers.find(u => u.email.toLowerCase().trim() === f.id);
        if (matched) followersList.push(matched);
      });
      setActiveFollowers(followersList);

      // Fetch following
      const followingSnap = await getDocs(collection(db, "users", targetEmail, "following"));
      const followingList: SocialProfile[] = [];
      followingSnap.forEach(f => {
        const matched = allUsers.find(u => u.email.toLowerCase().trim() === f.id);
        if (matched) followingList.push(matched);
      });
      setActiveFollowing(followingList);

      // Friends are mutual connections (they follow each other!)
      const friendList = followersList.filter(f => followingList.some(fol => fol.email.toLowerCase().trim() === f.email.toLowerCase().trim()));
      setActiveFriends(friendList);

    } catch (e) {
      console.warn("Erro ao buscar conexões de rede:", e);
    }
  };

  // Open profile of any user (internal or search results)
  const handleOpenProfile = async (profile: SocialProfile) => {
    setActiveProfile(profile);
    setListModalType(null); // Close active list modals for fluid screen traversal
    setShowCompatibility(false);
    setShowPublicMap(false);
    await fetchActiveRelations(profile.email);
  };

  // Follow/Unfollow action
  const handleToggleFollow = async (target: SocialProfile) => {
    const db = getFirestoreDB();
    if (!db) return;
    const targetEmail = target.email.toLowerCase().trim();
    const isFollowing = myFollows.includes(targetEmail);
    
    try {
      setLoadingAction(isFollowing ? "Deixando de seguir..." : "Seguindo...");
      
      const myFollowingRef = doc(db, "users", currentEmail, "following", targetEmail);
      const theirFollowersRef = doc(db, "users", targetEmail, "followers", currentEmail);
      
      if (isFollowing) {
        // Unfollow
        await deleteDoc(myFollowingRef);
        await deleteDoc(theirFollowersRef);
        
        // Remove friend relationship records if mutually following
        await deleteDoc(doc(db, "users", currentEmail, "friends", targetEmail));
        await deleteDoc(doc(db, "users", targetEmail, "friends", currentEmail));
        
        setMyFollows(prev => prev.filter(email => email !== targetEmail));
        
        // Update database counters
        const targetRef = doc(db, "users", targetEmail);
        await updateDoc(targetRef, {
          followersCount: Math.max(0, (target.followersCount || 1) - 1)
        }).catch(() => {});
        
        const myRef = doc(db, "users", currentEmail);
        await updateDoc(myRef, {
          followingCount: Math.max(0, (currentUser.followingCount || 1) - 1)
        }).catch(() => {});

      } else {
        // Follow
        await setDoc(myFollowingRef, { followedAt: new Date().toISOString() });
        await setDoc(theirFollowersRef, { followedAt: new Date().toISOString() });
        
        setMyFollows(prev => [...prev, targetEmail]);
        
        // Update database counters
        const targetRef = doc(db, "users", targetEmail);
        await updateDoc(targetRef, {
          followersCount: (target.followersCount || 0) + 1
        }).catch(() => {});
        
        const myRef = doc(db, "users", currentEmail);
        await updateDoc(myRef, {
          followingCount: (currentUser.followingCount || 0) + 1
        }).catch(() => {});

        // Check if mutual to register friend
        const isMutualFollow = activeFollowers.some(f => f.email.toLowerCase().trim() === currentEmail) || 
                               await getDoc(doc(db, "users", targetEmail, "following", currentEmail)).then(snap => snap.exists());
        
        if (isMutualFollow) {
          await setDoc(doc(db, "users", currentEmail, "friends", targetEmail), { addedAt: new Date().toISOString() });
          await setDoc(doc(db, "users", targetEmail, "friends", currentEmail), { addedAt: new Date().toISOString() });
          
          // Send notification of reciprocal friendship
          const friendNotifRef = doc(collection(db, "users", targetEmail, "notifications"));
          await setDoc(friendNotifRef, {
            type: 'friend',
            senderEmail: currentEmail,
            senderName: currentUser.name,
            message: "aceitou sua amizade. Vocês agora são amigos estelares!",
            createdAt: new Date().toISOString(),
            read: false
          });
        }

        // Send normal Follow notification
        const followNotifRef = doc(collection(db, "users", targetEmail, "notifications"));
        await setDoc(followNotifRef, {
          type: 'follow',
          senderEmail: currentEmail,
          senderName: currentUser.name,
          message: "começou a seguir você.",
          createdAt: new Date().toISOString(),
          read: false
        });
      }
      
      // Reload relations
      await fetchActiveRelations(targetEmail);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  // Like/Unlike action
  const handleToggleLike = async (target: SocialProfile) => {
    const db = getFirestoreDB();
    if (!db) return;
    const targetEmail = target.email.toLowerCase().trim();
    const isLiked = myLikes.includes(targetEmail);

    try {
      setLoadingAction(isLiked ? "Removendo curtida..." : "Registrando curtida...");
      const myLikesGivenRef = doc(db, "users", currentEmail, "likesGiven", targetEmail);
      const theirLikesCol = doc(db, "users", targetEmail, "likesSnapshot", currentEmail);
      
      if (isLiked) {
        await deleteDoc(myLikesGivenRef);
        await deleteDoc(theirLikesCol);
        setMyLikes(prev => prev.filter(email => email !== targetEmail));
        
        const targetRef = doc(db, "users", targetEmail);
        await updateDoc(targetRef, {
          likesCount: Math.max(0, (target.likesCount || 1) - 1)
        }).catch(() => {});
      } else {
        await setDoc(myLikesGivenRef, { likedAt: new Date().toISOString() });
        await setDoc(theirLikesCol, { likedAt: new Date().toISOString() });
        setMyLikes(prev => [...prev, targetEmail]);

        const targetRef = doc(db, "users", targetEmail);
        await updateDoc(targetRef, {
          likesCount: (target.likesCount || 0) + 1
        }).catch(() => {});

        // Notify user about the like in their notifications feed
        const likeNotifRef = doc(collection(db, "users", targetEmail, "notifications"));
        await setDoc(likeNotifRef, {
          type: 'like',
          senderEmail: currentEmail,
          senderName: currentUser.name,
          message: "curtiu seu perfil.",
          createdAt: new Date().toISOString(),
          read: false
        });
      }

      // Reload profile
      const updatedSnap = await getDoc(doc(db, "users", targetEmail));
      if (updatedSnap.exists()) {
        setActiveProfile(updatedSnap.data() as SocialProfile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  // Clear or dismiss live notification
  const handleDismissNotification = async (notifId: string) => {
    const db = getFirestoreDB();
    if (!db) return;
    try {
      await deleteDoc(doc(db, "users", currentEmail, "notifications", notifId));
    } catch (e) {
      console.error(e);
    }
  };

  // Double relation score calculator (Completely mathematical & deterministic matching)
  const calculateCompatibility = (name1: string, name2: string) => {
    const combined = (name1 + name2).toLowerCase().replace(/\s+/g, '');
    let charSum = 0;
    for (let i = 0; i < combined.length; i++) {
      charSum += combined.charCodeAt(i);
    }
    
    const amor = 70 + (charSum % 28); // 70-98%
    const emocional = 65 + ((charSum * 3) % 33); // 65-98%
    const mental = 72 + ((charSum * 7) % 25); // 72-97%
    const energetica = 68 + ((charSum * 13) % 31); // 68-99%
    const totalMedia = Math.round((amor + emocional + mental + energetica) / 4);

    return { amor, emocional, mental, energetica, totalMedia };
  };

  // Compatibility specific explanation paragraphs generator
  const getCompatibilityExplanation = (score: number) => {
    if (score >= 90) {
      return "Conexão de almas raras. Os astros indicam que vocês emanam na mesma frequência áurica vibracional. Suas metas, ritmos e conversas íntimas fluem livremente sem conflitos ocultos.";
    }
    if (score >= 80) {
      return "Harmonia de longo prazo. Vocês compartilham forte entendimento emocional e afinidades de ação palpáveis. O respeito mútuo abre excelentes canais de amizade produtiva e crescimento.";
    }
    if (score >= 70) {
      return "Relacionamento dinâmico com pequenos ajustes construtivos. Existe atração genuína, mas requer paciência para aceitar as diferenças nativas sob trânsitos celestes mutáveis.";
    }
    return "Sinergia de aprendizado cármico. Suas diferenças dão espaço para superação mútua e resgate de virtudes adormecidas.";
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* 1. PORTAL NOTIFICATION SHIELD */}
      {notifications.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 p-4 rounded-3xl text-left space-y-2.5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.03] rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center text-xs border-b border-slate-850 pb-2">
            <span className="font-mono text-cyan-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-cyan-400 animate-bounce" />
              Notas de Atividades Sociais em Tempo Real ({notifications.length})
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Conexão Ativa</span>
          </div>

          <div className="max-h-24 overflow-y-auto space-y-2.5 pr-2">
            {notifications.slice(0, 3).map((notif) => (
              <div key={notif.id} className="flex justify-between items-center text-xs font-sans text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {notif.type === 'like' ? '❤️' : notif.type === 'friend' ? '✨' : '👥'}
                  </span>
                  <p>
                    <strong className="text-slate-100 font-semibold">{notif.senderName}</strong> {notif.message}
                  </p>
                </div>
                <button 
                  onClick={() => handleDismissNotification(notif.id)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-200 transition text-[9px] font-mono"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOADING OVERLAY SCREEN */}
      {loadingAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-200 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-300 tracking-widest uppercase">{loadingAction}</p>
        </div>
      )}

      {/* MAIN LAYOUT: CONDITIONAL RENDERING OF PROFILE OR EXPLORE SCREEN */}
      {!activeProfile ? (
        <div className="space-y-6">
          
          {/* SEARCH COMPONENT BOARD */}
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-850 space-y-4 shadow-xl text-left">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#E5C158] font-black">Comunidade e Conexões Celestes</span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-100">Encontrar Novas Conexões</h2>
              <p className="text-xs text-slate-400">Entre em sintonia e explore perfis de buscadores no portal Cósmica Órbita.</p>
              <div className="p-2.5 bg-cyan-950/20 rounded-xl border border-cyan-900/30 flex items-center gap-2 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Nota do Portal: Este ambiente destina-se à descoberta de afinidade e sinastria astrológica. O envio de chats e troca de mensagens diretas entre usuários é <strong>indisponível</strong> para assegurar total privacidade e proteção de tráfego áurico.
                </p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome da pessoa"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-850 focus:border-cyan-500/50 rounded-2xl text-xs text-slate-200 placeholder-slate-500 outline-hidden transition font-medium"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-605 text-slate-950 font-sans font-black text-xs uppercase tracking-wider rounded-2xl hover:opacity-100 opacity-90 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* SATELLITE EDIT MY PROFILE ACCESS QUICK PREVIEW */}
          <div className="bg-slate-900/20 p-5 rounded-3xl border border-slate-850/60 text-left flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center shrink-0">
                {currentUser.profilePhoto ? (
                  <img src={getAvatarUrl(currentUser.profilePhoto)} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-sm font-black text-[#E5C158] uppercase">
                    {currentUser.name.slice(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-100 font-sans">Meu Cartão de Identidade Social</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Bio: <span className="text-slate-300 italic">"{currentUser.bio || 'Sem bio editada...'}"</span></p>
                <div className="flex items-center gap-2 mt-1">
                  {currentUser.instagram && <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded text-pink-400 font-mono">{currentUser.instagram}</span>}
                  {currentUser.facebook && <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded text-blue-400 font-mono">fb://{currentUser.facebook}</span>}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setEditBio(currentUser.bio || '');
                setEditInstagram(currentUser.instagram || '');
                setEditFacebook(currentUser.facebook || '');
                setIsEditingProfile(true);
              }}
              className="py-2 px-4 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-[10px] font-sans font-black uppercase tracking-wider text-slate-300 flex items-center gap-2 transition cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              Editar Perfil
            </button>
          </div>

          {/* COMPILING RESULTS VIEW */}
          {hasSearched ? (
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest text-left">
                Resultados da busca ({searchResults.length})
              </h3>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {searchResults.map((user) => (
                    <button 
                      key={user.email}
                      onClick={() => handleOpenProfile(user)}
                      className="bg-slate-950 p-5 rounded-3xl border border-slate-850 hover:border-slate-700 text-left space-y-4 hover:shadow-lg transition-all flex flex-col justify-between w-full relative focus:outline-none cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 w-full">
                        <div className="w-12 h-12 rounded-full border border-slate-705 overflow-hidden shrink-0 relative bg-slate-900">
                          {user.profilePhoto ? (
                            <img src={getAvatarUrl(user.profilePhoto)} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-300 font-sans uppercase">
                              {user.name.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-100 text-xs truncate">{user.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 mt-1">
                            Sol em <span className="font-semibold text-amber-450">{getZodiacSign(user.birthDate)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-900 flex justify-between items-center text-[10px] w-full mt-2.5">
                        <span className="text-slate-500 font-mono">{user.birthCity || "Origem Oculta"}</span>
                        <span className="text-cyan-400 font-bold font-mono">Abrir Perfil →</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 bg-slate-900/10 border border-slate-850/60 rounded-3xl text-center text-xs text-slate-450 font-mono">
                  Nenhum buscador correspondente focado neste nome. Revise a ortografia.
                </div>
              )}
            </div>
          ) : (
            // FEATURED NETWORK DISCOVERY
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest text-left">
                Membros Ativos em Destaque
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredProfiles.map((user) => (
                  <button 
                    key={user.email}
                    onClick={() => handleOpenProfile(user)}
                    className="bg-slate-950 p-5 rounded-3xl border border-slate-800 hover:border-slate-700 text-left space-y-4 hover:shadow-lg transition-all flex flex-col justify-between w-full focus:outline-none cursor-pointer group"
                  >
                    <div className="space-y-3 w-full">
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-12 h-12 rounded-full border border-slate-750 overflow-hidden shrink-0 relative bg-slate-900">
                          {user.profilePhoto ? (
                            <img src={getAvatarUrl(user.profilePhoto)} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-300 font-sans uppercase">
                              {user.name.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-100 text-xs truncate">{user.name}</h4>
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[8.5px] font-mono text-amber-450 rounded font-bold">
                            {getZodiacSign(user.birthDate)}
                          </span>
                        </div>
                      </div>

                      {user.bio && (
                        <p className="text-[10px] text-slate-400 font-sans line-clamp-2 leading-relaxed italic pl-2 border-l border-slate-800">
                          "{user.bio}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-slate-900 flex justify-between items-center text-[10px] w-full mt-2.5">
                      <span className="text-slate-500 font-mono">{user.birthCity || "Origem Oculta"}</span>
                      <span className="text-[#E5C158] font-bold font-mono">Conectar →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        // 2. DETAILED PROFILE PAGE OF ANOTHER USER
        <div className="space-y-6 text-left animate-in fade-in duration-300">
          
          {/* BACK HEADER ELEMENT */}
          <div className="flex justify-between items-center pb-2 border-b border-slate-850">
            <button 
              onClick={() => setActiveProfile(null)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-350 hover:text-white transition flex items-center gap-2 text-xs font-sans font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              Ver Todas as Pessoas
            </button>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Perfil Astrológico Social</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT PROFILE SUM */}
            <div className="lg:col-span-5 space-y-5 bg-slate-950 p-6 rounded-3xl border border-slate-800 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#E5C158]/[0.02] rounded-full blur-2xl pointer-events-none" />
              
              {/* Photo Area */}
              <div className="relative w-28 h-28 mx-auto shrink-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-full blur-xs opacity-50" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-slate-850 bg-slate-900 flex items-center justify-center">
                  {activeProfile.profilePhoto ? (
                    <img src={getAvatarUrl(activeProfile.profilePhoto)} alt={activeProfile.name} className="w-full h-full object-cover relative z-10" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-3xl font-black text-amber-200 relative z-10 uppercase">
                      {activeProfile.name.slice(0, 2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Names and basic celestial coordinates */}
              <div className="space-y-2 mt-4">
                <h2 className="text-xl font-extrabold text-slate-100">{activeProfile.name}</h2>
                
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/25 text-[9px] font-mono font-semibold text-amber-450 rounded-md">
                    Sol em {getZodiacSign(activeProfile.birthDate)}
                  </span>
                  
                  {activeProfile.hasPremium && (
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-450 rounded-md">
                      Membro Premium
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 font-sans mt-1">
                  Origem: <span className="font-mono text-slate-300">{activeProfile.birthCity}, {activeProfile.birthDate.split('-')[0]}</span>
                </p>
              </div>

              {/* Bio and links */}
              {activeProfile.bio && (
                <p className="p-4 bg-slate-900/40 rounded-2xl border border-slate-850 text-xs italic text-slate-350 leading-relaxed font-sans mt-4">
                  "{activeProfile.bio}"
                </p>
              )}

              {/* Social Medias handles displaying if set */}
              {(activeProfile.instagram || activeProfile.facebook) && (
                <div className="flex flex-wrap gap-2.5 justify-center py-2">
                  {activeProfile.instagram && (
                    <a 
                      href={`https://instagram.com/${activeProfile.instagram.replace('@', '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/25 hover:bg-pink-500/20 text-pink-400 font-sans font-bold text-[10px] flex items-center gap-1.5 transition"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span>{activeProfile.instagram}</span>
                    </a>
                  )}

                  {activeProfile.facebook && (
                    <a 
                      href={activeProfile.facebook.startsWith('http') ? activeProfile.facebook : `https://facebook.com/${activeProfile.facebook}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 text-blue-400 font-sans font-bold text-[10px] flex items-center gap-1.5 transition"
                    >
                      <Facebook className="w-3.5 h-3.5 text-blue-400" />
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
              )}

              {/* COUNTERS COMPONENT LIST GRID (Followers, Following, Friends, Likes) */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-900 mt-4 text-center font-sans">
                <button 
                  onClick={() => {
                    setListModalUsers(activeFollowers);
                    setListModalType('followers');
                  }}
                  className="p-2 hover:bg-slate-900 rounded-xl transition flex flex-col items-center"
                >
                  <span className="text-sm font-black text-slate-100 font-mono tracking-tight">
                    {activeFollowers.length}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Seguidores</span>
                </button>

                <button 
                  onClick={() => {
                    setListModalUsers(activeFollowing);
                    setListModalType('following');
                  }}
                  className="p-2 hover:bg-slate-900 rounded-xl transition flex flex-col items-center"
                >
                  <span className="text-sm font-black text-slate-100 font-mono tracking-tight">
                    {activeFollowing.length}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Seguindo</span>
                </button>

                <button 
                  onClick={() => {
                    setListModalUsers(activeFriends);
                    setListModalType('friends');
                  }}
                  className="p-2 hover:bg-slate-900 rounded-xl transition flex flex-col items-center"
                >
                  <span className="text-sm font-black text-slate-100 font-mono tracking-tight">
                    {activeFriends.length}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Amigos</span>
                </button>

                <div className="p-2 flex flex-col items-center">
                  <span className="text-sm font-black text-slate-100 font-mono tracking-tight">
                    {activeProfile.likesCount || 0}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Curtidas</span>
                </div>
              </div>

              {/* Follow / Like interactives bars */}
              <div className="flex gap-2.5 pt-4 border-t border-slate-900 mt-2">
                <button 
                  onClick={() => handleToggleLike(activeProfile)}
                  className={`flex-1 py-2.5 rounded-xl font-sans text-xs uppercase font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    myLikes.includes(activeProfile.email.toLowerCase().trim()) 
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' 
                      : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${myLikes.includes(activeProfile.email.toLowerCase().trim()) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{myLikes.includes(activeProfile.email.toLowerCase().trim()) ? 'Curtido' : 'Curtir Perfil'}</span>
                </button>

                <button 
                  onClick={() => handleToggleFollow(activeProfile)}
                  className={`flex-1 py-2.5 rounded-xl font-sans text-xs uppercase font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    myFollows.includes(activeProfile.email.toLowerCase().trim()) 
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-404' 
                      : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-450 hover:text-slate-200'
                  }`}
                >
                  {myFollows.includes(activeProfile.email.toLowerCase().trim()) ? (
                    <>
                      <Check className="w-4 h-4 text-cyan-404" />
                      <span>Seguindo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Seguir</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* RIGHT CELESTIAL ANALYSIS OPERATIONS OPTIONS */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* PRIMARY OPTIONS ROW: VIEW MAP, VIEW SYNASTRY */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setShowCompatibility(false);
                    setShowPublicMap(!showPublicMap);
                  }}
                  className={`p-4 rounded-3xl border text-center font-sans transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md ${
                    showPublicMap 
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <Compass className="w-6 h-6 text-amber-500 animate-pulse" />
                  <span className="font-black text-xs uppercase tracking-wide">Ver Mapa Astral</span>
                  <span className="text-[9px] text-slate-500 font-sans font-medium">Posições natais públicas</span>
                  </button>

                <button 
                  onClick={() => {
                    setShowPublicMap(false);
                    setShowCompatibility(!showCompatibility);
                  }}
                  className={`p-4 rounded-3xl border text-center font-sans transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md ${
                    showCompatibility 
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
                      : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <Sparkles className="w-6 h-6 text-cyan-400 animate-spin-slow" />
                  <span className="font-black text-xs uppercase tracking-wide">Sinastria Astral</span>
                  <span className="text-[9px] text-slate-500 font-sans font-medium">Compatibilidade detalhada</span>
                </button>
              </div>

              {/* CELESTIAL DISPLAY FOR MAP VIEW */}
              {showPublicMap && (() => {
                const chart = performAstroCalculation(activeProfile.birthDate, activeProfile.birthTime || "12:00");
                const sun = chart.astros.find(a => a.name === "Sol");
                const moon = chart.astros.find(a => a.name === "Lua");
                const ascObj = chart.astros.find(a => a.name === "Ascendente");
                
                return (
                  <div className="bg-slate-950 p-6 rounded-3xl border border-amber-500/20 text-left space-y-4 animate-in duration-200 slide-in-from-top-3">
                    <div className="border-b border-slate-900 pb-2 flex justify-between items-center">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                        Mapa Primordial de {activeProfile.name}
                      </h4>
                      <button onClick={() => setShowPublicMap(false)} className="text-slate-500 hover:text-slate-200">✕</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-850 flex flex-col justify-between">
                        <span className="text-[8px] font-mono text-slate-500 uppercase font-black block">☀️ Signo Solar</span>
                        <strong className="text-sm font-black text-slate-100 block mt-1">{sun?.sign || getZodiacSign(activeProfile.birthDate)}</strong>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">Essência interior, ego e propósito</span>
                      </div>

                      <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-850 flex flex-col justify-between">
                        <span className="text-[8px] font-mono text-slate-500 uppercase font-black block">🌙 Signo Lunar</span>
                        <strong className="text-sm font-black text-slate-100 block mt-1">{moon?.sign || "Câncer"}</strong>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">Lado subonírico, emoções alimentadas</span>
                      </div>

                      <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-850 flex flex-col justify-between">
                        <span className="text-[8px] font-mono text-slate-500 uppercase font-black block">🧭 Ascendente</span>
                        <strong className="text-sm font-black text-slate-100 block mt-1">{ascObj?.sign || "Libra"}</strong>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">Foco de projeção física social externa</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Distribuição de Planetas Públicos</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                        {chart.astros.slice(0, 8).map(a => (
                          <div key={a.name} className="p-2 bg-slate-900/30 rounded-xl border border-slate-850 flex justify-between items-center">
                            <span className="text-slate-450 font-bold">{a.name}</span>
                            <span className="font-mono text-amber-500">{a.sign}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* CELESTIAL DISPLAY FOR COMPATIBILITY */}
              {showCompatibility && (() => {
                const results = calculateCompatibility(currentUser.name, activeProfile.name);
                return (
                  <div className="bg-slate-950 p-6 rounded-3xl border border-cyan-500/20 text-left space-y-5 animate-in duration-200 slide-in-from-top-3 font-sans">
                    <div className="border-b border-slate-900 pb-2 flex justify-between items-center">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-404">
                        Sintonia de Compatibilidade Astral
                      </h4>
                      <button onClick={() => setShowCompatibility(false)} className="text-slate-500 hover:text-slate-200">✕</button>
                    </div>

                    {/* General Score display */}
                    <div className="py-4 rounded-2xl bg-slate-900/40 text-center space-y-1 relative">
                      <span className="text-[9px] font-mono uppercase font-black text-[#E5C158] tracking-widest block">Média de Ressonância Estelar</span>
                      <div className="text-3xl font-black text-cyan-400 font-mono tracking-tight">{results.totalMedia}%</div>
                      <p className="text-[10px] text-slate-450 mt-1 max-w-sm mx-auto">Calculado unindo e comparando as frequências fundamentais do seu Sol ao astros de {activeProfile.name}.</p>
                    </div>

                    {/* Breakdown metrics lists */}
                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-bold">
                          <span className="text-rose-450">Compatibilidade Amorosa</span>
                          <span className="font-mono text-rose-455">{results.amor}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                          <div className="h-full bg-rose-500" style={{ width: `${results.amor}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-450 mt-1 pl-1">{getCompatibilityExplanation(results.amor)}</p>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] mb-1 font-bold">
                          <span className="text-sky-400">Compatibilidade Emocional</span>
                          <span className="font-mono text-sky-400">{results.emocional}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                          <div className="h-full bg-sky-500" style={{ width: `${results.emocional}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-450 mt-1 pl-1">{getCompatibilityExplanation(results.emocional)}</p>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] mb-1 font-bold">
                          <span className="text-green-400">Compatibilidade Mental</span>
                          <span className="font-mono text-green-400">{results.mental}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                          <div className="h-full bg-green-500" style={{ width: `${results.mental}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-450 mt-1 pl-1">{getCompatibilityExplanation(results.mental)}</p>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] mb-1 font-bold">
                          <span className="text-purple-400">Compatibilidade Energética</span>
                          <span className="font-mono text-purple-400">{results.energetica}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                          <div className="h-full bg-purple-500" style={{ width: `${results.energetica}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-450 mt-1 pl-1">{getCompatibilityExplanation(results.energetica)}</p>
                      </div>
                    </div>

                  </div>
                );
              })()}

              <div className="bg-slate-900/20 p-5 rounded-3xl border border-slate-850 text-left font-sans space-y-4">
                <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold border-b border-slate-900 pb-1.5">Conselhos para Interagirem</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lembre-se de que a Astrologia serve como guia para compreender as nuances sutis das pessoas. Utilize as redes sociais de forma sintonizada para elevar os valores de amizade e cooperação mútua.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* EDIT MY PROFILE DETAILS MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-150 flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveMyProfile} 
            className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 md:p-8 space-y-6 relative text-left animate-in zoom-in-95 duration-200 shadow-2xl"
          >
            <button 
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-950 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1.5 border-b border-slate-850 pb-3">
              <h3 className="text-base font-extrabold text-slate-100 font-sans">Editar Dados do Perfil Social</h3>
              <p className="text-[10px] text-slate-500">Adicione suas mídias sociais e bio para os outros visualizadores.</p>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">Bio Curta</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={150}
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-200"
                  placeholder="Escreva algo curto sobre você..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">Instagram (@usuario)</label>
                <input 
                  type="text"
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-200 font-mono"
                  placeholder="@seu_perfil"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">Facebook (usuário ou link)</label>
                <input 
                  type="text"
                  value={editFacebook}
                  onChange={(e) => setEditFacebook(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-200 font-mono"
                  placeholder="link_do_facebook"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-850 flex justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2.5 bg-slate-950 text-slate-400 hover:text-white text-xs font-bold rounded-xl border border-slate-850 cursor-pointer"
              >
                Cancelar
              </button>
              
              <button 
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-[#E5C158] to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Salvar Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RELATIONSHIPS LIST MODAL (Followers, Following, Friends) */}
      {listModalType && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-150 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-sm w-full rounded-e-[24px] rounded-s-[24px] rounded-3xl p-6 space-y-4 relative text-left animate-in zoom-in-95 duration-200 shadow-2xl">
            <button 
              onClick={() => setListModalType(null)}
              className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-950 rounded-full text-slate-400 hover:text-white transition cursor-pointer text-xs"
            >
              ✕
            </button>

            <div className="border-b border-slate-850 pb-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-404">
                {listModalType === 'followers' ? 'Seguidores' : listModalType === 'following' ? 'Seguindo' : 'Lista de Amigos'}
              </h4>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {listModalUsers.length > 0 ? (
                listModalUsers.map((u) => (
                  <button 
                    key={u.email}
                    onClick={() => handleOpenProfile(u)}
                    className="flex items-center justify-between w-full p-2 hover:bg-slate-950 rounded-xl transition text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center font-sans shrink-0">
                        {u.profilePhoto ? (
                          <img src={getAvatarUrl(u.profilePhoto)} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-black text-amber-300 uppercase">
                            {u.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-200 block truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{u.birthCity}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#E5C158] font-mono leading-none shrink-0 border border-[#E5C158]/20 px-1.5 py-0.5 rounded">
                      {getZodiacSign(u.birthDate)}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-[10px] text-slate-500 font-mono">
                  Nenhum usuário registrado nesta categoria.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setListModalType(null)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 text-[10px] font-mono rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
