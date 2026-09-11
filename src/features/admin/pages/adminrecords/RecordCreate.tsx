import {useTranslation} from "react-i18next";
import type {Artist} from "../../../../types.ts";
import {Dispatch, SetStateAction, type SubmitEvent} from "react";

interface RecordCreateProps {
    handleCreateRecord: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    setName: Dispatch<SetStateAction<string>>;
    name: string;
    setYear: Dispatch<SetStateAction<string>>;
    year: string;
    setDescription: Dispatch<SetStateAction<string>>;
    description: string;
    artists: Artist[];
    selectedArtistIds: string[];
    handleArtistCheckboxChange: (artistId: string) => void;
    isSubmitting: boolean;

}

export const RecordCreate = ({
                                 handleCreateRecord,
                                 setName,
                                 name,
                                 setYear,
                                 year,
                                 setDescription,
                                 description,
                                 artists,
                                 selectedArtistIds,
                                 handleArtistCheckboxChange,
                                 isSubmitting,
                             }: RecordCreateProps) => {

    const {t} = useTranslation();

    return (
        <>
            <h2>{t("features.admin.record.create.title")}</h2>

            <form onSubmit={handleCreateRecord}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="record-name">
                        {t("forms.name")}
                    </label>
                    <input className="form-control"
                           id="record-name"
                           onChange={(e) => {
                               setName(e.target.value);
                           }}
                           required
                           type="text"
                           value={name}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="record-year">
                        {t("forms.year")}
                    </label>
                    <input className="form-control"
                           id="record-year"
                           onChange={(e) => {
                               setYear(e.target.value);
                           }}
                           placeholder="YYYY"
                           type="number"
                           value={year}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="record-description">
                        {t("forms.description")}
                    </label>
                    <textarea className="form-control"
                              id="record-description"
                              onChange={(e) => {
                                  setDescription(e.target.value);
                              }}
                              rows={3}
                              value={description}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label d-block">
                        {t("features.admin.record.create.artistsLabel")}
                    </label>
                    <div className="border rounded p-2"
                         style={{maxHeight: "180px", overflowY: "auto"}}
                    >
                        {artists.length === 0 ? (
                            <span className="text-muted small">
                                {t("features.artists.message.empty")}
                            </span>
                        ) : (
                            artists.map((artist) => (
                                <div className="form-check" key={artist.id}>
                                    <input checked={selectedArtistIds.includes(artist.id)}
                                           className="form-check-input"
                                           id={`artist-${artist.id}`}
                                           onChange={() => {
                                               handleArtistCheckboxChange(artist.id);
                                           }}
                                           type="checkbox"
                                    />
                                    <label className="form-check-label"
                                           htmlFor={`artist-${artist.id}`}
                                    >
                                        {artist.name}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedArtistIds.length === 0 && (
                        <span className="form-text text-muted small">
                            {t("features.admin.record.create.noArtistsHint")}
                        </span>
                    )}
                </div>

                <button className="btn btn-primary" disabled={isSubmitting} type="submit">
                    {isSubmitting
                        ? t("features.admin.record.create.submitting")
                        : t("features.admin.record.create.submit")}
                </button>
            </form>
        </>
    );
};
