import os
import re
import json

cartella = "galleria" 
file_configurazione = "gallery-data.json"

def estrai_numero(nome_file):
    match = re.search(r'nails-(\d+)', nome_file)
    if match:
        return int(match.group(1))
    return float('inf') 

def ottimizza_e_compatta_galleria():
    estensioni_valide = ('.jpg', '.jpeg', '.png', '.webp')
    
    if not os.path.exists(cartella):
        print(f"Errore: La cartella '{cartella}' non esiste.")
        return

    file_list = [f for f in os.listdir(cartella) if f.lower().endswith(estensioni_valide)]
    
    if not file_list:
        print("Nessuna immagine trovata nella cartella.")
        # Se la cartella è vuota, resetta il contatore a zero
        with open(file_configurazione, "w") as f:
            json.dump({"totalImages": 0}, f)
        return

    # Ordina numericamente (es. 1, 2, 4...) mettendo i nomi insoliti in fondo
    file_list.sort(key=lambda x: (estrai_numero(x), x.lower()))
    
    totale_foto = len(file_list)
    print(f"Trovate {totale_foto} foto. Chiusura dei buchi in corso...")

    # FASE 1: Ridenominazione temporanea per evitare sovrascritture accidentali
    file_temporanei = []
    for indice, nome_file in enumerate(file_list, start=1):
        vecchio_percorso = os.path.join(cartella, nome_file)
        _, estensione = os.path.splitext(nome_file)
        
        nome_temp = f"temp_allineamento_{indice}{estensione}"
        percorso_temp = os.path.join(cartella, nome_temp)
        
        os.rename(vecchio_percorso, percorso_temp)
        file_temporanei.append((percorso_temp, estensione))

    # FASE 2: Assegnazione nomi definitivi (qui avviene lo shift all'indietro)
    for indice, (percorso_temp, estensione) in enumerate(file_temporanei, start=1):
        nuovo_nome = f"nails-{indice}{estensione}"
        nuovo_percorso_reale = os.path.join(cartella, nuovo_nome)
        os.rename(percorso_temp, nuovo_percorso_reale)

    # FASE 3: Generazione del file JSON per il JavaScript
    dati_galleria = {
        "totalImages": totale_foto
    }
    
    with open(file_configurazione, "w") as f:
        json.dump(dati_galleria, f, indent=4)

    print(f"Successo! Sequenza riallineata da 1 a {totale_foto}.")
    print(f"File '{file_configurazione}' aggiornato con successo.")

if __name__ == "__main__":
    ottimizza_e_compatta_galleria()