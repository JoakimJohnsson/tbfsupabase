import {Database} from "./lib/supabase/database.types.ts";

// Models
export type Artist = Database["public"]["Tables"]["artists"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// States
// Admin state constants.
export const ADMIN_STATE = {
    LOADING: "loading",
    AUTHORIZED: "authorized",
    UNAUTHORIZED: "unauthorized",
} as const;

// Admin state type derived from constants.
export type AdminState = (typeof ADMIN_STATE)[keyof typeof ADMIN_STATE];

// Inputs

export type CreateArtistInput = {
    name: string;
    description?: string;
};
