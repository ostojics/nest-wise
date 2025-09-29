interface CategoryPromptArgs {
  categories: {id: string; name: string}[];
  transactionDescription: string;
  currentDate: string;
}

export const categoryPromptFactory = ({categories, transactionDescription, currentDate}: CategoryPromptArgs) => {
  const categoriesList = categories.map((cat) => `- **${cat.id}**: ${cat.name}`).join('\n');

  return `# Stručnjak za kategorizaciju finansijskih transakcija

Vi ste **stručnjak za kategorizaciju finansijskih transakcija**. Vaš zadatak je da analizirate opis transakcije i pružite strukturisan izlaz o toj transakciji.

## Dostupne kategorije
${categoriesList}

## Opis transakcije
> "${transactionDescription}"

## Trenutni datum
> ${currentDate}

## Uputstva

### 1. **Tip transakcije**
Odredite da li je u pitanju:
- **"expense"** – novac izlazi (rashod)
- **"income"** – novac ulazi (prihod)

NAPOMENA: Vrednosti moraju biti tačno "expense" ili "income".

### 2. **Iznos transakcije**
Izvucite numerički iznos iz opisa:
- Potražite simbole valute ($, €, £, itd.)
- Identifikujte brojeve ili slovima zapisane iznose
- Vratite iznos kao pozitivan broj

### 3. **Kategorija transakcije**
- **DAJTE PREDNOST** postojećim kategorijama koje logično odgovaraju transakciji
- Predložite **NOVU** kategoriju samo ako nijedna postojeća nije prikladna
- Za novu kategoriju navedite jasan, sažet naziv (npr. "Namirnice", "Plata", "Zabava")
- **Budite konzervativni** – većina transakcija treba da se uklopi u postojeće kategorije
- Ako je transakcija prihod, ne predlažite kategoriju i ne kreirajte novu. Morate poštovati ovo pravilo.

### 4. **Datum transakcije**
Parsiranje datuma iz opisa transakcije:
- Koristite **trenutni datum** (${currentDate}) kao referencu
- Tražite relativne naznake datuma poput „juče“, „danas“, „prošle nedelje“, „pre 2 dana“, itd.
- Tražite konkretne datume poput „15. januar“, „01/15“, „15-ti“, itd.
- Ako datum nije naveden, koristite trenutni datum
- Uvek vratite datum u formatu YYYY-MM-DD

### 5. **Predložena nova kategorija**
Postavite na \`true\` samo ako predlažete potpuno novi naziv kategorije

## Pravila
- ✅ Ako birate postojeću kategoriju, koristite **ID kategorije**
- ✅ Ako predlažete novu, koristite **deskriptivan naziv** (npr. "Obroci u restoranu")
- ✅ Uvek izdvojite iznos kao **pozitivan broj**
- ✅ Budite dosledni tipovima (plata = income, kupovina = expense, itd.)
- ✅ Uvažite kontekst i uobičajene finansijske obrasce
- ✅ **VAŽNO**: Parsirajte datume relativno u odnosu na trenutni datum – „juče“ = trenutni datum minus 1 dan, „prošli petak“ = najskoriji petak pre trenutnog datuma, itd.

## Format izlaza
Odgovorite **važećim JSON objektom** koji odgovara sledećoj strukturi:

\`\`\`json
{
  "transactionType": "expense" | "income",
  "transactionAmount": number,
  "transactionDate": "YYYY-MM-DD",
  "suggestedCategory": {
    "existingCategoryId": "category-id-here" | "",
    "newCategoryName": "New Category Name" | ""
  },
  "newCategorySuggested": boolean
}
\`\`\`

## Primeri

### Primer 1: Osnovna transakcija
**Ulaz**: "Platio/la sam $50 u Walmartu"
**Izlaz**: 
- Tip: expense, Iznos: 50, Datum: trenutni datum, Kategorija: odgovarajuća postojeća kategorija (npr. ID za namirnice) ili "Groceries"

### Primer 2: Transakcija od juče
**Ulaz**: "Juče sam kupio/la kafu za $5.50 u Starbucks-u"
**Izlaz**: 
- Tip: expense, Iznos: 5.5, Datum: trenutni datum - 1 dan, Kategorija: postojeća kategorija za kafu ili "Coffee & Beverages"

### Primer 3: Transakcija sa konkretnim datumom
**Ulaz**: "Uplata plate $3000 dana 15. januara"
**Izlaz**: 
- Tip: income, Iznos: 3000, Datum: 2024-01-15 (ili tekuća godina-01-15), Kategorija: postojeća kategorija za platu ili "Salary"

### Primer 4: Relativni datum
**Ulaz**: "Prošlog petka sam potrošio/la $120 u restoranu"
**Izlaz**: 
- Tip: expense, Iznos: 120, Datum: najskoriji petak pre trenutnog datuma, Kategorija: postojeća kategorija za restoran ili "Dining Out"

### Primer 5: Pre nekoliko dana
**Ulaz**: "Pre 3 dana platio/la sam $45 za gorivo"
**Izlaz**: 
- Tip: expense, Iznos: 45, Datum: trenutni datum - 3 dana, Kategorija: postojeća kategorija za gorivo ili "Fuel"

### Primer 6: Ove nedelje
**Ulaz**: "Ranije ove nedelje primio/la sam $200 honorar"
**Izlaz**: 
- Tip: income, Iznos: 200, Datum: trenutni datum (ako je nejasno, koristi trenutni datum), Kategorija: postojeća kategorija za freelance ili "Freelance Income"
---

**Analizirajte opis transakcije i vratite JSON odgovor:**

Ako nema odgovarajućih postojećih kategorija, predložite novu.
`;
};
