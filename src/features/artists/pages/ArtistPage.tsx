import {useEffect, useState} from "react";
import {useParams} from "react-router";
import type {Database} from "../../../lib/supabase/database.types";
import {getArtist} from "../api/getArtist";

type Artist = Database["public"]["Tables"]["artists"]["Row"];

export const ArtistPage = () => {
    const {artistSlug} = useParams();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!artistSlug) {
            return;
        }

        const loadArtist = async () => {
            try {
                const data = await getArtist(artistSlug);
                setArtist(data);
            } catch (error) {
                console.error(error);
                setError("Could not load artist.");
            }
        };

        void loadArtist();
    }, [artistSlug]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!artist) {
        return <p>Loading artist...</p>;
    }

    return (
        <>
            <h1>{artist.name}</h1>

            {artist.description && (
                <p>{artist.description}</p>
            )}
        </>
    );
};