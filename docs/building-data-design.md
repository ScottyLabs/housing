# Building Data Typing — Finalized Design

Proposal for reorganizing `buildings.json` from the current ad-hoc tag/string system into a
structured, comparable type. Design only — no code changes yet.

## Goal

Make every building attribute **machine-comparable** so comparison, filtering, and sorting all read
the same typed fields, and the `tags` system becomes a *derived presentation layer* instead of the
source of truth.

## What the data has to serve today

I traced every current consumer so the type covers all of them:

| Consumer | Reads |
|---|---|
| `BuildingDetails.tsx` | `rooms[]`, `bathrooms{type,details}`, `closeBuildings`, `AC{available,details}`, `kitchen`, `lounge`, `image`, `photoGallery[]`, `floorPlanGallery[]` (splits floor vs room-type by **regex on description** — fragile) |
| `BuildingComparison.tsx` (column) | same amenity fields, side-by-side |
| `BuildingFilter.tsx` | Distance from; Atmosphere: **Socialness**, **Noise**; Accommodations: Service Animal, Wheelchair, Single room; Amenities: AC, Laundry each floor, En-suite bathroom |
| survey (`Step1–3`) | gender housing, cooking/gym/social frequency, accommodations (+ ground-floor, strobe alarm), amenities (AC, en-suite bath, en-suite kitchen, common areas, kitchen access) |
| `TaggedBuildingOption.tsx` | `tags[]` → looked up in `tags.tsx` for label + icon |
| DB `dormTable` (schema branch) | `hasAc`, `acDetails`, `bathroomType`, `bathroomDetails`, `closeBuildings[]`, `roomTypes[]`, `tags[]`, `latitude`, `longitude`, `kitchenDescription`, `loungeDescription`, `photoGallery(json)`, `imageUrl` |

Key takeaway: the filters and survey ask about things (noise, socialness, laundry location, gym,
gender housing, en-suite kitchen, ground-floor rooms, wheelchair access) that **have no structured
field today** — they're either missing or buried in freeform strings. The new type must add them.

## Problems with the current system

1. **Freeform strings can't be compared.** `kitchen`, `lounge`, `closeBuildings`, `AC.details`,
   `bathrooms.details` are prose. You can't sort, filter, or diff on them.
2. **Tags overlap with real data.** `noKitchen`, `limitedAC`, `noCentralAC`, `basementLaundry`,
   `gymAccess`, `girlsOnly`, `lgbtqInclusive` are all *facts already implied by* (or that should
   live in) structured fields. Storing them separately means they can drift out of sync.
3. **`bathrooms.type` is a stringly-typed enum** with values `"Communal" | "Private" | "Both"` —
   `"Both"` (Mudge) is really "an array of types."
4. **AC is a boolean + prose**, but the app needs to distinguish *none / by-necessity / window /
   central* (that's literally what the `limitedAC` and `noCentralAC` tags encode).
5. **Floor-plan categorization is done by regex** on the description in `BuildingDetails`. That
   belongs in the data as an explicit field.

## Notes on the proposed mockup

The direction (typed `AmenityData`, `RoomType`/`BathType` enums) is right. Adjustments:

- **`photos: URL[]` / `floorPlans: URL[]` lose metadata.** Every current photo has a `description`
  and every floor plan can have a `virtualTourLink`. Keep them as objects, not bare URLs.
- **`walkthroughs: URL` (single) doesn't match reality.** Walkthroughs are *per room-type floor
  plan* today (`floorPlanGallery[i].virtualTourLink`), not one per building. Fold them back in.
- **Bare `enum` serializes to integers in JSON.** `enum RoomType { Single }` → `0`. That's
  unreadable and breaks the moment anyone reorders the enum. Use **string-valued enums** (or string
  literal unions) so the JSON stays `"tradSingle"` and matches the DB's `text[]` columns.
- **`URL` type** isn't representable in JSON — use `string`.
- **`hasKitchen` + `kitchenDetails` is the right pattern; generalize it.** Every comparable
  attribute should be *a typed value plus an optional `details` string for display.* That one
  pattern is the whole design.
- **Missing dimensions** the filters/survey need: laundry location, gym, gender housing, atmosphere
  (socialness/noise), accessibility (wheelchair/service-animal/ground-floor/strobe), location
  (lat/long for "distance from").

## Finalized types

```ts
// ---------- Comparable enums (string-valued so JSON stays readable & DB-aligned) ----------

export enum RoomType {
    TradSingle = "tradSingle",
    TradDouble = "tradDouble",
    TradTriple = "tradTriple",
    SemiSuiteSingle = "semiSuiteSingle",
    SemiSuiteDouble = "semiSuiteDouble",
    SemiSuiteTriple = "semiSuiteTriple",
    SemiSuiteQuad = "semiSuiteQuad",       // Mudge has this
    ApartmentTriple = "aptTriple",         // Res on Fifth
    StudioApartmentSingle = "studioAptSingle",
    StudioApartmentDouble = "studioAptDouble", // Clyde, Res on Fifth
}

export enum BathroomType {
    Communal = "communal",       // shared per floor/wing (traditional style)
    SharedSuite = "sharedSuite",  // shared with adjacent suite (semi-suite style)
    Private = "private",         // truly en-suite / in-room (apartment style)
}
// NOTE: current data mislabels many semi-suite bathrooms as `Private` — they are
// actually `SharedSuite`. Fix during migration (Boss, Henderson, McGill, Morewood,
// Welch, Maggie Mo). Only real apartment/studio units are `Private`.

export enum ACLevel {
    None = "none",             // no AC
    ByNecessity = "byNecessity", // accommodation / triple / lottery only  → old "limitedAC"
    Window = "window",         // window units, not central               → old "noCentralAC"
    Central = "central",       // full central AC
}

export enum LaundryLocation {
    None = "none",
    Basement = "basement",     // old "basementLaundry"
    EachFloor = "eachFloor",   // filter: "Laundry on each floor"
    InUnit = "inUnit",
}

export enum KitchenScope {
    None = "none",       // old "noKitchen"
    Shared = "shared",   // communal — building- or floor-level; `details` describes which
    InUnit = "inUnit",   // kitchenette in room → "en suite kitchen"
}

export enum GenderHousing {
    CoEd = "coed",
    WomenOnly = "womenOnly",         // old "girlsOnly"
    MenOnly = "menOnly",
    GenderInclusive = "genderInclusive", // old "lgbtqInclusive"
}

// ---------- Reusable "value + human detail" wrappers ----------

export interface Bathrooms {
    types: BathroomType[];   // array handles Mudge's "Both"
    details?: string;
}
export interface AirConditioning {
    level: ACLevel;
    details?: string;
}
export interface Kitchen {
    scope: KitchenScope;
    details?: string;
}
export interface Laundry {
    location: LaundryLocation;
    details?: string;
}
export interface CommonAreas {
    hasLounge: boolean;      // for the "Common areas" filter
    details?: string;        // replaces `lounge` prose
}
export interface Gym {
    available: boolean;      // old "gymAccess"
    details?: string;
}

// ---------- Grouped sub-objects ----------

export interface AmenityData {
    roomTypes: RoomType[];
    bathrooms: Bathrooms;
    ac: AirConditioning;
    kitchen: Kitchen;
    laundry: Laundry;
    commonAreas: CommonAreas;
    gym: Gym;
    genderHousing: GenderHousing;
}

// Hand-entered from outside data (to be sourced/filled later).
export interface Accessibility {
    wheelchairAccessible: boolean;
    serviceAnimalFriendly: boolean;
    groundFloorRooms: boolean;
    strobeAlarm: boolean;    // strobe fire alarm & doorbell
}

// 1–5 scales, matching the survey sliders & review table.
// Hand-entered for now; will switch to `review` table aggregates once that system works.
// Optional because a building may not have data yet.
export interface Atmosphere {
    socialness?: number;
    noiseLevel?: number;
}

export interface Location {
    latitude?: number;         // "distance from <landmark>" filter is computed from
    longitude?: number;        // lat/long later — no distance stored on the building
    closeBuildings: string[];  // building ids, for the "Closest Buildings" detail card
    note?: string;             // keep the human blurb if wanted
}

export interface GalleryImage {
    link: string;
    description: string;
}
export interface FloorPlan {
    link: string;
    description: string;
    category: "roomType" | "floor"; // explicit — replaces regex in BuildingDetails
    virtualTourLink?: string;       // the "walkthrough"
}
export interface Media {
    mainImage: string;   // was `image`
    icon?: string;       // mockup's iconImg
    photos: GalleryImage[];      // was photoGallery
    floorPlans: FloorPlan[];     // was floorPlanGallery
}

// ---------- Top-level ----------

export interface Building {
    id: string;
    name: string;
    media: Media;
    amenities: AmenityData;
    accessibility: Accessibility;
    atmosphere: Atmosphere;
    location: Location;
    editorialTags?: string[]; // ONLY hand-authored tags with no structured source (optional)
}
```

## Tags become derived, not stored

Every tag in `tags.tsx` today maps to a structured field, so the `tags[]` array on each building can
be deleted and replaced with a single `deriveTags(building)` function. The `tags.tsx` registry
(id → label + icon) stays; only the per-building storage goes away.

| Current tag | Derivation from new type |
|---|---|
| `noKitchen` | `amenities.kitchen.scope === KitchenScope.None` |
| `limitedAC` | `amenities.ac.level === ACLevel.ByNecessity` |
| `noCentralAC` | `amenities.ac.level !== ACLevel.Central` |
| `basementLaundry` | `amenities.laundry.location === LaundryLocation.Basement` |
| `gymAccess` | `amenities.gym.available` |
| `girlsOnly` | `amenities.genderHousing === GenderHousing.WomenOnly` |
| `lgbtqInclusive` | `amenities.genderHousing === GenderHousing.GenderInclusive` |

```ts
function deriveTags(b: Building): string[] {
    const t: string[] = [];
    if (b.amenities.kitchen.scope === KitchenScope.None) t.push("noKitchen");
    if (b.amenities.ac.level === ACLevel.ByNecessity) t.push("limitedAC");
    if (b.amenities.ac.level !== ACLevel.Central) t.push("noCentralAC");
    if (b.amenities.laundry.location === LaundryLocation.Basement) t.push("basementLaundry");
    if (b.amenities.gym.available) t.push("gymAccess");
    if (b.amenities.genderHousing === GenderHousing.WomenOnly) t.push("girlsOnly");
    if (b.amenities.genderHousing === GenderHousing.GenderInclusive) t.push("lgbtqInclusive");
    return [...t, ...(b.editorialTags ?? [])];
}
```

Benefit: a building can never claim `noKitchen` while also showing a kitchen — they read the same
field. Adding a new derived tag is one line, no data re-entry.

## Why comparison gets easy

With everything typed, comparison/filter/sort are uniform. A filter is just a predicate over fields;
a comparison table is field access; sorting works because values are enums/booleans/numbers:

```ts
// Filter example — every filter is now a one-liner predicate:
const hasAC       = (b: Building) => b.amenities.ac.level !== ACLevel.None;
const laundryEach = (b: Building) => b.amenities.laundry.location === LaundryLocation.EachFloor;
const enSuiteBath = (b: Building) => b.amenities.bathrooms.types.includes(BathroomType.Private);
const quieter     = (b: Building) => (b.atmosphere.noiseLevel ?? 3) <= 2;

// Comparison row: pull the same field across N buildings and render value + details.
```

This directly powers the `building-comparison` page (which currently hard-reads `rooms`, `AC`, etc.)
and lets the `BuildingFilter` sliders/checkboxes bind to real fields instead of doing nothing.

## Old → new field mapping (migration)

| Old (`buildings.json`) | New |
|---|---|
| `image` | `media.mainImage` |
| `photoGallery[]` `{link,description}` | `media.photos[]` (same shape) |
| `floorPlanGallery[]` `{link,description,virtualTourLink?}` | `media.floorPlans[]` + add `category` |
| `rooms: string[]` | `amenities.roomTypes: RoomType[]` (same string codes) |
| `bathrooms: {type,details}` | `amenities.bathrooms: {types[],details?}` (`"Both"` → two entries) |
| `AC: {available,details}` | `amenities.ac: {level,details?}` (map `available`→`Central`/`None`, refine via old tags) |
| `kitchen: string` | `amenities.kitchen: {scope,details}` (prose → `details`, classify scope) |
| `lounge: string` | `amenities.commonAreas: {hasLounge,details}` |
| `closeBuildings: string` | `location.closeBuildings: string[]` + `location.note` |
| `tags: string[]` | **deleted** → `deriveTags()` (+ optional `editorialTags`) |
| — (new) | `amenities.laundry`, `amenities.gym`, `amenities.genderHousing`, `accessibility`, `atmosphere`, `location.lat/long` |

The mapping is mostly mechanical; the fields needing a human pass are AC level, kitchen scope,
laundry location, gender housing, and the accessibility booleans (currently unknown per building).

## Storage / file-format notes

- The file is named `buildings.json` but is actually a TS module (`export const buildings = [...]`).
  Recommend renaming to `buildings.ts` and asserting `... satisfies Building[]` so the compiler
  catches malformed data. (Or keep true `.json` + validate at load with zod.)
- String enums keep the on-disk values (`"tradSingle"`, `"central"`) identical to the DB's
  `text[]`/`text` columns, so the eventual JSON → Postgres migration is a straight copy.
- `Building` interface currently lives in `BuildingContext.tsx`; move these types to a dedicated
  `data/buildingTypes.ts` since comparison, filter, survey, and context all import them.

## Resolved decisions

1. **Distance** is building-to-**landmark**, computed from `latitude`/`longitude` later — no distance
   value is stored on the building. `closeBuildings` stays only for the "Closest Buildings" card.
2. **Atmosphere** (socialness/noise) is **hand-entered for now**, switching to `review` table
   aggregates once that system works. Fields stay optional.
3. **Accessibility** fields are **hand-entered from outside data**, filled in later.
4. **Bathrooms** use three user-facing categories — `Communal`, `SharedSuite`, `Private` — reflecting
   traditional / semi-suite / apartment styles. ⚠️ Migration must **fix the current data**, which
   mislabels semi-suite bathrooms as `Private`; those are `SharedSuite`. Only true apartment/studio
   units are `Private`.
5. **Kitchen scope** collapsed to `None` / `Shared` / `InUnit` — floor-vs-building distinctions live
   in the `details` string, not the enum.
6. **`RoomType`**: `Suite` removed (not a valid option). Remaining values are confirmed for now.
```
