import { type SubmitEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { faPenToSquare, faPlus } from "@fortawesome/pro-solid-svg-icons";
import { createArtist } from "../../artists/api/createArtist";
import { getArtists } from "../../artists/api/getArtists";
import { ArtistListItem } from "../../artists/components/ArtistListItem";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { Feedback } from "../../../components/feedback/Feedback";
import { FormInput } from "../../../components/form/FormInput";
import { FormTextArea } from "../../../components/form/FormTextArea";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { AdminPageLayout } from "../../../components/layout/AdminPageLayout";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { FormCard } from "../../../components/cards/FormCard";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import type { Artist, SimpleMessage } from "../../../types";
import { uploadImage } from "../../../lib/supabase/storage";

export const AdminArtistsPage = () => {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [artistImageFile, setArtistImageFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadError, setLoadError] = useState<SimpleMessage>(null);
    const [submitError, setSubmitError] = useState<SimpleMessage>(null);
    const [submitSuccess, setSubmitSuccess] = useState<SimpleMessage>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setLoadError(null);

        const loadErrorMessage = t("features.artists.error.loadError");
        const controller = new AbortController();

        const loadArtists = async () => {
            try {
                const data = await getArtists(controller.signal);
                setArtists(data);
            } catch (error) {
                if (!isAbortError(error)) {
                    console.error(error);
                    setLoadError(loadErrorMessage);
                    setArtists([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadArtists();

        return () => {
            controller.abort();
        };
    }, [t]);

    const filteredArtists = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return artists;
        return artists.filter((artist) => artist.name.toLowerCase().includes(query));
    }, [artists, searchTerm]);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitError(null);
        setSubmitSuccess(null);
        setIsSubmitting(true);

        try {
            const trimmedName = name.trim();

            if (!trimmedName) {
                setSubmitError(t("features.admin.artist.create.error.invalidNameError"));
                return;
            }

            let imagePath: string | undefined;

            if (artistImageFile) {
                imagePath = await uploadImage(artistImageFile, "artists", trimmedName);
            }

            const createdArtist = await createArtist({
                name: trimmedName,
                description,
                image_path: imagePath,
            });

            setArtists((currentArtists) =>
                [...currentArtists, createdArtist].sort((a, b) => a.name.localeCompare(b.name)),
            );

            setName("");
            setDescription("");
            setArtistImageFile(null);
            setSubmitSuccess(t("features.admin.artist.create.success.createSuccess"));
        } catch (err) {
            console.error(err);
            setSubmitError(t("features.admin.artist.create.error.createError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <SimpleSpinner />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <AdminPageLayout
            lead={t("features.admin.artists.lead")}
            sidebar={
                <FormCard icon={faPlus} title={t("features.admin.artist.create.title")}>
                    <form onSubmit={handleSubmit}>
                        <FormInput
                            id="name"
                            label={t("forms.name")}
                            name="name"
                            onChange={setName}
                            required
                            type="text"
                            value={name}
                        />

                        <FormTextArea
                            id="description"
                            label={t("forms.description")}
                            name="description"
                            onChange={setDescription}
                            rows={4}
                            value={description}
                        />

                        <ImageUploader
                            disabled={isSubmitting || loading}
                            id="artist-image-create"
                            label={t("forms.artistImage")}
                            onFileSelect={setArtistImageFile}
                            selectedFile={artistImageFile}
                        />

                        <button className="btn btn-primary w-100" disabled={isSubmitting || loading} type="submit">
                            {isSubmitting
                                ? t("features.admin.artist.create.submitting")
                                : t("features.admin.artist.create.submit")}
                        </button>
                    </form>
                </FormCard>
            }
            title={t("features.admin.artists.title")}
        >
            <Feedback errors={[submitError]} successes={[submitSuccess]} />
            <SearchToolbar
                countText={
                    <>
                        {filteredArtists.length}{" "}
                        {filteredArtists.length === 1
                            ? t("features.admin.artist.title")
                            : t("features.admin.artists.title")}
                    </>
                }
                onSearchChange={setSearchTerm}
                searchPlaceholder={t("features.admin.artists.search")}
                searchValue={searchTerm}
                showSearch={artists.length > 5}
                title={t("features.admin.artists.list.title")}
            />

            {filteredArtists.length === 0 ? (
                <EmptyStateCard message={t("features.artists.message.empty")} />
            ) : (
                <ul className="list-group shadow-sm">
                    {filteredArtists.map((artist) => (
                        <ListRowItem
                            actions={
                                <ToolButton
                                    className="position-relative z-2"
                                    icon={faPenToSquare}
                                    text={t("common.edit")}
                                    to={`/admin/artists/${artist.slug}`}
                                    variant="outline-secondary"
                                />
                            }
                            className="list-group-item-action p-3"
                            key={artist.id}
                        >
                            <ArtistListItem artist={artist} to={`/admin/artists/${artist.slug}`} />
                        </ListRowItem>
                    ))}
                </ul>
            )}
        </AdminPageLayout>
    );
};
