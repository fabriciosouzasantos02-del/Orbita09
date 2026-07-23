import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc as firestoreGetDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  addDoc,
  onSnapshot
} from "firebase/firestore";
// Firebase Storage was disabled as it is no longer needed. All profile photos use local beautiful celestial avatars.
import { 
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";

// -------------------------------------------------------------------------
// COMPLIANT FIRESTORE ERROR HANDLING INTERFACES
// -------------------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

async function getDocWithTimeout(docRef: any, timeoutMs = 3500): Promise<any> {
  let timerId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error("Timeout ao acessar banco de dados Firestore (Dispositivo offline ou rede instável)."));
    }, timeoutMs);
  });
  
  try {
    return await Promise.race([
      firestoreGetDoc(docRef),
      timeoutPromise
    ]);
  } finally {
    clearTimeout(timerId);
  }
}

export async function getDoc(docRef: any): Promise<any> {
  return getDocWithTimeout(docRef);
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const auth = getFirebaseAuth();
  const errMsg = error instanceof Error ? error.message : String(error);
  const errCode = (error as any)?.code || "";

  const isPermissionError = 
    errMsg.toLowerCase().includes('permission') || 
    errCode.toLowerCase().includes('permission') ||
    errMsg.toLowerCase().includes('insufficient') ||
    errCode.toLowerCase().includes('permission-denied') ||
    errMsg.toLowerCase().includes('unauthorized');

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isPermissionError) {
    console.error('[Securitizao] Erro do Firestore Detectado: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    // For non-permission errors (like network unavailable), log a warning and let the fallback state proceed
    console.warn('[Offline Mode/Network Error] Firebase operation deferred (local backup is active):', errMsg);
  }
}

export function sanitizeFirestoreData(data: any): any {
  if (data === undefined) return null;
  if (data === null) return null;
  if (Array.isArray(data)) {
    return data.map(item => sanitizeFirestoreData(item));
  }
  if (typeof data === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(data)) {
      if (data[key] !== undefined) {
        cleaned[key] = sanitizeFirestoreData(data[key]);
      }
    }
    return cleaned;
  }
  return data;
}

export function mergeProfileData(local: any, remote: any): any {
  if (!local) return remote;
  if (!remote) return local;

  const merged: any = { ...remote, ...local };

  // Preserve valid non-empty birth details prioritizing whichever object has non-empty values
  merged.birthDate = (local.birthDate && local.birthDate.trim()) ? local.birthDate : (remote.birthDate && remote.birthDate.trim() ? remote.birthDate : "");
  merged.birthTime = (local.birthTime && local.birthTime.trim()) ? local.birthTime : (remote.birthTime && remote.birthTime.trim() ? remote.birthTime : "12:00");
  merged.birthCity = (local.birthCity && local.birthCity.trim() && local.birthCity !== "Sao_Paulo") 
    ? local.birthCity 
    : (remote.birthCity && remote.birthCity.trim() ? remote.birthCity : (local.birthCity || "Sao_Paulo"));
  merged.isUnknownTime = local.isUnknownTime ?? remote.isUnknownTime ?? false;

  const validLocalName = local.name && local.name !== "Viajante Estelar" && local.name !== "Buscador" ? local.name : null;
  const validRemoteName = remote.name && remote.name !== "Viajante Estelar" && remote.name !== "Buscador" ? remote.name : null;
  merged.name = validLocalName || validRemoteName || local.name || remote.name || "Buscador";

  merged.displayName = local.displayName || remote.displayName || merged.name;
  merged.birthName = local.birthName || remote.birthName || merged.name;
  merged.profileName = local.profileName || remote.profileName || merged.name;

  merged.avatarId = local.avatarId || remote.avatarId || local.profilePhoto || remote.profilePhoto || "";
  merged.profilePhoto = merged.avatarId;

  merged.currentChartId = local.currentChartId || remote.currentChartId || "";
  merged.hasCreatedMap = !!merged.birthDate && !!merged.birthCity;

  merged.scorePoints = Math.max(local.scorePoints ?? 0, remote.scorePoints ?? 0, local.stellarPoints ?? 0, remote.stellarPoints ?? 0);
  merged.stellarPoints = merged.scorePoints;

  const localTime = new Date(local.updatedAt || 0).getTime();
  const remoteTime = new Date(remote.updatedAt || 0).getTime();
  merged.updatedAt = localTime > remoteTime ? local.updatedAt : remote.updatedAt;

  return merged;
}

// Lazy-loaded or optionally fallback firebase configuration
import firebaseAppletConfig from "../../firebase-applet-config.json";

let appInstance: any = null;
let dbInstance: any = null;
let authInstance: any = null;

// Standard firebase configuration or dynamic env fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || (firebaseAppletConfig as any).databaseURL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || (firebaseAppletConfig as any).measurementId || ""
};

// Check if we can safely initialize firebase Client
const hasConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

export function getFirebaseApp() {
  if (!hasConfig) return null;
  if (!appInstance) {
    if (getApps().length === 0) {
      appInstance = initializeApp(firebaseConfig);
    } else {
      appInstance = getApp();
    }
  }
  return appInstance;
}

export function getFirestoreDB() {
  if (!hasConfig) return null;
  if (!dbInstance) {
    const app = getFirebaseApp();
    if (app) {
      const dbId = firebaseAppletConfig.firestoreDatabaseId;
      if (dbId && dbId !== "(default)") {
        dbInstance = getFirestore(app, dbId);
      } else {
        dbInstance = getFirestore(app);
      }
    }
  }
  return dbInstance;
}

export function getFirebaseAuth() {
  if (!hasConfig) return null;
  if (!authInstance) {
    const app = getFirebaseApp();
    if (app) {
      authInstance = getAuth(app);
    }
  }
  return authInstance;
}

export async function uploadUserProfilePhoto(email: string, file: File | Blob): Promise<string> {
  throw new Error("O upload de fotos de perfil via Firebase Storage foi removido. Em vez disso, selecione um avatar místico local.");
}

// Ensure first connection is validated on startup
async function validateFirestoreConnection() {
  const db = getFirestoreDB();
  if (db) {
    try {
      const { getDocFromServer } = await import('firebase/firestore');
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("[Firestore] Teste de conexão estabelecido com sucesso.");
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn("[Resiliência] O banco de dados está operando no modo offline de contingência local. Seus dados serão mantidos seguros no dispositivo.");
      } else {
        console.info("[Firestore] Iniciando em modo híbrido offline de contingência.");
      }
    }
  }
}
validateFirestoreConnection();

// -------------------------------------------------------------------------
// HYBRID SYNCRONIZER LAYER FOR DATA PERSISTENCE & REAL-TIME SYNC
// -------------------------------------------------------------------------
export interface UserProfileData {
  userId?: string;
  uid?: string;
  updatedAt?: string;
  name: string;
  email: string;
  photoURL?: string;
  provider?: string;
  emailVerified?: boolean;
  isEmailVerified?: boolean; // Retro-compatibility
  displayName?: string;
  birthName?: string;
  profileName?: string;
  avatarId?: string;
  preferredLanguage?: string;
  trialUsed?: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
  plan?: string;
  subscriptionStatus?: string;
  trialStart?: string;
  trialEnds?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionUpdatedAt?: string;
  deviceFingerprint?: string;
  deviceId?: string;
  lastLoginAt?: string;
  // Existing fields
  birthDate?: string;
  birthTime?: string;
  birthCity?: string;
  birthRegion?: string;
  profilePhoto?: string;
  isPremium?: boolean;
  hasCreatedMap?: boolean;
  scorePoints?: number;
  stellarPoints?: number;
  isUnknownTime?: boolean;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  isSubscribed?: boolean;
  subscriptionEndDate?: string;
  currentChartId?: string;
  mainMapChangesCount?: number;
  verificationCode?: string;
  followersCount?: number;
  followingCount?: number;
  likesCount?: number;
  friendsCount?: number;
  schemaVersion?: number;
  verificationCodeCreatedAt?: string;
}

export interface ExtraMapItem {
  id: string;
  userId: string;
  label: string;
  birthDate: string;
  birthTime?: string;
  birthCity: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

export interface DreamLogItem {
  id: string;
  userId: string;
  title: string;
  text: string;
  interpretation: string;
  sentiment: string;
  date: string;
  time?: string;
  language?: string;
}

// 1. Helper to retrieve current document key (strictly preferring active authenticated UID or cached UID, preventing hybrid email keys)
export function getUserDocKey(emailOrUid?: string): string {
  // If the parameter passed is already a valid non-email UID, return it directly
  if (emailOrUid) {
    const trimmed = emailOrUid.trim();
    if (trimmed && !trimmed.includes("@")) {
      return trimmed;
    }
  }

  const auth = getFirebaseAuth();
  const activeUid = auth?.currentUser?.uid;
  if (activeUid) return activeUid;

  const cachedUid = localStorage.getItem("orbi_logged_uid");
  if (cachedUid) return cachedUid;

  try {
    const savedProfile = localStorage.getItem("orbi_user_profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      if (parsed?.uid && typeof parsed.uid === 'string' && !parsed.uid.includes("@")) return parsed.uid;
      if (parsed?.userId && typeof parsed.userId === 'string' && !parsed.userId.includes("@")) return parsed.userId;
    }
  } catch (_) {}

  // Never return an email address as a document key under users/{key}
  return "";
}

// Core Profile Real-Time Synchronizers
export async function saveProfileToDatabase(email: string, profile: UserProfileData) {
  const mailKey = email.toLowerCase().trim();
  const auth = getFirebaseAuth();
  const activeUid = auth?.currentUser?.uid || profile.uid || profile.userId || localStorage.getItem("orbi_logged_uid") || "";

  if (!activeUid) {
    console.warn("[saveProfileToDatabase] Impossível salvar no Firestore sem UID ativo.");
    return;
  }

  const docKey = activeUid;

  // Read existing local profile to protect against overwriting valid fields
  let existingLocal: any = null;
  try {
    const saved = localStorage.getItem("orbi_user_profile");
    if (saved) existingLocal = JSON.parse(saved);
  } catch (_) {}

  const rawName = profile.name || profile.displayName || profile.profileName || profile.birthName || existingLocal?.name || existingLocal?.displayName || "";
  const validName = (rawName && rawName !== "Viajante Estelar" && rawName !== "Buscador") 
    ? rawName 
    : (existingLocal?.name && existingLocal?.name !== "Viajante Estelar" && existingLocal?.name !== "Buscador" ? existingLocal.name : (rawName || "Buscador"));

  const pointsVal = Math.max(
    profile.stellarPoints !== undefined ? profile.stellarPoints : 0,
    profile.scorePoints !== undefined ? profile.scorePoints : 0,
    existingLocal?.scorePoints !== undefined ? existingLocal.scorePoints : 0,
    existingLocal?.stellarPoints !== undefined ? existingLocal.stellarPoints : 0
  );

  const birthDateVal = (profile.birthDate && profile.birthDate.trim()) ? profile.birthDate : (existingLocal?.birthDate || "");
  const birthTimeVal = (profile.birthTime && profile.birthTime.trim()) ? profile.birthTime : (existingLocal?.birthTime || "12:00");
  const birthCityVal = (profile.birthCity && profile.birthCity.trim() && profile.birthCity !== "Sao_Paulo") 
    ? profile.birthCity 
    : (existingLocal?.birthCity || profile.birthCity || "Sao_Paulo");
  const avatarIdVal = profile.avatarId || profile.profilePhoto || existingLocal?.avatarId || existingLocal?.profilePhoto || "";

  const enrichedProfile = {
    ...existingLocal,
    ...profile,
    uid: activeUid || profile.uid || existingLocal?.uid || "",
    userId: activeUid || profile.userId || existingLocal?.userId || "",
    email: mailKey,
    name: validName,
    displayName: (profile.displayName && profile.displayName !== "Viajante Estelar" && profile.displayName !== "Buscador") ? profile.displayName : (existingLocal?.displayName || validName),
    birthName: (profile.birthName && profile.birthName !== "Viajante Estelar" && profile.birthName !== "Buscador") ? profile.birthName : (existingLocal?.birthName || validName),
    profileName: (profile.profileName && profile.profileName !== "Viajante Estelar" && profile.profileName !== "Buscador") ? profile.profileName : (existingLocal?.profileName || validName),
    avatarId: avatarIdVal,
    profilePhoto: avatarIdVal,
    preferredLanguage: profile.preferredLanguage || existingLocal?.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
    scorePoints: pointsVal,
    stellarPoints: pointsVal,
    birthDate: birthDateVal,
    birthTime: birthTimeVal,
    birthCity: birthCityVal,
    currentChartId: profile.currentChartId || existingLocal?.currentChartId || "",
    hasCreatedMap: profile.hasCreatedMap ?? (!!birthDateVal && !!birthCityVal),
    latitude: profile.latitude !== undefined ? profile.latitude : (existingLocal?.latitude ?? -23.55052),
    longitude: profile.longitude !== undefined ? profile.longitude : (existingLocal?.longitude ?? -46.633308),
    isPremium: profile.isPremium !== undefined ? profile.isPremium : (existingLocal?.isPremium ?? false),
    followersCount: profile.followersCount !== undefined ? profile.followersCount : (existingLocal?.followersCount ?? 0),
    followingCount: profile.followingCount !== undefined ? profile.followingCount : (existingLocal?.followingCount ?? 0),
    likesCount: profile.likesCount !== undefined ? profile.likesCount : (existingLocal?.likesCount ?? 0),
    friendsCount: profile.friendsCount !== undefined ? profile.friendsCount : (existingLocal?.friendsCount ?? 0),
    schemaVersion: profile.schemaVersion || existingLocal?.schemaVersion || "1.0.0",
    createdAt: profile.createdAt || existingLocal?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem("orbi_user_profile", JSON.stringify(enrichedProfile));
  
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}`;
    try {
      const userRef = doc(db, "users", docKey);
      console.log(`[FIRESTORE_WRITE_DEBUG] [saveProfileToDatabase] Starting setDoc to path: ${path}`, {
        docKey,
        activeUid,
        authUid: auth?.currentUser?.uid,
        authEmail: auth?.currentUser?.email
      });
      await setDoc(userRef, sanitizeFirestoreData(enrichedProfile), { merge: true });
      console.log(`[FIRESTORE_WRITE_DEBUG] [saveProfileToDatabase] setDoc SUCCESS for path: ${path}`);

      // Also save to the pointsTracker subcollection as a dedicated record for auditing and durability
      const trackerPath = `users/${docKey}/pointsTracker/current`;
      try {
        const trackerRef = doc(db, "users", docKey, "pointsTracker", "current");
        await setDoc(trackerRef, {
          scorePoints: pointsVal,
          stellarPoints: pointsVal,
          updatedAt: new Date().toISOString(),
          email: mailKey,
          uid: activeUid || ""
        }, { merge: true });
        console.log(`[FIRESTORE_WRITE_DEBUG] [saveProfileToDatabase] pointsTracker setDoc SUCCESS for path: ${trackerPath}`);
      } catch (trackerErr: any) {
        console.warn(`[FIRESTORE_WRITE_DEBUG] [saveProfileToDatabase] pointsTracker setDoc warning for path: ${trackerPath}`, trackerErr);
      }
    } catch (e: any) {
      console.error(`[FIRESTORE_WRITE_DEBUG] [saveProfileToDatabase] setDoc FAILED for path: ${path}`, {
        error: e?.message || String(e),
        code: e?.code,
        stack: e?.stack
      });
      handleFirestoreError(e, OperationType.WRITE, path);
      throw e;
    }
  }
}

export async function migrateLegacyUserSubcollections(db: any, mailKey: string, uid: string, email: string) {
  const SUBCOLLECTIONS_TO_MIGRATE = [
    "natalCharts",
    "transits",
    "dailyInsights",
    "weeklyInsights",
    "dreams",
    "extraMaps",
    "missions",
    "tarotReadings",
    "tarotHistory",
    "numerology",
    "prosperityMaps",
    "biorhythm",
    "lunarNodes",
    "notifications",
    "subscriptions",
    "cache",
    "premium",
    "stellarPoints",
    "profile",
    "settings",
    "statistics",
    "compatibilityHistory",
    "cupidoFavorites",
    "cupidoHistory",
    "cupidoSettings",
    "cupidoPeople",
    "pointsTracker"
  ];

  console.log(`[Migration] Iniciando migração de subcoleções de e-mail (${mailKey}) para UID (${uid})`);

  for (const subColName of SUBCOLLECTIONS_TO_MIGRATE) {
    try {
      const oldColRef = collection(db, "users", mailKey, subColName);
      const oldDocsSnap = await getDocs(oldColRef);
      
      if (!oldDocsSnap.empty) {
        console.log(`[Migration] Migrando ${oldDocsSnap.size} documentos da subcoleção "${subColName}" para nova conta`);
        for (const subDoc of oldDocsSnap.docs) {
          const data = subDoc.data();
          // Atualiza links de ID ou de email interno para o novo UID do Auth
          if (data.userId && (data.userId === mailKey || data.userId.toLowerCase().trim() === email.toLowerCase().trim())) {
            data.userId = uid;
          }
          const newDocRef = doc(db, "users", uid, subColName, subDoc.id);
          await setDoc(newDocRef, data, { merge: true });
          
          // Deleta documento antigo somente após a cópia bem-sucedida para máxima segurança
          await deleteDoc(subDoc.ref).catch(e => {
            console.warn(`[Migration] Falha ao remover documento antigo em ${subColName}/${subDoc.id}:`, e);
          });
        }
      }
    } catch (e) {
      console.error(`[Migration] Falha ao migrar a subcoleção ${subColName}:`, e);
    }
  }
}

export async function loadProfileFromDatabase(email: string, explicitUid?: string): Promise<UserProfileData | null> {
  const mailKey = email.toLowerCase().trim();
  const db = getFirestoreDB();
  if (!db) return null;

  const auth = getFirebaseAuth();
  const uid = explicitUid || auth?.currentUser?.uid || (email && !email.includes("@") ? email : localStorage.getItem("orbi_logged_uid"));

  if (!uid) {
    console.warn("[Sync] loadProfileFromDatabase chamado sem UID válido.");
    return null;
  }

  const path = `users/${uid}`;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDocWithTimeout(userRef);
    if (snap.exists()) {
      const remote = snap.data() as UserProfileData;

      let local: UserProfileData | null = null;
      try {
        const saved = localStorage.getItem("orbi_user_profile");
        if (saved) local = JSON.parse(saved);
      } catch (_) {}

      const merged = mergeProfileData(local, remote);
      localStorage.setItem("orbi_user_profile", JSON.stringify(merged));

      // If local was newer, upload merged to Firestore
      const localTime = local && local.updatedAt ? new Date(local.updatedAt).getTime() : 0;
      const remoteTime = remote && remote.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
      if (localTime > remoteTime) {
        console.log("[Sync Engine] Local profile is newer, uploading merged profile to Firestore...");
        await setDoc(userRef, sanitizeFirestoreData(merged), { merge: true });
      }

      return merged;
    }
  } catch (e: any) {
    console.warn(`[Sync] Leitura do perfil por UID (${uid}) falhou:`, e);
    if (e?.code || e?.message?.includes('permission')) {
      handleFirestoreError(e, OperationType.GET, path);
    }
  }

  const saved = localStorage.getItem("orbi_user_profile");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed) return parsed;
    } catch (_) {}
  }

  return null;
}

export async function loadPremiumSubscription(uid: string): Promise<any | null> {
  const db = getFirestoreDB();
  if (!db || !uid) return null;
  try {
    const subRef = doc(db, "users", uid, "premium", "status");
    const snap = await getDocWithTimeout(subRef);
    if (snap.exists()) {
      return snap.data();
    }
    const subRefAlt = doc(db, "users", uid, "premium", "subscription");
    const snapAlt = await getDocWithTimeout(subRefAlt);
    if (snapAlt.exists()) {
      return snapAlt.data();
    }
  } catch (err) {
    console.warn("[Firebase Client] Error loading premium sub document:", err);
  }
  return null;
}

// Helper to calculate exact cache expiration times
export function getCacheExpiration(cacheId: string): string {
  const now = new Date();
  
  // Daily contents
  if (
    cacheId.includes('daily') || 
    cacheId.includes('day') || 
    cacheId.includes('moontip') || 
    cacheId.includes('mission') || 
    cacheId.includes('dashboard') ||
    cacheId.match(/\d{4}-\d{2}-\d{2}/)
  ) {
    // Expires at midnight tonight (23:59:59.999) in local user system time
    const expires = new Date();
    expires.setHours(23, 59, 59, 999);
    return expires.toISOString();
  }
  
  // Weekly contents
  if (cacheId.includes('weekly') || cacheId.includes('week')) {
    // Expires at the end of the current week (Sunday 23:59:59.999)
    const expires = new Date();
    const day = expires.getDay();
    const distanceToSunday = 7 - (day === 0 ? 7 : day);
    expires.setDate(expires.getDate() + distanceToSunday);
    expires.setHours(23, 59, 59, 999);
    return expires.toISOString();
  }
  
  // Monthly contents
  if (cacheId.includes('monthly') || cacheId.includes('month') || cacheId.includes('prosperity')) {
    // Expires at the end of the current month
    const expires = new Date();
    const lastDay = new Date(expires.getFullYear(), expires.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    return lastDay.toISOString();
  }
  
  // Permanent / Other data: default 1 year (365 days)
  const expires = new Date();
  expires.setDate(expires.getDate() + 365);
  return expires.toISOString();
}

// Automatic Cache Expiration Check Helper (supports expiresAt metadata)
export function isCacheExpired(cacheId: string, updatedAtStr: string, expiresAtStr?: string): boolean {
  if (expiresAtStr) {
    try {
      return new Date() > new Date(expiresAtStr);
    } catch {}
  }
  if (!updatedAtStr) return true;
  try {
    const updatedAt = new Date(updatedAtStr);
    const now = new Date();
    
    // Daily cache matches
    if (
      cacheId.includes('daily') || 
      cacheId.includes('day') || 
      cacheId.includes('moontip') || 
      cacheId.includes('mission') || 
      cacheId.includes('dashboard') ||
      cacheId.match(/\d{4}-\d{2}-\d{2}/)
    ) {
      return updatedAt.getDate() !== now.getDate() ||
             updatedAt.getMonth() !== now.getMonth() ||
             updatedAt.getFullYear() !== now.getFullYear();
    }
    
    // Weekly cache matches
    if (cacheId.includes('weekly') || cacheId.includes('week')) {
      const getWeekNumber = (d: Date) => {
        const start = new Date(d.getFullYear(), 0, 1);
        const diff = d.getTime() - start.getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.ceil((diff / oneDay + start.getDay() + 1) / 7);
      };
      return getWeekNumber(updatedAt) !== getWeekNumber(now) ||
             updatedAt.getFullYear() !== now.getFullYear();
    }
    
    // Monthly cache matches
    if (cacheId.includes('monthly') || cacheId.includes('month') || cacheId.includes('prosperity')) {
      return updatedAt.getMonth() !== now.getMonth() ||
             updatedAt.getFullYear() !== now.getFullYear();
    }
  } catch (e) {
    return true;
  }
  return false;
}

// Intelligent caching system for astronomical & numerological calculations
export async function saveCalculationCache(email: string, cacheId: string, data: any): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey || !cacheId) return;

  const docKey = getUserDocKey(email);
  const now = new Date();
  const nowIso = now.toISOString();
  const expiryIso = getCacheExpiration(cacheId);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Build the complete rich cache metadata object
  const cachePayload = {
    id: cacheId,
    userId: docKey,
    module: cacheId.split('_')[0] || "general",
    generatedAt: nowIso,
    expiresAt: expiryIso,
    schemaVersion: "1.0.0",
    lastUpdate: nowIso,
    contentVersion: "1.0.0",
    timezone: tz,
    data: data,
    updatedAt: nowIso
  };

  // Sync to local storage for local offline redundancy/speed
  const storageKey = `orbi_calc_cache_${mailKey}_${cacheId}`;
  localStorage.setItem(storageKey, JSON.stringify(cachePayload));

  // Sync to Firestore
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/cache/${cacheId}`;
    try {
      const cacheRef = doc(db, "users", docKey, "cache", cacheId);
      await setDoc(cacheRef, cachePayload, { merge: true });
      console.log(`[Cache] Cálculo '${cacheId}' gravado com sucesso no Firestore. [Chave: ${docKey}]`);
    } catch (e) {
      console.warn(`[Cache] Erro ao gravar '${cacheId}' no Firestore. Usando redundância local.`);
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadCalculationCache(email: string, cacheId: string): Promise<any | null> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey || !cacheId) return null;

  const storageKey = `orbi_calc_cache_${mailKey}_${cacheId}`;
  const savedLocal = localStorage.getItem(storageKey);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const nowIso = now.toISOString();
  const expiryIso = getCacheExpiration(cacheId);

  let localPayload: any = null;
  if (savedLocal) {
    try {
      localPayload = JSON.parse(savedLocal);
    } catch {}
  }

  const isLocalValid = localPayload && localPayload.expiresAt && !isCacheExpired(cacheId, localPayload.updatedAt || localPayload.lastUpdate, localPayload.expiresAt);

  // 1. If local cache is valid, return IMMEDIATELY (0ms block!) and synchronize silently in the background
  if (isLocalValid) {
    console.log(`[Cache] Returning instant local cache for '${cacheId}'`);

    const db = getFirestoreDB();
    if (db) {
      setTimeout(async () => {
        try {
          const docKey = getUserDocKey(email);
          const cacheRef = doc(db, "users", docKey, "cache", cacheId);
          const snap = await getDoc(cacheRef);
          if (snap.exists()) {
            const docData = snap.data();
            if (docData && docData.data) {
              const firestoreExpiresAt = docData.expiresAt;
              const isFirestoreExpired = isCacheExpired(cacheId, docData.updatedAt || docData.lastUpdate, firestoreExpiresAt);
              
              if (!isFirestoreExpired) {
                const firestoreDataStr = JSON.stringify(docData.data);
                const localDataStr = JSON.stringify(localPayload.data);
                
                if (firestoreDataStr !== localDataStr) {
                  console.log(`[Cache Silent Sync] Firestore cache updated/differs for '${cacheId}'. Updating locally...`);
                  const updatedPayload = {
                    ...localPayload,
                    ...docData,
                    updatedAt: docData.updatedAt || nowIso
                  };
                  localStorage.setItem(storageKey, JSON.stringify(updatedPayload));
                  
                  // Notify UI components dynamically
                  window.dispatchEvent(new CustomEvent(`orbi_cache_updated_${cacheId}`, {
                    detail: { cacheId, data: docData.data }
                  }));
                }
              }
            }
          } else {
            // Firestore missing but local is valid -> write back to Firestore silently
            console.log(`[Cache Silent Sync] Firestore missing valid cache for '${cacheId}'. Syncing local to server...`);
            const docKey = getUserDocKey(email);
            const cacheRef = doc(db, "users", docKey, "cache", cacheId);
            await setDoc(cacheRef, {
              ...localPayload,
              userId: docKey
            }, { merge: true });
          }
        } catch (err) {
          console.warn(`[Cache Silent Sync] Background sync failed for '${cacheId}':`, err);
        }
      }, 500);
    }

    return localPayload.data;
  }

  // 2. If local cache is missing or expired, fetch from Firestore synchronously (with timeout)
  const db = getFirestoreDB();
  if (db) {
    const docKey = getUserDocKey(email);
    const path = `users/${docKey}/cache/${cacheId}`;
    try {
      const cacheRef = doc(db, "users", docKey, "cache", cacheId);
      const snap = await getDocWithTimeout(cacheRef, 3000);
      if (snap.exists()) {
        const docData = snap.data();
        if (docData && docData.data) {
          const firestoreExpiresAt = docData.expiresAt || docData.updatedAt;
          const isFirestoreExpired = isCacheExpired(cacheId, docData.updatedAt || docData.lastUpdate, firestoreExpiresAt);
          
          if (!isFirestoreExpired) {
            console.log(`[Cache] Loaded valid cache from Firestore for '${cacheId}'`);
            const newPayload = {
              id: cacheId,
              userId: docKey,
              module: docData.module || cacheId.split('_')[0] || "general",
              generatedAt: docData.generatedAt || docData.updatedAt || nowIso,
              expiresAt: docData.expiresAt || expiryIso,
              schemaVersion: docData.schemaVersion || "1.0.0",
              lastUpdate: docData.lastUpdate || docData.updatedAt || nowIso,
              contentVersion: docData.contentVersion || "1.0.0",
              timezone: docData.timezone || tz,
              data: docData.data,
              updatedAt: docData.updatedAt || nowIso
            };
            localStorage.setItem(storageKey, JSON.stringify(newPayload));
            return docData.data;
          } else {
            console.log(`[Cache Invalidation] Firestore cache '${cacheId}' is expired. Deleting stale copy...`);
            deleteDoc(cacheRef).catch(console.warn);
            localStorage.removeItem(storageKey);
          }
        }
      }
    } catch (e) {
      console.warn(`[Cache] Firestore fetch failed or timed out for '${cacheId}'.`);
      handleFirestoreError(e, OperationType.GET, path);
    }
  }

  // 3. Absolute offline/recovery fallback: if we have stale/expired local data, use it as a last resort
  if (localPayload && localPayload.data) {
    console.log(`[Cache Offline Fallback] Using stale local cache for '${cacheId}' due to network state.`);
    return localPayload.data;
  }

  return null;
}

export async function clearCalculationCache(email: string): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  // Clear local storage keys
  const keysToClear = [
    `orbi_calc_cache_${mailKey}_natal_chart`,
    `orbi_calc_cache_${mailKey}_weekly_transits_`,
    `orbi_calc_cache_${mailKey}_daily_osiris_dashboard_`,
    `orbi_calc_cache_${mailKey}_daily_missions_`,
    `orbi_calc_cache_${mailKey}_daily_moontip_`
  ];
  
  // Clear precise prefix keys
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith(`orbi_calc_cache_${mailKey}_`) || 
      key.startsWith(`orbi_calc_cache_${mailKey}_daily_`) || 
      key.startsWith(`orbi_calc_cache_${mailKey}_weekly_`)
    )) {
      localStorage.removeItem(key);
    }
  }

  const db = getFirestoreDB();
  if (db) {
    const docKey = getUserDocKey(email);
    try {
      const docIds = ["natal_chart", "weekly_transits"];
      for (const id of docIds) {
        await deleteDoc(doc(db, "users", docKey, "cache", id));
      }
      
      const todayStr = new Date().toISOString().split('T')[0];
      await deleteDoc(doc(db, "users", docKey, "cache", `daily_osiris_dashboard_${todayStr}`));
      await deleteDoc(doc(db, "users", docKey, "cache", `daily_missions_${todayStr}`));
      await deleteDoc(doc(db, "users", docKey, "cache", `daily_moontip_${todayStr}`));
      
      console.log(`[Cache] Cache de cálculos limpos para o usuário ${docKey}.`);
    } catch (e) {
      console.warn("[Cache] Erro ao deletar cache no Firestore:", e);
    }
  }
}

// Real-Time Listener for User Profile
export function subscribeToUserProfile(email: string, onUpdate: (profile: UserProfileData | null) => void, onError?: (err: Error) => void) {
  const mailKey = email.toLowerCase().trim();
  const db = getFirestoreDB();
  if (!db || !mailKey) {
    // If offline / no configuration, return dummy unsubscribe
    return () => {};
  }

  const docKey = getUserDocKey(email);
  const path = `users/${docKey}`;
  const docRef = doc(db, "users", docKey);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfileData;
      localStorage.setItem("orbi_user_profile", JSON.stringify(data));
      onUpdate(data);
    } else {
      onUpdate(null);
    }
  }, (error) => {
    console.error("[SnapSync] Erro no snapshot do perfil:", error);
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (transformed) {
      if (onError && transformed instanceof Error) onError(transformed);
    }
  });
}

// User-scoped localStorage helpers for Extra Maps & Dreams
function getExtraMapsStorageKey(email: string): string {
  const docKey = getUserDocKey(email);
  return docKey ? `orbi_extra_maps_${docKey}` : `orbi_extra_maps_guest`;
}

function getDreamsStorageKey(email: string): string {
  const docKey = getUserDocKey(email);
  return docKey ? `star_map_dreams_${docKey}` : `star_map_dreams_guest`;
}

// 2. Extra Maps Sync & Real-Time Subscriber
export async function saveExtraMapToDatabase(email: string, extraMap: ExtraMapItem) {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getExtraMapsStorageKey(email);

  const savedList = localStorage.getItem(storageKey);
  let currentList: ExtraMapItem[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(m => m.id !== extraMap.id);
  currentList.push(extraMap);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/extraMaps/${extraMap.id}`;
    try {
      const mapRef = doc(db, "users", docKey, "extraMaps", extraMap.id);
      await setDoc(mapRef, {
        ...extraMap,
        userId: docKey
      });
    } catch (e) {
      console.warn("[Sync] Gravação de mapa extra diferida.");
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function deleteExtraMapFromDatabase(email: string, mapId: string) {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getExtraMapsStorageKey(email);

  const savedList = localStorage.getItem(storageKey);
  let currentList: ExtraMapItem[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(m => m.id !== mapId);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/extraMaps/${mapId}`;
    try {
      const mapRef = doc(db, "users", docKey, "extraMaps", mapId);
      await deleteDoc(mapRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  }
}

export async function loadExtraMapsFromDatabase(email: string): Promise<ExtraMapItem[]> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return [];

  const storageKey = getExtraMapsStorageKey(email);
  const db = getFirestoreDB();
  if (db) {
    const docKey = getUserDocKey(email);
    if (!docKey) return [];
    const path = `users/${docKey}/extraMaps`;
    try {
      const colRef = collection(db, "users", docKey, "extraMaps");
      const snap = await getDocs(colRef);
      const results: ExtraMapItem[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data() as ExtraMapItem);
      });
      localStorage.setItem(storageKey, JSON.stringify(results));
      return results;
    } catch (e) {
      console.warn(`[Sync] Load Extra Maps deferred for ${path}:`, e);
    }
  }

  const savedList = localStorage.getItem(storageKey);
  if (savedList) {
    try {
      return JSON.parse(savedList);
    } catch {}
  }
  return [];
}

// Real-Time Listener for User Extra Maps Collection
export function subscribeToExtraMaps(email: string, onUpdate: (maps: ExtraMapItem[]) => void, onError?: (err: Error) => void) {
  const mailKey = email.toLowerCase().trim();
  const db = getFirestoreDB();
  if (!db || !mailKey) {
    return () => {};
  }

  const docKey = getUserDocKey(email);
  const storageKey = getExtraMapsStorageKey(email);
  const path = `users/${docKey}/extraMaps`;
  const collectionRef = collection(db, "users", docKey, "extraMaps");

  return onSnapshot(collectionRef, (snapshot) => {
    const results: ExtraMapItem[] = [];
    snapshot.forEach((snap) => {
      results.push(snap.data() as ExtraMapItem);
    });
    localStorage.setItem(storageKey, JSON.stringify(results));
    onUpdate(results);
  }, (error) => {
    console.error("[SnapSync] Erro no snapshot de extraMaps:", error);
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (transformed) {
      if (onError && transformed instanceof Error) onError(transformed);
    }
  });
}

// Real-Time Listener for User Natal Charts
export function subscribeToNatalCharts(email: string, onUpdate: (charts: any[]) => void, onError?: (err: Error) => void) {
  const mailKey = email.toLowerCase().trim();
  const db = getFirestoreDB();
  if (!db || !mailKey) {
    return () => {};
  }

  const docKey = getUserDocKey(email);
  const path = `users/${docKey}/natalCharts`;
  const collectionRef = collection(db, "users", docKey, "natalCharts");

  return onSnapshot(collectionRef, (snapshot) => {
    const results: any[] = [];
    snapshot.forEach((snap) => {
      results.push({
        id: snap.id,
        ...snap.data()
      });
    });
    onUpdate(results);
  }, (error) => {
    console.error("[SnapSync] Erro no snapshot de natalCharts:", error);
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (transformed) {
      if (onError && transformed instanceof Error) onError(transformed);
    }
  });
}

// Real-Time Listener for User Transits
export function subscribeToTransits(email: string, onUpdate: (transits: any[]) => void, onError?: (err: Error) => void) {
  const mailKey = email.toLowerCase().trim();
  const db = getFirestoreDB();
  if (!db || !mailKey) {
    return () => {};
  }

  const docKey = getUserDocKey(email);
  const path = `users/${docKey}/transits`;
  const collectionRef = collection(db, "users", docKey, "transits");

  return onSnapshot(collectionRef, (snapshot) => {
    const results: any[] = [];
    snapshot.forEach((snap) => {
      results.push(snap.data());
    });
    onUpdate(results);
  }, (error) => {
    console.error("[SnapSync] Erro no snapshot de transits:", error);
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (transformed) {
      if (onError && transformed instanceof Error) onError(transformed);
    }
  });
}

// Real-Time Listener for User Numerology
export function subscribeToNumerology(email: string, onUpdate: (numerology: any[]) => void, onError?: (err: Error) => void) {
  const mailKey = email.toLowerCase().trim();
  const db = getFirestoreDB();
  if (!db || !mailKey) {
    return () => {};
  }

  const docKey = getUserDocKey(email);
  const path = `users/${docKey}/numerology`;
  const collectionRef = collection(db, "users", docKey, "numerology");

  return onSnapshot(collectionRef, (snapshot) => {
    const results: any[] = [];
    snapshot.forEach((snap) => {
      results.push(snap.data());
    });
    onUpdate(results);
  }, (error) => {
    console.error("[SnapSync] Erro no snapshot de numerology:", error);
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (transformed) {
      if (onError && transformed instanceof Error) onError(transformed);
    }
  });
}

// 3. Dreams Sync & Real-Time Subscriber
export async function saveDreamToDatabase(email: string, dream: DreamLogItem) {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getDreamsStorageKey(email);

  const savedList = localStorage.getItem(storageKey);
  let currentList: DreamLogItem[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(d => d.id !== dream.id);
  currentList.push(dream);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/dreams/${dream.id}`;
    try {
      const dreamRef = doc(db, "users", docKey, "dreams", dream.id);
      await setDoc(dreamRef, {
        ...dream,
        userId: docKey
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function deleteDreamFromDatabase(email: string, dreamId: string) {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getDreamsStorageKey(email);

  const savedList = localStorage.getItem(storageKey);
  let currentList: DreamLogItem[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(d => d.id !== dreamId);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/dreams/${dreamId}`;
    try {
      const dreamRef = doc(db, "users", docKey, "dreams", dreamId);
      await deleteDoc(dreamRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  }
}

export async function loadDreamsFromDatabase(email: string): Promise<DreamLogItem[]> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return [];

  const storageKey = getDreamsStorageKey(email);
  const db = getFirestoreDB();
  if (db) {
    const docKey = getUserDocKey(email);
    if (!docKey) return [];
    const path = `users/${docKey}/dreams`;
    try {
      const colRef = collection(db, "users", docKey, "dreams");
      const snap = await getDocs(colRef);
      const results: DreamLogItem[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data() as DreamLogItem);
      });
      localStorage.setItem(storageKey, JSON.stringify(results));
      return results;
    } catch (e) {
      console.warn(`[Sync] Load Dreams deferred for ${path}:`, e);
    }
  }

  const savedList = localStorage.getItem(storageKey);
  if (savedList) {
    try {
      return JSON.parse(savedList);
    } catch {}
  }
  return [];
}

// Real-Time Listener for Dreams Subcollection
export function subscribeToDreams(email: string, onUpdate: (dreams: DreamLogItem[]) => void, onError?: (err: Error) => void) {
  const mailKey = email.toLowerCase().trim();
  const db = getFirestoreDB();
  if (!db || !mailKey) {
    return () => {};
  }

  const docKey = getUserDocKey(email);
  const storageKey = getDreamsStorageKey(email);
  const path = `users/${docKey}/dreams`;
  const collectionRef = collection(db, "users", docKey, "dreams");

  return onSnapshot(collectionRef, (snapshot) => {
    const results: DreamLogItem[] = [];
    snapshot.forEach((snap) => {
      results.push(snap.data() as DreamLogItem);
    });
    localStorage.setItem(storageKey, JSON.stringify(results));
    onUpdate(results);
  }, (error) => {
    console.error("[SnapSync] Erro no snapshot de dreams:", error);
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (transformed) {
      if (onError && transformed instanceof Error) onError(transformed);
    }
  });
}

// -------------------------------------------------------------------------
// COMPREHENSIVE ASTROLOGICAL DATA PERSISTENCE LAYER (CLOUDFLERE & LOCAL)
// -------------------------------------------------------------------------

export async function saveNatalChartToDatabase(email: string, chartId: string, chartData: any) {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey || !chartId) return;

  const docKey = getUserDocKey(email);
  const cacheKey = `orbi_natal_chart_${docKey}_${chartId}`;
  localStorage.setItem(cacheKey, JSON.stringify(chartData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/natalCharts/${chartId}`;
    const auth = getFirebaseAuth();
    try {
      // 1. CLEAR PREVIOUS NATAL CHARTS (where ID is different)
      const chartsColRef = collection(db, "users", docKey, "natalCharts");
      const chartsSnap = await getDocs(chartsColRef);
      for (const docSnap of chartsSnap.docs) {
        if (docSnap.id !== chartId) {
          console.log(`[FIRESTORE_CLEANUP] Deleting old natalChart document: ${docSnap.id} to avoid conflicts`);
          await deleteDoc(doc(db, "users", docKey, "natalCharts", docSnap.id));
        }
      }

      // 2. CLEAR PREVIOUS TRANSITS from Firestore
      const transitsColRef = collection(db, "users", docKey, "transits");
      try {
        const transitsSnap = await getDocs(transitsColRef);
        for (const docSnap of transitsSnap.docs) {
          console.log(`[FIRESTORE_CLEANUP] Deleting old transit document: ${docSnap.id} to avoid transit predictions mismatch`);
          await deleteDoc(doc(db, "users", docKey, "transits", docSnap.id));
        }
      } catch (err) {
        console.warn(`[FIRESTORE_CLEANUP] Failed to clear transits docs:`, err);
      }

      // 3. CLEAN UP LOCALSTORAGE CACHES
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const lowerKey = key.toLowerCase();
            if (
              (lowerKey.startsWith(`orbi_natal_chart_${docKey.toLowerCase()}_`) && !lowerKey.includes(chartId.toLowerCase())) ||
              (lowerKey.startsWith(`orbi_natal_chart_${mailKey}_`) && !lowerKey.includes(chartId.toLowerCase())) ||
              lowerKey.startsWith(`orbi_transit_${docKey.toLowerCase()}_`) ||
              lowerKey.startsWith(`orbi_transit_${mailKey}_`) ||
              lowerKey === "orbi_map_data" ||
              lowerKey === `orbi_map_data_${docKey.toLowerCase()}` ||
              lowerKey === `orbi_map_data_${mailKey}` ||
              lowerKey === "orbi_natal_chart_data"
            ) {
              keysToRemove.push(key);
            }
          }
        }
        for (const k of keysToRemove) {
          console.log(`[FIRESTORE_CLEANUP] Removing old cached item from localStorage: ${k}`);
          localStorage.removeItem(k);
        }
      } catch (err) {
        console.warn(`[FIRESTORE_CLEANUP] LocalStorage cleanup error:`, err);
      }

      const docRef = doc(db, "users", docKey, "natalCharts", chartId);
      console.log(`[FIRESTORE_WRITE_DEBUG] [saveNatalChartToDatabase] Starting setDoc to path: ${path}`, {
        chartId,
        docKey,
        authUid: auth?.currentUser?.uid,
        authEmail: auth?.currentUser?.email
      });
      await setDoc(docRef, sanitizeFirestoreData({
        id: chartId,
        userId: docKey,
        ...chartData,
        updatedAt: new Date().toISOString()
      }), { merge: true });
      console.log(`[FIRESTORE_WRITE_DEBUG] [saveNatalChartToDatabase] setDoc SUCCESS for path: ${path}`);

      // Sync root user profile document so users/{docKey} always holds active birth details
      if (chartData.birthDate && chartData.birthCity) {
        const userRef = doc(db, "users", docKey);
        await setDoc(userRef, sanitizeFirestoreData({
          birthDate: chartData.birthDate,
          birthTime: chartData.birthTime || "12:00",
          birthCity: chartData.birthCity,
          isUnknownTime: chartData.isUnknownTime ?? false,
          currentChartId: chartId,
          hasCreatedMap: true,
          updatedAt: new Date().toISOString()
        }), { merge: true }).catch(err => console.warn("[Sync] Root profile sync from natal chart failed:", err));
      }
    } catch (e: any) {
      console.error(`[FIRESTORE_WRITE_DEBUG] [saveNatalChartToDatabase] setDoc FAILED for path: ${path}`, {
        error: e?.message || String(e),
        code: e?.code,
        stack: e?.stack
      });
      handleFirestoreError(e, OperationType.WRITE, path);
      throw e;
    }
  }
}

export async function loadNatalChartFromDatabase(email: string, chartId: string): Promise<any | null> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey || !chartId) return null;

  const docKey = getUserDocKey(email);
  if (!docKey) return null;
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/natalCharts/${chartId}`;
    try {
      const docRef = doc(db, "users", docKey, "natalCharts", chartId);
      const snap = await getDocWithTimeout(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_natal_chart_${docKey}_${chartId}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn(`[Sync] Natal Chart read failed: ${path}`, e);
    }
  }

  const local = localStorage.getItem(`orbi_natal_chart_${docKey}_${chartId}`);
  return local ? JSON.parse(local) : null;
}

export async function loadAllNatalCharts(email: string): Promise<any[]> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return [];

  const docKey = getUserDocKey(email);
  if (!docKey) return [];
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/natalCharts`;
    try {
      const colRef = collection(db, "users", docKey, "natalCharts");
      const snap = await getDocs(colRef);
      const results: any[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data());
      });
      return results;
    } catch (e) {
      console.warn(`[Sync] Load Natal Charts failed: ${path}`, e);
    }
  }
  return [];
}

export async function saveTransitToDatabase(email: string, transitId: string, transitData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !transitId) return;

  localStorage.setItem(`orbi_transit_${docKey}_${transitId}`, JSON.stringify(transitData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/transits/${transitId}`;
    try {
      const docRef = doc(db, "users", docKey, "transits", transitId);
      await setDoc(docRef, {
        id: transitId,
        userId: docKey,
        ...transitData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadTransitFromDatabase(email: string, transitId: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey || !transitId) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "transits", transitId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_transit_${docKey}_${transitId}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_transit_${docKey}_${transitId}`);
  return local ? JSON.parse(local) : null;
}

export async function saveDailyInsightToDatabase(email: string, insightId: string, insightData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !insightId) return;

  localStorage.setItem(`orbi_daily_insight_${docKey}_${insightId}`, JSON.stringify(insightData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/dailyInsights/${insightId}`;
    try {
      const docRef = doc(db, "users", docKey, "dailyInsights", insightId);
      await setDoc(docRef, {
        id: insightId,
        userId: docKey,
        insightData,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadDailyInsightFromDatabase(email: string, insightId: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey || !insightId) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "dailyInsights", insightId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_daily_insight_${docKey}_${insightId}`, JSON.stringify(data.insightData));
        return data.insightData;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_daily_insight_${docKey}_${insightId}`);
  return local ? JSON.parse(local) : null;
}

export async function saveWeeklyInsightToDatabase(email: string, insightId: string, weeklyData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !insightId) return;

  localStorage.setItem(`orbi_weekly_insight_${docKey}_${insightId}`, JSON.stringify(weeklyData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/weeklyInsights/${insightId}`;
    try {
      const docRef = doc(db, "users", docKey, "weeklyInsights", insightId);
      await setDoc(docRef, {
        id: insightId,
        userId: docKey,
        weeklyData,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadWeeklyInsightFromDatabase(email: string, insightId: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey || !insightId) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "weeklyInsights", insightId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_weekly_insight_${docKey}_${insightId}`, JSON.stringify(data.weeklyData));
        return data.weeklyData;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_weekly_insight_${docKey}_${insightId}`);
  return local ? JSON.parse(local) : null;
}

export async function saveMissionToDatabase(email: string, missionId: string, missionsList: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !missionId) return;

  localStorage.setItem(`orbi_missions_${docKey}_${missionId}`, JSON.stringify(missionsList));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/missions/${missionId}`;
    try {
      const docRef = doc(db, "users", docKey, "missions", missionId);
      await setDoc(docRef, {
        id: missionId,
        userId: docKey,
        missionsList,
        date: missionId,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadMissionsFromDatabase(email: string, missionId: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey || !missionId) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "missions", missionId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_missions_${docKey}_${missionId}`, JSON.stringify(data.missionsList));
        return data.missionsList;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_missions_${docKey}_${missionId}`);
  return local ? JSON.parse(local) : null;
}

export async function saveWeeklyMissionsToDatabase(email: string, weeklyMissionsList: any) {
  const docKey = getUserDocKey(email);
  if (!docKey) return;

  localStorage.setItem(`orbi_weekly_missions_${docKey}`, JSON.stringify(weeklyMissionsList));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/missions/weekly`;
    try {
      const docRef = doc(db, "users", docKey, "missions", "weekly");
      await setDoc(docRef, {
        id: "weekly",
        userId: docKey,
        weeklyMissionsList,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadWeeklyMissionsFromDatabase(email: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "missions", "weekly");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_weekly_missions_${docKey}`, JSON.stringify(data.weeklyMissionsList));
        return data.weeklyMissionsList;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_weekly_missions_${docKey}`);
  return local ? JSON.parse(local) : null;
}

export async function saveTarotReadingToDatabase(email: string, readingId: string, readingData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !readingId) return;

  localStorage.setItem(`orbi_tarot_${docKey}_${readingId}`, JSON.stringify(readingData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/tarotReadings/${readingId}`;
    try {
      const docRef = doc(db, "users", docKey, "tarotReadings", readingId);
      await setDoc(docRef, {
        id: readingId,
        userId: docKey,
        ...readingData,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadTarotReadingsFromDatabase(email: string): Promise<any[]> {
  const docKey = getUserDocKey(email);
  if (!docKey) return [];

  const db = getFirestoreDB();
  if (db) {
    try {
      const colRef = collection(db, "users", docKey, "tarotReadings");
      const snap = await getDocs(colRef);
      const results: any[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data());
      });
      return results;
    } catch (e) {}
  }
  return [];
}

export async function saveTarotHistoryToDatabase(email: string, historyId: string, historyData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !historyId) return;

  localStorage.setItem(`orbi_tarot_history_${docKey}_${historyId}`, JSON.stringify(historyData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/tarotHistory/${historyId}`;
    try {
      const docRef = doc(db, "users", docKey, "tarotHistory", historyId);
      await setDoc(docRef, {
        id: historyId,
        userId: docKey,
        ...historyData,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadTarotHistoryFromDatabase(email: string): Promise<any[]> {
  const docKey = getUserDocKey(email);
  if (!docKey) return [];

  const db = getFirestoreDB();
  if (db) {
    try {
      const colRef = collection(db, "users", docKey, "tarotHistory");
      const snap = await getDocs(colRef);
      const results: any[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data());
      });
      return results;
    } catch (e) {
      console.warn("Falha ao carregar historico de Tarot do Firestore:", e);
    }
  }
  return [];
}

export async function saveNumerologyToDatabase(email: string, numerologyId: string, numerologyData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !numerologyId) return;

  localStorage.setItem(`orbi_numerology_${docKey}_${numerologyId}`, JSON.stringify(numerologyData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/numerology/${numerologyId}`;
    try {
      // 1. CLEAR PREVIOUS NUMEROLOGIES (where ID is different)
      const numColRef = collection(db, "users", docKey, "numerology");
      const numSnap = await getDocs(numColRef);
      for (const docSnap of numSnap.docs) {
        if (docSnap.id !== numerologyId) {
          console.log(`[FIRESTORE_CLEANUP] Deleting old numerology document: ${docSnap.id} to avoid conflicts`);
          await deleteDoc(doc(db, "users", docKey, "numerology", docSnap.id));
        }
      }

      // 2. CLEAN UP LOCALSTORAGE CACHES
      try {
        const mailKey = email.toLowerCase().trim();
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const lowerKey = key.toLowerCase();
            if (
              (lowerKey.startsWith(`orbi_numerology_${docKey.toLowerCase()}_`) && !lowerKey.includes(numerologyId.toLowerCase())) ||
              (lowerKey.startsWith(`orbi_numerology_${mailKey}_`) && !lowerKey.includes(numerologyId.toLowerCase())) ||
              lowerKey === "orbi_numerology_data" ||
              lowerKey === `orbi_numerology_data_${docKey.toLowerCase()}` ||
              lowerKey === `orbi_numerology_data_${mailKey}`
            ) {
              keysToRemove.push(key);
            }
          }
        }
        for (const k of keysToRemove) {
          console.log(`[FIRESTORE_CLEANUP] Removing old cached numerology item from localStorage: ${k}`);
          localStorage.removeItem(k);
        }
      } catch (err) {
        console.warn(`[FIRESTORE_CLEANUP] LocalStorage cleanup warning:`, err);
      }

      const docRef = doc(db, "users", docKey, "numerology", numerologyId);
      await setDoc(docRef, {
        id: numerologyId,
        userId: docKey,
        ...numerologyData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadNumerologyFromDatabase(email: string, numerologyId: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey || !numerologyId) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "numerology", numerologyId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_numerology_${docKey}_${numerologyId}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_numerology_${docKey}_${numerologyId}`);
  return local ? JSON.parse(local) : null;
}

export async function saveProsperityMapToDatabase(email: string, prosperityId: string, prosperityData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !prosperityId) return;

  localStorage.setItem(`orbi_prosperity_${docKey}_${prosperityId}`, JSON.stringify(prosperityData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/prosperityMaps/${prosperityId}`;
    try {
      const docRef = doc(db, "users", docKey, "prosperityMaps", prosperityId);
      await setDoc(docRef, {
        id: prosperityId,
        userId: docKey,
        ...prosperityData,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadProsperityMapFromDatabase(email: string, prosperityId: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey || !prosperityId) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "prosperityMaps", prosperityId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_prosperity_${docKey}_${prosperityId}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_prosperity_${docKey}_${prosperityId}`);
  return local ? JSON.parse(local) : null;
}

export async function saveBiorhythmToDatabase(email: string, biorhythmId: string, biorhythmData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !biorhythmId) return;

  localStorage.setItem(`orbi_biorhythm_${docKey}_${biorhythmId}`, JSON.stringify(biorhythmData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/biorhythm/${biorhythmId}`;
    try {
      const docRef = doc(db, "users", docKey, "biorhythm", biorhythmId);
      await setDoc(docRef, {
        id: biorhythmId,
        userId: docKey,
        ...biorhythmData,
        computedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadBiorhythmFromDatabase(email: string, biorhythmId: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey || !biorhythmId) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "biorhythm", biorhythmId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_biorhythm_${docKey}_${biorhythmId}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_biorhythm_${docKey}_${biorhythmId}`);
  return local ? JSON.parse(local) : null;
}

export async function saveLunarNodesToDatabase(email: string, nodeId: string, nodeData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !nodeId) return;

  localStorage.setItem(`orbi_lunarnodes_${docKey}_${nodeId}`, JSON.stringify(nodeData));

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/lunarNodes/${nodeId}`;
    try {
      const docRef = doc(db, "users", docKey, "lunarNodes", nodeId);
      await setDoc(docRef, {
        id: nodeId,
        userId: docKey,
        ...nodeData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadLunarNodesFromDatabase(email: string, nodeId: string): Promise<any | null> {
  const docKey = getUserDocKey(email);
  if (!docKey || !nodeId) return null;

  const db = getFirestoreDB();
  if (db) {
    try {
      const docRef = doc(db, "users", docKey, "lunarNodes", nodeId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem(`orbi_lunarnodes_${docKey}_${nodeId}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {}
  }
  const local = localStorage.getItem(`orbi_lunarnodes_${docKey}_${nodeId}`);
  return local ? JSON.parse(local) : null;
}

export async function saveNotificationToDatabase(email: string, notificationId: string, notificationData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !notificationId) return;

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/notifications/${notificationId}`;
    try {
      const docRef = doc(db, "users", docKey, "notifications", notificationId);
      await setDoc(docRef, {
        id: notificationId,
        userId: docKey,
        ...notificationData,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadNotificationsFromDatabase(email: string): Promise<any[]> {
  const docKey = getUserDocKey(email);
  if (!docKey) return [];

  const db = getFirestoreDB();
  if (db) {
    try {
      const colRef = collection(db, "users", docKey, "notifications");
      const snap = await getDocs(colRef);
      const results: any[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data());
      });
      return results;
    } catch (e) {}
  }
  return [];
}

export async function saveSubscriptionToDatabase(email: string, subscriptionId: string, subscriptionData: any) {
  const docKey = getUserDocKey(email);
  if (!docKey || !subscriptionId) return;

  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/subscriptions/${subscriptionId}`;
    try {
      const docRef = doc(db, "users", docKey, "subscriptions", subscriptionId);
      await setDoc(docRef, {
        id: subscriptionId,
        userId: docKey,
        ...subscriptionData,
        startDate: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadSubscriptionsFromDatabase(email: string): Promise<any[]> {
  const docKey = getUserDocKey(email);
  if (!docKey) return [];

  const db = getFirestoreDB();
  if (db) {
    try {
      const colRef = collection(db, "users", docKey, "subscriptions");
      const snap = await getDocs(colRef);
      const results: any[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data());
      });
      return results;
    } catch (e) {}
  }
  return [];
}

// -------------------------------------------------------------------------
// REAL FIREBASE AUTHENTICATION FLOWS (WITH LOCAL SECURE RECONCILIATION)
// -------------------------------------------------------------------------
export async function registerWithEmailFirebase(email: string, pass: string): Promise<any> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("O Firebase Auth não está configurado. Cadastrando no modo offline nativo.");
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    return cred.user;
  } catch (error) {
    console.error("[Auth] Falha no cadastro Firebase:", error);
    throw error;
  }
}

export async function loginWithEmailFirebase(email: string, pass: string): Promise<any> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("O Firebase Auth não está configurado. Tente o acesso offline.");
  }
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return cred.user;
  } catch (error) {
    console.error("[Auth] Falha no login Firebase:", error);
    throw error;
  }
}

export async function loginWithGoogleFirebase(): Promise<any> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Google Sign-In indesejado porque o Firebase não está configurado.");
  }
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (error) {
    console.error("[Auth] Falha no Google Access:", error);
    throw error;
  }
}

export async function logoutWithFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await signOut(auth);
  }
}

export async function sendNativeEmailVerification(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth && auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error("Não há usuário autenticado no momento para enviar o e-mail.");
  }
}

export function getBrowserDeviceInfo() {
  const userAgent = navigator.userAgent || "";
  const language = navigator.language || "";
  const screenSpec = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
  const timeZoneOffset = new Date().getTimezoneOffset();
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  
  // Create fingerprint
  const fingerprintRaw = [userAgent, language, screenSpec, timeZoneOffset, hardwareConcurrency].join("|");
  // Simple hash for fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprintRaw.length; i++) {
    const char = fingerprintRaw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const fingerprint = `fp_${Math.abs(hash)}`;

  // Durable Device ID in local storage
  let deviceId = localStorage.getItem("orbi_durable_deviceId");
  if (!deviceId) {
    deviceId = "dev_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem("orbi_durable_deviceId", deviceId);
  }

  const info = `${navigator.platform || "Unknown"} / CPU: ${hardwareConcurrency} / ${screenSpec}`;

  return { deviceId, fingerprint, info };
}

export async function checkDeviceTrial(email: string): Promise<{ deviceId: string, fingerprint: string, isAllowed: boolean, isSelf: boolean }> {
  const { deviceId, fingerprint, info } = getBrowserDeviceInfo();
  const db = getFirestoreDB();

  // If we are in the development/preview environment, we bypass the device anti-fraud blocking
  // to allow the developer/owner to register new accounts and test the 4-day trial.
  const isDevBypass = typeof window !== 'undefined' && (
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('127.0.0.1') ||
    window.location.hostname.includes('run.app') ||
    window.location.hostname.includes('web-preview') ||
    window.location.hostname.includes('vercel.app')
  );

  if (!db) {
    return { deviceId, fingerprint, isAllowed: true, isSelf: true };
  }

  const currentEmail = email.toLowerCase().trim();
  const isTestEmail = currentEmail.startsWith("test") || 
                      currentEmail.includes("teste") || 
                      currentEmail.includes("admin") || 
                      currentEmail.includes("bypass");

  if (isTestEmail) {
    console.log("[Anti Fraud] Test email detected: allowing trial bypass for:", currentEmail);
    return { deviceId, fingerprint, isAllowed: true, isSelf: true };
  }

  try {
    // 1. Check Device ID
    const deviceRef = doc(db, "device_trials", deviceId);
    const snap = await getDoc(deviceRef);
    if (snap.exists()) {
      const data = snap.data();
      const firstEmail = data.firstEmail ? data.firstEmail.toLowerCase().trim() : "";
      if (firstEmail && firstEmail !== currentEmail) {
        if (isDevBypass) {
          console.log("[Anti Fraud] Dev bypass active: allowing device trial for new test account:", currentEmail);
          return { deviceId, fingerprint, isAllowed: true, isSelf: false };
        }
        return { deviceId, fingerprint, isAllowed: false, isSelf: false };
      }
      return { deviceId, fingerprint, isAllowed: true, isSelf: true };
    }

    // 2. Check Fingerprint across database
    const q = query(collection(db, "device_trials"), where("deviceFingerprint", "==", fingerprint));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      let otherEmailFound = false;
      querySnap.forEach((docSnap) => {
        const d = docSnap.data();
        const firstEmail = d.firstEmail ? d.firstEmail.toLowerCase().trim() : "";
        if (firstEmail && firstEmail !== currentEmail) {
          otherEmailFound = true;
        }
      });
      if (otherEmailFound) {
        if (isDevBypass) {
          console.log("[Anti Fraud] Dev bypass active: allowing fingerprint trial for new test account:", currentEmail);
          return { deviceId, fingerprint, isAllowed: true, isSelf: false };
        }
        return { deviceId, fingerprint, isAllowed: false, isSelf: false };
      }
    }

    // 3. Register if clean
    await setDoc(deviceRef, {
      deviceId,
      deviceFingerprint: fingerprint,
      trialUsed: true,
      firstEmail: currentEmail,
      createdAt: new Date().toISOString(),
      deviceInfo: info
    });
    return { deviceId, fingerprint, isAllowed: true, isSelf: true };

  } catch (error) {
    console.error("Antifraud check failed, allowing by resilience:", error);
    return { deviceId, fingerprint, isAllowed: true, isSelf: true };
  }
}

export function subscribeToAuthChanges(callback: (user: any) => void) {
  const auth = getFirebaseAuth();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export async function loginWithFacebookFirebase(): Promise<any> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Facebook Sign-In indisponível porque o Firebase não está configurado.");
  }
  try {
    const provider = new FacebookAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (error) {
    console.error("[Auth] Falha no Facebook Access:", error);
    throw error;
  }
}

export async function sendPasswordResetFirebase(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("O Firebase Auth não está configurado. Não é possível recuperar senha.");
  }
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    console.error("[Auth] Falha no envio de e-mail de recuperação:", error);
    throw error;
  }
}

export async function deleteUserAccountFirebase(email: string): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  // Limpa o armazenamento local do navegador imediatamente
  localStorage.removeItem("orbi_user_profile");
  localStorage.removeItem("orbi_extra_maps");
  localStorage.removeItem("star_map_dreams_v2");
  localStorage.removeItem("registered_accounts_data_local");
  
  const db = getFirestoreDB();
  const auth = getFirebaseAuth();
  const activeUid = auth?.currentUser?.uid;
  
  const keysToDelete = [mailKey];
  if (activeUid && activeUid !== mailKey) {
    keysToDelete.push(activeUid);
  }

  if (db) {
    const SUBCOLLECTIONS_TO_DELETE = [
      "natalCharts",
      "transits",
      "dailyInsights",
      "weeklyInsights",
      "dreams",
      "extraMaps",
      "missions",
      "tarotReadings",
      "numerology",
      "prosperityMaps",
      "biorhythm",
      "lunarNodes",
      "notifications",
      "subscriptions",
      "cache"
    ];

    for (const key of keysToDelete) {
      // Exclui todas as subcoleções
      for (const subCol of SUBCOLLECTIONS_TO_DELETE) {
        try {
          const colRef = collection(db, "users", key, subCol);
          const snap = await getDocs(colRef);
          for (const d of snap.docs) {
            await deleteDoc(doc(db, "users", key, subCol, d.id));
          }
        } catch (e) {
          console.warn(`Falha ao deletar subcoleção ${subCol} para a chave ${key}:`, e);
        }
      }

      // Exclui o documento principal do usuário
      try {
        const userRef = doc(db, "users", key);
        await deleteDoc(userRef);
      } catch (e) {
        console.warn(`Falha ao deletar perfil principal para a chave ${key}:`, e);
        handleFirestoreError(e, OperationType.DELETE, `users/${key}`);
      }
    }
  }

  // Exclui a credencial de autenticação se houver login ativo no Firebase Auth
  if (auth && auth.currentUser) {
    try {
      await auth.currentUser.delete();
    } catch (e) {
      console.warn("Falha de deleção de usuário de auth direta (deslogando em vez disso):", e);
      await signOut(auth);
    }
  }
}


