import {
    faCompactDisc,
    faDiscDrive,
    faMusic,
    faTape,
    faWaveformLines,
    type IconDefinition,
} from "@fortawesome/pro-solid-svg-icons";

export const RECORD_FORMATS = [
    "vinyl-7",
    "vinyl-12",
    "cd",
    "cdr",
    "cassette",
    "digital",
] as const;

export type RecordFormat = (typeof RECORD_FORMATS)[number];

export const RECORD_TYPES = [
    "album",
    "ep",
    "single",
    "compilation",
    "split",
] as const;

export type RecordType = (typeof RECORD_TYPES)[number];

// Clean 1-to-1 mapping from format ID to FontAwesome icon
export const RECORD_FORMAT_ICONS: Record<RecordFormat, IconDefinition> = {
    "vinyl-7": faCompactDisc,
    "vinyl-12": faCompactDisc,
    cd: faCompactDisc,
    cdr: faDiscDrive,
    cassette: faTape,
    digital: faWaveformLines,
};

export const RECORD_TYPE_ICONS: Record<RecordType, IconDefinition> = {
    album: faMusic,
    ep: faMusic,
    single: faMusic,
    compilation: faMusic,
    split: faMusic,
};
