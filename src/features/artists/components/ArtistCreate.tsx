import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FormInput } from "../../../components/form/FormInput";
import { FormTextArea } from "../../../components/form/FormTextArea";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { FormCard } from "../../../components/cards/FormCard";
import { useTranslation } from "react-i18next";
import type { SubmitEvent } from "react";

interface IArtistCreate {
    handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    setName: (name: string) => void;
    name: string;
    setDescription: (description: string) => void;
    description: string;
    isSubmitting: boolean;
    loading: boolean;
    setArtistImageFile: (file: File | null) => void;
    artistImageFile: File | null;
}

export const ArtistCreate = ({
    handleSubmit,
    setName,
    name,
    setDescription,
    description,
    isSubmitting,
    loading,
    setArtistImageFile,
    artistImageFile,
}: IArtistCreate) => {
    const { t } = useTranslation();

    return (
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
    );
};
