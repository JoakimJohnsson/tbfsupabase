import { Link } from "react-router";
import type { Artist } from "../../../types";

interface IArtistListItem {
    artist: Artist;
    to?: string;
    variant?: "row" | "card";
}

const buildClassName = (...classNames: Array<string | false | undefined>): string => {
    return classNames.filter(Boolean).join(" ");
};

export const ArtistListItem = ({ artist, to, variant = "row" }: IArtistListItem) => {
    const initial = artist.name.charAt(0).toUpperCase();
    const isCard = variant === "card";

    return (
        <div
            className={buildClassName(
                "tbf-artist-list-item",
                isCard
                    ? "tbf-artist-list-item--card card h-100 shadow-sm border-0 bg-body-tertiary"
                    : "tbf-artist-list-item--row",
            )}
        >
            <div className="tbf-artist-list-item__media">
                {artist.image_path ? (
                    <img alt={artist.name} className="tbf-artist-list-item__image" src={artist.image_path} />
                ) : (
                    <span className="tbf-artist-list-item__initial">{initial}</span>
                )}
            </div>

            <div className={buildClassName("tbf-artist-list-item__body", isCard && "card-body d-flex flex-column")}>
                {to ? (
                    <Link className={buildClassName("tbf-artist-list-item__name", !isCard && "stretched-link")} to={to}>
                        {artist.name}
                    </Link>
                ) : (
                    <span className="tbf-artist-list-item__name">{artist.name}</span>
                )}

                {artist.description && (
                    <p
                        className={buildClassName(
                            "tbf-artist-list-item__description",
                            isCard
                                ? "tbf-artist-list-item__description--card"
                                : "tbf-artist-list-item__description--row",
                        )}
                    >
                        {artist.description}
                    </p>
                )}
            </div>
        </div>
    );
};
