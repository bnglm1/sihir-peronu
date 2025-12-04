import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  push, 
  update, 
  remove,
  child
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { Character } from "../types";

// Safe environment variable access
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: "AIzaSyCUWVVhhtFtNKtcTTjwYYV094HRk-KydJw",
  authDomain: "characterblog-910a6.firebaseapp.com",
  projectId: "characterblog-910a6",
  storageBucket: "characterblog-910a6.firebasestorage.app",
  messagingSenderId: "192121368642",
  appId: "1:192121368642:web:dada9c74e0947dbd633ddb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
// Eğer databaseURL config içinde yoksa otomatik bulmaya çalışır, 
// ancak .env dosyasında VITE_FIREBASE_DATABASE_URL tanımlanması önerilir.
export const db = getDatabase(app);
export const auth = getAuth(app);

// Helper to handle "Demo Mode" if no real keys are provided
const isDemo = firebaseConfig.apiKey === "demo-key";

// --- Service Methods ---

export const getCharacters = async (searchTerm: string = ""): Promise<Character[]> => {
  if (isDemo) {
    console.warn("Running in Demo Mode. Connect Firebase keys to see real data.");
    const mockData: Character[] = [
      { id: '1', name: 'Harry Potter', universe: 'Harry Potter', description: 'Sağ kalan çocuk.', imageUrl: 'https://picsum.photos/400/600', abilities: 'Çataldili, Uçuş, Büyü Savunması' },
      { id: '2', name: 'Iron Man', universe: 'Marvel', description: 'Milyarder, playboy, hayırsever.', imageUrl: 'https://picsum.photos/401/600', abilities: 'Üstün Zeka, Zırh Teknolojisi' },
      { id: '3', name: 'Gandalf', universe: 'Yüzüklerin Efendisi', description: 'Orta Dünya\'nın koruyucusu.', imageUrl: 'https://picsum.photos/402/600', abilities: 'Büyücülük, Bilgelik, Kılıç Kullanımı' },
      { id: '4', name: 'Yoda', universe: 'Star Wars', description: 'Efsanevi Jedi ustası.', imageUrl: 'https://picsum.photos/403/600', abilities: 'Güç Kullanımı, Işın Kılıcı, Bilgelik' },
    ];
    return mockData.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  try {
    // Realtime Database: 'characters' node'una referans al
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `characters`));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      // JSON objesini Array'e çeviriyoruz
      // Örnek yapı: { "-Nxc123": {name: "Harry"...}, "-Nxc456": {name: "Ron"...} }
      const chars: Character[] = Object.entries(data).map(([key, value]) => {
        return { id: key, ...(value as Omit<Character, 'id'>) };
      });

      // Client side filtering
      if (searchTerm) {
        return chars.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return chars;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
};

export const getCharacterById = async (id: string): Promise<Character | null> => {
  if (isDemo) {
     const all = await getCharacters("");
     return all.find(c => c.id === id) || null;
  }
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `characters/${id}`));
    
    if (snapshot.exists()) {
      return { id, ...snapshot.val() } as Character;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const addCharacter = async (character: Omit<Character, 'id'>) => {
  if (isDemo) {
    alert("Demo Modu: Karakter eklendi.");
    return;
  }
  try {
    // push() metodu otomatik olarak benzersiz bir ID (key) oluşturur
    const newCharRef = push(ref(db, 'characters'));
    await set(newCharRef, character);
  } catch (e) {
    console.error("Error adding character: ", e);
    throw e;
  }
};

export const updateCharacter = async (id: string, character: Partial<Character>) => {
  if (isDemo) {
    alert("Demo Modu: Karakter güncellendi.");
    return;
  }
  try {
    // Belirli bir ID altındaki veriyi günceller
    const charRef = ref(db, `characters/${id}`);
    await update(charRef, character);
  } catch (e) {
    console.error("Error updating character: ", e);
    throw e;
  }
};

export const deleteCharacter = async (id: string) => {
  if (isDemo) {
    alert("Demo Modu: Karakter silindi.");
    return;
  }
  try {
    // Belirli bir düğümü siler
    const charRef = ref(db, `characters/${id}`);
    await remove(charRef);
  } catch (e) {
    console.error("Error deleting character: ", e);
    throw e;
  }
};