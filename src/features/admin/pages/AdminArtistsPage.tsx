import { type SubmitEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { faPenToSquare } from "@fortawesome/pro-solid-svg-icons";
import { createArtist } from "../../artists/api/createArtist";
import { useArtists } from "../../artists/hooks/useArtists";
import { ArtistListItem } from "../../artists/components/ArtistListItem";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { Feedback } from "../../../components/feedback/Feedback";
import { AdminPageLayout } from "../../../components/layout/AdminPageLayout";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import type { SimpleMessage } from "../../../types";
import { uploadImage } from "../../../lib/supabase/storage";
import { ArtistCreate } from "../../artists/components/ArtistCreate";

export const AdminArtistsPage = () => {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [artistImageFile, setArtistImageFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [submitError, setSubmitError] = useState<SimpleMessage>(null);
    const [submitSuccess, setSubmitSuccess] = useState<SimpleMessage>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { artists, setArtists, loading, loadError } = useArtists({
        loadErrorMessage: t("features.artists.error.loadError"),
    });

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
                [...currentArtists, createdArtist].sort((a, b) => a.name.localeCompare(b.name, "sv")),
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
            breadcrumbs={undefined}
            sidebar={
                <div className="sticky-top-offset">
                    <ArtistCreate
                        handleSubmit={handleSubmit}
                        setName={setName}
                        name={name}
                        setDescription={setDescription}
                        description={description}
                        isSubmitting={isSubmitting}
                        loading={loading}
                        setArtistImageFile={setArtistImageFile}
                        artistImageFile={artistImageFile}
                    />
                </div>
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
                            className="p-3"
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
