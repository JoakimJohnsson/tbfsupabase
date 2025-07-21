export type ID = string;
export type Year = number;

export interface ImageDTO {
    url: string;
}

export interface NamedEntityDTO {
    id: ID;
    name: string;
    iconName: string;
}

// Base DTO's

export interface PersonDTO {
    id: ID;
    firstName: string;
    lastName: string;
    description?: string;
    image?: ImageDTO;
}

export interface ArtistDTO {
    id: ID;
    type: ArtistType; // Solo or band
    name: string;
    genres: GenreDTO[];
    description?: string;
    members: PersonDTO[];
    image?: ImageDTO;
}

export interface AlbumDTO {
    id: ID;
    title: string;
    description?: string;
    coverImage?: ImageDTO;
    year: Year;
    albumType: AlbumTypeDTO;
    format: FormatDTO;
    artists: ArtistDTO[];
    tracks: TrackDTO[];
    genres: GenreDTO[];
}

export interface TrackDTO {
    id: ID;
    title: string;
    albumId: ID;
    artists: ArtistDTO[];
    trackNumber: number;
    numberOfPlays: number;
    audioUrl: string;
}

export type GenreDTO = NamedEntityDTO;
export type AlbumTypeDTO = NamedEntityDTO;
export type ArtistType = "solo" | "band";
export type FormatDTO = NamedEntityDTO;
