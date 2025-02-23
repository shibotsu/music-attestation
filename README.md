# music-attestation

# Atestacija Umjetničkih Tvorevina  

Ovaj projekt omogućava atestaciju glazbenih datoteka pomoću **Ethereum Attestation Service (EAS)** i **IPFS (Pinata)**.  

## 🎵 Tehnologije  

- **React.js** – Frontend aplikacija  
- **EAS SDK** – Atestacija podataka na Ethereum blockchainu  
- **IPFS / Pinata** – Decentralizirana pohrana podataka  

## 📥 Instalacija  

1. **Kloniraj repozitorij**  
   ```sh
   git clone https://github.com/shibotsu/music-attestation.git
   cd ime-projekta

2. **Instaliraj potrebne pakete**
   ```sh
   npm install
3. **Konfiguracija environment varijabli**
   Napravi `.env` datoteku i unesi svoje API ključeve
   ```sh
   VITE_PRIVATE_KEY=
   VITE_EAS_PROVIDER_URL=https://sepolia.infura.io/v3/<infura-private-key>
   VITE_PINATA_API_KEY=
   VITE_PINATA_API_SECRET=

4. **Pokreni backend i vite server**
   ```sh
   cd server
   node server.js
  Nakon toga u drugom terminalu pokreni vite server pomoću
  ```sh
   npm run dev
  ```

## 🧪 Testiranje
1. Testiranje atestacije glazbene datoteke
   
    Odaberi glazbenu datoteku i prenesi je na IPFS (Pinata).
    Generirat će se jedinstveni CID hash.
    Pritisni gumb za atestaciju – podaci će biti poslani na Ethereum blockchain putem EAS-a.
    Provjeri transakciju na Etherscan-u.

2. Provjera
   
   Datoteka bi trebala biti prisutna na adresi
   https://gateway.pinata.cloud/ipfs/<CID>

  S obzirom da je recipient address moja adresa `0x6AeF2aC11876c2E85Eed513136741cc2b6141dC6` (može se promijeniti unutar UploadForm.jsx), atestacija se može provjeriti na https://sepolia.easscan.org/ te unosom javnog ključa može se
  provjeriti je li atestacija uistinu tamo.

  S time da se koristi Sepolia testnet, za stvaranje atestacija potrebno je imati određenu količinu testnih tokena.
