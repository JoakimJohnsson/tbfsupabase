import {Database} from "./lib/supabase/database.types.ts";
import type {Session, User} from "@supabase/supabase-js";

// Models
export type Artist = Database["public"]["Tables"]["artists"]["Row"];
export type Record = Database["public"]["Tables"]["records"]["Row"];
export type RecordArtist = Database["public"]["Tables"]["record_artists"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type SimpleMessage = string | null;
export type SimpleMessageList = SimpleMessage[];

export type RecordArtistRelation = RecordArtist & {
    artists: {
        id: string;
        name: string;
        slug: string;
    } | null;
};

export type RecordWithArtists = Record & {
    record_artists: RecordArtistRelation[];
};

// Inputs
export type CreateArtistInput = {
    name: string;
    description?: string;
};

export type UpdateArtistInput = {
    id: string;
    name: string;
    description?: string;
};

export type CreateRecordInput = {
    artist_ids: string[];
    name: string;
    description?: string;
    format?: string;
    type?: string;
    year?: number;
};

export type UpdateRecordInput = {
    id: string;
    name: string;
    description?: string;
    format?: string;
    type?: string;
    year?: number;
};

// Context values
export type AuthContextValue = {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
};
