import {useEffect, useState} from "react";
import type {Database} from "../../../lib/supabase/database.types";
import {getArtists} from "../api/getArtists";
import {Link} from "react-router";

type Artist = Database["public"]["Tables"]["artists"]["Row"];

export const ArtistsPage = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadArtists = async () => {
            try {
                const data = await getArtists();
                setArtists(data);
            } catch (error) {
                console.error(error);
                setError("Could not load artists.");
            }
        };

        void loadArtists();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <h1>Artists</h1>

            <ul>
                {artists.map((artist) => (
                    <li key={artist.id}>
                        <Link to={`/artists/${artist.slug}`}>
                            {artist.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};