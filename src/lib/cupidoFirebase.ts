import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where,
  onSnapshot
} from "firebase/firestore";
import { 
  getFirestoreDB, 
  getUserDocKey, 
  handleFirestoreError, 
  OperationType 
} from "./firebase";

// Interfaces
export interface CupidoPerson {
  id: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  birthCity: string;
  birthCountry?: string;
  gender?: string;
  isUnknownTime?: boolean;
  createdAt: string;
  userId?: string;
  latitude?: number;
  longitude?: number;
}

export interface CupidoHistory {
  id: string; // e.g. personId_date (YYYY-MM-DD)
  personId: string;
  date: string;
  radarData: any;
  createdAt: string;
}

export interface CupidoFavorite {
  id: string;
  personId: string;
  tipCategory: string;
  tipText: string;
  createdAt: string;
}

export interface CupidoSettings {
  notifyNewRadar: boolean;
  notifyTransits: boolean;
  notifyFavorablePeriods: boolean;
}

const DEFAULT_SETTINGS: CupidoSettings = {
  notifyNewRadar: true,
  notifyTransits: true,
  notifyFavorablePeriods: true
};

// User-scoped LocalStorage Key Helpers
function getCupidoPeopleKey(email: string): string {
  const docKey = getUserDocKey(email);
  return docKey ? `cupido_people_list_${docKey}` : `cupido_people_list_guest`;
}
function getCupidoHistoryKey(email: string): string {
  const docKey = getUserDocKey(email);
  return docKey ? `cupido_history_list_${docKey}` : `cupido_history_list_guest`;
}
function getCupidoFavKey(email: string): string {
  const docKey = getUserDocKey(email);
  return docKey ? `cupido_favorites_list_${docKey}` : `cupido_favorites_list_guest`;
}
function getCupidoSettingsKey(email: string): string {
  const docKey = getUserDocKey(email);
  return docKey ? `cupido_settings_${docKey}` : `cupido_settings_guest`;
}
function getCompatibilityHistoryKey(email: string): string {
  const docKey = getUserDocKey(email);
  return docKey ? `compatibility_history_${docKey}` : `compatibility_history_guest`;
}

// ----------------------------------------------------
// Cupido Person Operations
// ----------------------------------------------------
export async function saveCupidoPerson(email: string, person: CupidoPerson): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getCupidoPeopleKey(email);

  // 1. Sync to LocalStorage
  const savedList = localStorage.getItem(storageKey);
  let currentList: CupidoPerson[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(p => p.id !== person.id);
  currentList.push(person);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  // 2. Sync to Firestore
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/cupidoPeople/${person.id}`;
    try {
      const personRef = doc(db, "users", docKey, "cupidoPeople", person.id);
      await setDoc(personRef, {
        ...person,
        userId: docKey
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function deleteCupidoPerson(email: string, personId: string): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const peopleKey = getCupidoPeopleKey(email);
  const favKey = getCupidoFavKey(email);

  // 1. LocalStorage Sync
  const savedList = localStorage.getItem(peopleKey);
  let currentList: CupidoPerson[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(p => p.id !== personId);
  localStorage.setItem(peopleKey, JSON.stringify(currentList));

  // Clean favorites and history locally for this person
  const favList = localStorage.getItem(favKey);
  if (favList) {
    try {
      const list = JSON.parse(favList);
      const filtered = list.filter((f: any) => f.personId !== personId);
      localStorage.setItem(favKey, JSON.stringify(filtered));
    } catch {}
  }

  // 2. Firestore Sync
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/cupidoPeople/${personId}`;
    try {
      const personRef = doc(db, "users", docKey, "cupidoPeople", personId);
      await deleteDoc(personRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  }
}

export async function loadCupidoPeople(email: string): Promise<CupidoPerson[]> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return [];

  const storageKey = getCupidoPeopleKey(email);
  const db = getFirestoreDB();

  if (db) {
    const docKey = getUserDocKey(email);
    try {
      const collRef = collection(db, "users", docKey, "cupidoPeople");
      const snapshot = await getDocs(collRef);
      const remoteList: CupidoPerson[] = [];
      snapshot.forEach(doc => {
        remoteList.push(doc.data() as CupidoPerson);
      });

      localStorage.setItem(storageKey, JSON.stringify(remoteList));
      return remoteList;
    } catch (e) {
      console.warn("Error loading cupido people from firestore, using local fallback:", e);
    }
  }

  const savedList = localStorage.getItem(storageKey);
  try {
    return savedList ? JSON.parse(savedList) : [];
  } catch {
    return [];
  }
}

export function subscribeToCupidoPeople(
  email: string, 
  onUpdate: (people: CupidoPerson[]) => void, 
  onError?: (err: Error) => void
) {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return () => {};

  const docKey = getUserDocKey(email);
  const storageKey = getCupidoPeopleKey(email);
  const db = getFirestoreDB();

  if (!db) {
    // If offline, just trigger once with local list
    const savedList = localStorage.getItem(storageKey);
    let localList: CupidoPerson[] = [];
    try {
      localList = savedList ? JSON.parse(savedList) : [];
    } catch {}
    onUpdate(localList);
    return () => {};
  }

  const collRef = collection(db, "users", docKey, "cupidoPeople");
  return onSnapshot(
    collRef,
    (snapshot) => {
      const people: CupidoPerson[] = [];
      snapshot.forEach(doc => {
        people.push(doc.data() as CupidoPerson);
      });
      localStorage.setItem(storageKey, JSON.stringify(people));
      onUpdate(people);
    },
    (err) => {
      console.error("Firestore cupidoPeople sub error:", err);
      if (onError) onError(err);
    }
  );
}

// ----------------------------------------------------
// Cupido History Operations
// ----------------------------------------------------
export async function saveCupidoHistory(email: string, history: CupidoHistory): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getCupidoHistoryKey(email);

  // 1. Sync to LocalStorage
  const savedList = localStorage.getItem(storageKey);
  let currentList: CupidoHistory[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(h => h.id !== history.id);
  currentList.push(history);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  // 2. Sync to Firestore
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/cupidoHistory/${history.id}`;
    try {
      const ref = doc(db, "users", docKey, "cupidoHistory", history.id);
      await setDoc(ref, {
        ...history,
        userId: docKey
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadCupidoHistory(email: string): Promise<CupidoHistory[]> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return [];

  const storageKey = getCupidoHistoryKey(email);
  const db = getFirestoreDB();

  if (db) {
    const docKey = getUserDocKey(email);
    try {
      const collRef = collection(db, "users", docKey, "cupidoHistory");
      const snapshot = await getDocs(collRef);
      const remoteList: CupidoHistory[] = [];
      snapshot.forEach(doc => {
        remoteList.push(doc.data() as CupidoHistory);
      });

      localStorage.setItem(storageKey, JSON.stringify(remoteList));
      return remoteList;
    } catch (e) {
      console.warn("Error loading cupido history from firestore:", e);
    }
  }

  const savedList = localStorage.getItem(storageKey);
  try {
    return savedList ? JSON.parse(savedList) : [];
  } catch {
    return [];
  }
}

// ----------------------------------------------------
// Cupido Favorites Operations
// ----------------------------------------------------
export async function saveCupidoFavorite(email: string, favorite: CupidoFavorite): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getCupidoFavKey(email);

  // 1. LocalStorage
  const savedList = localStorage.getItem(storageKey);
  let currentList: CupidoFavorite[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(f => f.id !== favorite.id);
  currentList.push(favorite);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  // 2. Firestore
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/cupidoFavorites/${favorite.id}`;
    try {
      const ref = doc(db, "users", docKey, "cupidoFavorites", favorite.id);
      await setDoc(ref, {
        ...favorite,
        userId: docKey
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function deleteCupidoFavorite(email: string, favoriteId: string): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getCupidoFavKey(email);

  // 1. LocalStorage
  const savedList = localStorage.getItem(storageKey);
  let currentList: CupidoFavorite[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(f => f.id !== favoriteId);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  // 2. Firestore
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/cupidoFavorites/${favoriteId}`;
    try {
      const ref = doc(db, "users", docKey, "cupidoFavorites", favoriteId);
      await deleteDoc(ref);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  }
}

export async function loadCupidoFavorites(email: string): Promise<CupidoFavorite[]> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return [];

  const storageKey = getCupidoFavKey(email);
  const db = getFirestoreDB();

  if (db) {
    const docKey = getUserDocKey(email);
    try {
      const collRef = collection(db, "users", docKey, "cupidoFavorites");
      const snapshot = await getDocs(collRef);
      const remoteList: CupidoFavorite[] = [];
      snapshot.forEach(doc => {
        remoteList.push(doc.data() as CupidoFavorite);
      });

      localStorage.setItem(storageKey, JSON.stringify(remoteList));
      return remoteList;
    } catch (e) {
      console.warn("Error loading cupido favorites from firestore:", e);
    }
  }

  const savedList = localStorage.getItem(storageKey);
  try {
    return savedList ? JSON.parse(savedList) : [];
  } catch {
    return [];
  }
}

// ----------------------------------------------------
// Cupido Settings Operations
// ----------------------------------------------------
export async function saveCupidoSettings(email: string, settings: CupidoSettings): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getCupidoSettingsKey(email);

  // 1. LocalStorage
  localStorage.setItem(storageKey, JSON.stringify(settings));

  // 2. Firestore
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/cupidoSettings/config`;
    try {
      const ref = doc(db, "users", docKey, "cupidoSettings", "config");
      await setDoc(ref, {
        ...settings,
        userId: docKey
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadCupidoSettings(email: string): Promise<CupidoSettings> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return DEFAULT_SETTINGS;

  const storageKey = getCupidoSettingsKey(email);
  const db = getFirestoreDB();

  if (db) {
    const docKey = getUserDocKey(email);
    try {
      const ref = doc(db, "users", docKey, "cupidoSettings", "config");
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const remoteSettings = docSnap.data() as CupidoSettings;
        localStorage.setItem(storageKey, JSON.stringify(remoteSettings));
        return remoteSettings;
      } else {
        localStorage.setItem(storageKey, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
    } catch (e) {
      console.warn("Error loading cupido settings from firestore:", e);
    }
  }

  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }

  return DEFAULT_SETTINGS;
}

// ----------------------------------------------------
// Compatibility (Synastry) History Operations
// ----------------------------------------------------
export interface CompatibilityHistoryItem {
  id: string; // e.g. partnerName_category_lang
  partnerName: string;
  category: string;
  lang: string;
  compatibilityData: any;
  createdAt: string;
  userId?: string;
}

export async function saveCompatibilityHistory(email: string, history: CompatibilityHistoryItem): Promise<void> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return;

  const docKey = getUserDocKey(email);
  const storageKey = getCompatibilityHistoryKey(email);

  // 1. Sync to LocalStorage
  const savedList = localStorage.getItem(storageKey);
  let currentList: CompatibilityHistoryItem[] = [];
  try {
    currentList = savedList ? JSON.parse(savedList) : [];
  } catch {}
  currentList = currentList.filter(h => h.id !== history.id);
  currentList.push(history);
  localStorage.setItem(storageKey, JSON.stringify(currentList));

  // 2. Sync to Firestore
  const db = getFirestoreDB();
  if (db) {
    const path = `users/${docKey}/compatibilityHistory/${history.id}`;
    try {
      const ref = doc(db, "users", docKey, "compatibilityHistory", history.id);
      await setDoc(ref, {
        ...history,
        userId: docKey
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
}

export async function loadCompatibilityHistory(email: string): Promise<CompatibilityHistoryItem[]> {
  const mailKey = email.toLowerCase().trim();
  if (!mailKey) return [];

  const storageKey = getCompatibilityHistoryKey(email);
  const db = getFirestoreDB();

  if (db) {
    const docKey = getUserDocKey(email);
    try {
      const collRef = collection(db, "users", docKey, "compatibilityHistory");
      const snapshot = await getDocs(collRef);
      const remoteList: CompatibilityHistoryItem[] = [];
      snapshot.forEach(doc => {
        remoteList.push(doc.data() as CompatibilityHistoryItem);
      });

      localStorage.setItem(storageKey, JSON.stringify(remoteList));
      return remoteList;
    } catch (e) {
      console.warn("Error loading compatibility history from firestore:", e);
    }
  }

  const savedList = localStorage.getItem(storageKey);
  try {
    return savedList ? JSON.parse(savedList) : [];
  } catch {
    return [];
  }
}
