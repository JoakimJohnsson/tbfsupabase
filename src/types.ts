import {Database} from "./lib/supabase/database.types.ts";
import type {Session, User} from "@supabase/supabase-js";

// Models
export type Artist = Database["public"]["Tables"]["artists"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type SimpleMessage = string | null;
export type SimpleMessageList = SimpleMessage[];

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

// Context values
export type AuthContextValue = {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
};
