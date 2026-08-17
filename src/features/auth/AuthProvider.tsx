import type {ReactNode} from "react";
import type {Session} from "@supabase/supabase-js";
import {useEffect, useState} from "react";
import {supabase} from "../../lib/supabase/client";
import type {Profile} from "../../types";
import {getProfile} from "./api/getProfile";
import {AuthContext} from "./AuthContext";

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isSessionLoading, setIsSessionLoading] = useState(true);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    useEffect(() => {
        let ignore = false;

        const loadSession = async () => {
            const {
                data: {session: currentSession},
                error,
            } = await supabase.auth.getSession();

            if (error) {
                console.error(error);
            }

            if (!ignore) {
                setSession(currentSession);
                setIsSessionLoading(false);
            }
        };

        void loadSession();

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (!ignore) {
                setSession(currentSession);
                setIsSessionLoading(false);
            }
        });

        return () => {
            ignore = true;
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const userId = session?.user.id;

        if (!userId) {
            setProfile(null);
            setIsProfileLoading(false);
            return;
        }

        let ignore = false;

        const loadProfile = async () => {
            setIsProfileLoading(true);

            try {
                const data = await getProfile(userId);

                if (!ignore) {
                    setProfile(data);
                }
            } catch (error) {
                console.error(error);

                if (!ignore) {
                    setProfile(null);
                }
            } finally {
                if (!ignore) {
                    setIsProfileLoading(false);
                }
            }
        };

        void loadProfile();

        return () => {
            ignore = true;
        };
    }, [session?.user.id]);

    const value = {
        session,
        user: session?.user ?? null,
        profile,
        isLoading: isSessionLoading || isProfileLoading,
    };

    return (
        <AuthContext value={value}>
            {children}
        </AuthContext>
    );
};