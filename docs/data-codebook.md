# Building Data Codebook

Field-by-field reference for `apps/frontend/src/data/buildingTypes.ts`, `buildings.json`, and `tags.tsx`.

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
│  ├─ closeBuildings[] string (campus building ids)
│  └─ note?            string
└─ editorialTags?[]    string
```

## Enums

All enums below are string enums. The `Value` column is the string stored in `buildings.json`, returned by the enum at runtime, and used as the label of the Postgres enum of the same name in the `dorm` table (see [database-schema.md](database-schema.md#building-enums)). Keep the three in sync when adding a member.

### `RoomType`

| Value | Member | Meaning |
| -- | -- | -- |
| `trad_single` | `TradSingle` | Traditional-style single, shared hallway bathroom. |
| `trad_double` | `TradDouble` | Traditional-style double, shared hallway bathroom. |
| `trad_triple` | `TradTriple` | Traditional-style triple, shared hallway bathroom. |
| `semi_suite_single` | `SemiSuiteSingle` | Semi-suite single, bathroom shared with an adjacent suite. |
| `semi_suite_double` | `SemiSuiteDouble` | Semi-suite double, bathroom shared with an adjacent suite. |
| `semi_suite_triple` | `SemiSuiteTriple` | Semi-suite triple, bathroom shared with an adjacent suite. |
| `semi_suite_quad` | `SemiSuiteQuad` | Semi-suite, four occupants. |
| `apartment_triple` | `ApartmentTriple` | Apartment-style triple. |
| `studio_apartment_single` | `StudioApartmentSingle` | Studio apartment, single occupant. |
| `studio_apartment_double` | `StudioApartmentDouble` | Studio apartment, two occupants. |

### `BathroomType`

| Value | Member | Meaning |
| -- | -- | -- |
| `communal` | `Communal` | Shared per floor/wing, traditional style. |
| `shared_suite` | `SharedSuite` | Shared with one adjacent suite, semi-suite style. |
| `private` | `Private` | Truly en-suite / in-room, apartment style only. |

### `ACLevel`

| Value | Member | Meaning |
| -- | -- | -- |
| `none` | `None` | No AC. |
| `by_necessity` | `ByNecessity` | Accommodation, triple, or lottery-only AC. |
| `window` | `Window` | Window units, not central. |
| `central` | `Central` | Full central AC. |

### `LaundryLocation`

| Value | Member | Meaning |
| -- | -- | -- |
| `none` | `None` | No laundry. |
| `basement` | `Basement` | Basement only. |
| `each_floor` | `EachFloor` | Laundry on every floor. |
| `in_unit` | `InUnit` | In-unit washer/dryer. |

### `KitchenScope`

| Value | Member | Meaning |
| -- | -- | -- |
| `none` | `None` | No kitchen access. |
| `shared` | `Shared` | Communal, building or floor level; `details` says which. |
| `in_unit` | `InUnit` | Kitchenette in the room ("en suite kitchen"). |

Floor-vs-building distinctions for `Shared` live in the `details` string, not as a separate enum value.

### `GenderHousing`

| Value | Member | Meaning |
| -- | -- | -- |
| `co_ed` | `CoEd` | Co-ed housing. |
| `women_only` | `WomenOnly` | Women only. |
| `men_only` | `MenOnly` | Men only. |
| `gender_inclusive` | `GenderInclusive` | Gender-inclusive housing. |

## "Value + details" wrapper pattern

`Bathrooms`, `AirConditioning`, `Kitchen`, `Laundry`, `CommonAreas`, `Gym` all follow one pattern: a comparable/filterable value (enum, array, or boolean) plus an optional `details` string for a freeform human blurb. Every attribute that needs to be both compared and described gets this shape.

- `Bathrooms.types` is an array so a building with more than one bathroom style lists all of them.
- `CommonAreas.hasLounge` backs the "Common areas" filter.
- `Gym.available` is a plain boolean for filtering; `details` carries the description.
- `details` should add what the value can't say (for example which floors share a bathroom), not restate it. The AC and kitchen cards show `details` in place of the value's label, so a `details` string there should still name the value.

## Grouped types

- **`AmenityData`** holds everything the filter/survey/comparison UI reads: room types, bathrooms, AC, kitchen, laundry, common areas, gym, gender housing.
- **`Accessibility`** holds `wheelchairAccessible`, `serviceAnimalFriendly`, `groundFloorRooms`, `strobeAlarm` (strobe fire alarm & doorbell). Filled in per building as data becomes available.
- **`Atmosphere`** holds `socialness` / `noiseLevel`, 1-5 scales matching the survey sliders and review table. Both are optional since a building may not have data yet.
- **`Location`** holds `latitude`/`longitude` for a "distance from landmark" filter (no distance value is stored on the building itself), `closeBuildings` (ids of the four nearest academic or non-residential campus buildings, nearest first, for the "Closest Buildings" detail card; they are listed in `campusBuildings.json`, not in `buildings.json`), and an optional `note` for a human-written blurb.
- **`CampusBuilding`** is `id` + `name` + `latitude` + `longitude`, one per academic or non-residential building in `campusBuildings.json` (plus Resnik, which is also a food hall). It feeds the "Distance from" filter options and the `closeBuildings` ids; add a row there to offer a new landmark.
- **`GalleryImage`** is `link` + `description`, one per photo.
- **`FloorPlan`** is `link` + `description` + `category` (`"roomType" | "floor"`) + optional `virtualTourLink`, which points to a walkthrough for that specific floor plan.
- **`Media`** holds `mainImage`, optional `icon`, `photos[]`, and `floorPlans[]`.
- **`Building`** is the top-level shape: `id`, `name`, `media`, `amenities`, `accessibility`, `atmosphere`, `location`, and optional `editorialTags` for hand-authored tags with no structured source.

## Filter scoring

`scoreBuilding` in `scoring.ts` scores a building against the filter panel. Set controls add points; missing data adds nothing and never subtracts:

| Filter control | Scored from |
| -- | -- |
| Air conditioning | `amenities.ac.level` is `Window` or `Central` |
| Laundry on each floor | `amenities.laundry.location` is `EachFloor` |
| En suite bathroom | `amenities.bathrooms.types` has `SharedSuite` or `Private` |
| En suite kitchen | `amenities.kitchen.scope` is `InUnit` |
| Single room | `amenities.roomTypes` has a single-occupant type |
| Service Animal | `accessibility.serviceAnimalFriendly` |
| Wheelchair accessible | `accessibility.wheelchairAccessible` |
| Socialness, Noise Level | `atmosphere.socialness`, `atmosphere.noiseLevel` |
| Distance from | straight-line distance from the dorm's coordinates to the chosen campus building in `campusBuildings.json`; full points at 0 m, fading to 0 at 800 m |

`atmosphere` and `accessibility` flags are empty so those score 0. `groupBuildings` sorts by score into `bestFit`, `decentFit`, and `wildCard`, three per row.

## Tag derivation

`deriveTags(building)` in `tags.tsx` computes a building's tag ids from its structured fields, so a tag can never drift out of sync with the data it is based on:

| Tag id | Derived from |
| -- | -- |
| `noKitchen` | `amenities.kitchen.scope === KitchenScope.None` |
| `limitedAC` | `amenities.ac.level === ACLevel.ByNecessity` |
| `noCentralAC` | `amenities.ac.level` is neither `None` nor `Central` |
| `gymAccess` | `amenities.gym.available` |
| `girlsOnly` | `amenities.genderHousing === GenderHousing.WomenOnly` |
| `lgbtqInclusive` | `amenities.genderHousing === GenderHousing.GenderInclusive` |

`editorialTags` on a building are appended as-is, for a tag with no structured backing.

## Data loading

`buildings.ts` imports `buildings.json` and casts it to `Building[]`. `buildingTypes.ts` holds every type and enum above, and is the single import source for the context, filter, survey, and comparison consumers.
