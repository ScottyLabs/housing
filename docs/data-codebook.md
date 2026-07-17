# Building Data Codebook

Field-by-field reference for `apps/frontend/src/data/buildingTypes.ts`, `buildings.json`, and
`tags.tsx`.

## Building data tree

Where to find each piece of information on an exported `Building` object:

```
Building
├─ id                  string
├─ name                string
├─ media
│  ├─ mainImage        string
│  ├─ icon?            string
│  ├─ photos[]
│  │  ├─ link          string
│  │  └─ description   string
│  └─ floorPlans[]
│     ├─ link              string
│     ├─ description       string
│     ├─ category          "roomType" | "floor"
│     └─ virtualTourLink?  string
├─ amenities
│  ├─ roomTypes        RoomType[]
│  ├─ bathrooms
│  │  ├─ types         BathroomType[]
│  │  └─ details?      string
│  ├─ ac
│  │  ├─ level         ACLevel
│  │  └─ details?      string
│  ├─ kitchen
│  │  ├─ scope         KitchenScope
│  │  └─ details?      string
│  ├─ laundry
│  │  ├─ location      LaundryLocation
│  │  └─ details?      string
│  ├─ commonAreas
│  │  ├─ hasLounge     boolean
│  │  └─ details?      string
│  ├─ gym
│  │  ├─ available     boolean
│  │  └─ details?      string
│  └─ genderHousing    GenderHousing
├─ accessibility
│  ├─ wheelchairAccessible   boolean
│  ├─ serviceAnimalFriendly  boolean
│  ├─ groundFloorRooms       boolean
│  └─ strobeAlarm            boolean
├─ atmosphere
│  ├─ socialness?      number (1-5)
│  └─ noiseLevel?      number (1-5)
├─ location
│  ├─ latitude?        number
│  ├─ longitude?       number
│  ├─ closeBuildings[] string (building ids)
│  └─ note?            string
└─ editorialTags?[]    string
```

## Enums

All enums below are plain numeric TypeScript enums (no explicit string values). The `#` column is
the value stored in `buildings.json` and returned by the enum at runtime.

### `RoomType`

| # | Member | Meaning |
|---|---|---|
| 0 | `TradSingle` | Traditional-style single, shared hallway bathroom. |
| 1 | `TradDouble` | Traditional-style double, shared hallway bathroom. |
| 2 | `TradTriple` | Traditional-style triple, shared hallway bathroom. |
| 3 | `SemiSuiteSingle` | Semi-suite single, bathroom shared with an adjacent suite. |
| 4 | `SemiSuiteDouble` | Semi-suite double, bathroom shared with an adjacent suite. |
| 5 | `SemiSuiteTriple` | Semi-suite triple, bathroom shared with an adjacent suite. |
| 6 | `SemiSuiteQuad` | Semi-suite, four occupants. |
| 7 | `ApartmentTriple` | Apartment-style triple. |
| 8 | `StudioApartmentSingle` | Studio apartment, single occupant. |
| 9 | `StudioApartmentDouble` | Studio apartment, two occupants. |

### `BathroomType`

| # | Member | Meaning |
|---|---|---|
| 0 | `Communal` | Shared per floor/wing, traditional style. |
| 1 | `SharedSuite` | Shared with one adjacent suite, semi-suite style. |
| 2 | `Private` | Truly en-suite / in-room, apartment style only. |

### `ACLevel`

| # | Member | Meaning |
|---|---|---|
| 0 | `None` | No AC. |
| 1 | `ByNecessity` | Accommodation, triple, or lottery-only AC. |
| 2 | `Window` | Window units, not central. |
| 3 | `Central` | Full central AC. |

### `LaundryLocation`

| # | Member | Meaning |
|---|---|---|
| 0 | `None` | No laundry. |
| 1 | `Basement` | Basement only. |
| 2 | `EachFloor` | Laundry on every floor. |
| 3 | `InUnit` | In-unit washer/dryer. |

### `KitchenScope`

| # | Member | Meaning |
|---|---|---|
| 0 | `None` | No kitchen access. |
| 1 | `Shared` | Communal, building or floor level; `details` says which. |
| 2 | `InUnit` | Kitchenette in the room ("en suite kitchen"). |

Floor-vs-building distinctions for `Shared` live in the `details` string, not as a separate enum
value.

### `GenderHousing`

| # | Member | Meaning |
|---|---|---|
| 0 | `CoEd` | Co-ed housing. |
| 1 | `WomenOnly` | Women only. |
| 2 | `MenOnly` | Men only. |
| 3 | `GenderInclusive` | Gender-inclusive housing. |

## "Value + details" wrapper pattern

`Bathrooms`, `AirConditioning`, `Kitchen`, `Laundry`, `CommonAreas`, `Gym` all follow one pattern:
a comparable/filterable value (enum, array, or boolean) plus an optional `details` string for a
freeform human blurb. Every attribute that needs to be both compared and described gets this
shape.

- `Bathrooms.types` is an array so a building with more than one bathroom style lists all of them.
- `CommonAreas.hasLounge` backs the "Common areas" filter.
- `Gym.available` is a plain boolean for filtering; `details` carries the description.

## Grouped types

- **`AmenityData`** holds everything the filter/survey/comparison UI reads: room types,
  bathrooms, AC, kitchen, laundry, common areas, gym, gender housing.
- **`Accessibility`** holds `wheelchairAccessible`, `serviceAnimalFriendly`, `groundFloorRooms`,
  `strobeAlarm` (strobe fire alarm & doorbell). Filled in per building as data becomes available.
- **`Atmosphere`** holds `socialness` / `noiseLevel`, 1-5 scales matching the survey sliders and
  review table. Both are optional since a building may not have data yet.
- **`Location`** holds `latitude`/`longitude` for a "distance from landmark" filter (no distance
  value is stored on the building itself), `closeBuildings` (a list of building ids for the
  "Closest Buildings" detail card), and an optional `note` for a human-written blurb.
- **`GalleryImage`** is `link` + `description`, one per photo.
- **`FloorPlan`** is `link` + `description` + `category` (`"roomType" | "floor"`) + optional
  `virtualTourLink`, which points to a walkthrough for that specific floor plan.
- **`Media`** holds `mainImage`, optional `icon`, `photos[]`, and `floorPlans[]`.
- **`Building`** is the top-level shape: `id`, `name`, `media`, `amenities`, `accessibility`,
  `atmosphere`, `location`, and optional `editorialTags` for hand-authored tags with no
  structured source.

## Tag derivation

`deriveTags(building)` in `tags.tsx` computes a building's tag ids from its structured fields, so
a tag can never drift out of sync with the data it is based on:

| Tag id | Derived from |
|---|---|
| `noKitchen` | `amenities.kitchen.scope === KitchenScope.None` |
| `limitedAC` | `amenities.ac.level === ACLevel.ByNecessity` |
| `noCentralAC` | `amenities.ac.level` is neither `None` nor `Central` |
| `basementLaundry` | `amenities.laundry.location === LaundryLocation.Basement` |
| `gymAccess` | `amenities.gym.available` |
| `girlsOnly` | `amenities.genderHousing === GenderHousing.WomenOnly` |
| `lgbtqInclusive` | `amenities.genderHousing === GenderHousing.GenderInclusive` |

`editorialTags` on a building are appended as-is, for a tag with no structured backing.

## Data loading

`buildings.ts` imports `buildings.json` and casts it to `Building[]`. `buildingTypes.ts` holds
every type and enum above, and is the single import source for the context, filter, survey, and
comparison consumers.
