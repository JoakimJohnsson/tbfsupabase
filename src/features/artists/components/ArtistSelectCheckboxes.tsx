import { useTranslation } from "react-i18next";
import type { Artist } from "../../../types";

interface IArtistSelectCheckboxes {
    artists: Artist[];
    selectedArtistIds: string[];
    onToggleArtist: (artistId: string) => void;
    idPrefix?: string;
    legendText?: string;
    showEmptyHint?: boolean;
}

export const ArtistSelectCheckboxes = ({
    artists,
    selectedArtistIds,
    onToggleArtist,
    idPrefix = "artist",
    legendText,
    showEmptyHint = true,
}: IArtistSelectCheckboxes) => {
    const { t } = useTranslation();

    return (
        <fieldset
            aria-describedby={showEmptyHint && selectedArtistIds.length === 0 ? `${idPrefix}-hint` : undefined}
            className="mb-3"
        >
            {legendText && <legend className="form-label col-form-label pt-0">{legendText}</legend>}
            <div className="form-scroll-box">
                {artists.length === 0 ? (
                    <span className="text-muted small">{t("features.artists.message.empty")}</span>
                ) : (
                    artists.map((artist) => {
                        const inputId = `${idPrefix}-${artist.id}`;
                        return (
                            <div className="form-check" key={artist.id}>
                                <input
                                    checked={selectedArtistIds.includes(artist.id)}
                                    className="form-check-input"
                                    id={inputId}
                                    name="artist-ids"
                                    onChange={() => onToggleArtist(artist.id)}
                                    type="checkbox"
                                />
                                <label className="form-check-label" htmlFor={inputId}>
                                    {artist.name}
                                </label>
                            </div>
                        );
                    })
                )}
            </div>
            {showEmptyHint && selectedArtistIds.length === 0 && (
                <div className="form-text" id={`${idPrefix}-hint`}>
                    {t("features.admin.record.create.noArtistsHint")}
                </div>
            )}
        </fieldset>
    );
};
