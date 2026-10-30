import { Link } from "react-router";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
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

    const media = (
        <div className="tbf-artist-list-item__media">
            {artist.image_path ? (
                <img alt={artist.name} className="tbf-artist-list-item__image" src={artist.image_path} />
            ) : (
                <span className="tbf-artist-list-item__initial">{initial}</span>
            )}
        </div>
    );

    const content = (
        <>
            {to ? (
                <Link className="tbf-artist-list-item__name stretched-link" to={to}>
                    {artist.name}
                </Link>
            ) : (
                <span className="tbf-artist-list-item__name">{artist.name}</span>
            )}

            {artist.description && (
                <p
                    className={buildClassName(
                        "tbf-artist-list-item__description",
                        isCard ? "tbf-artist-list-item__description--card" : "tbf-artist-list-item__description--row",
                    )}
                >
                    {artist.description}
                </p>
            )}
        </>
    );

    if (isCard) {
        return (
            <Card className="tbf-artist-list-item tbf-artist-list-item--card h-100">
                {media}
                <CardBody className="tbf-artist-list-item__body d-flex flex-column">{content}</CardBody>
            </Card>
        );
    }

    return (
        <div className="tbf-artist-list-item tbf-artist-list-item--row">
            {media}
            <div className="tbf-artist-list-item__body">{content}</div>
        </div>
    );
};
