import {supabase} from "../../../lib/supabase/client";

export const signIn = async (email: string, password: string) => {
    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }
};