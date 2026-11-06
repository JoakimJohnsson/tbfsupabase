import { useEffect, useState, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/hooks/useAuth";
import { updateProfileImage } from "../api/updateProfileImage";
import { uploadImage, deleteImageFromStorage } from "../../../lib/supabase/storage";
import { Feedback } from "../../../components/feedback/Feedback";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { type SimpleMessage } from "../../../types";

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, profile, setProfile } = useAuth();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(profile?.image_path ?? null);
    const [error, setError] = useState<SimpleMessage>(null);
    const [success, setSuccess] = useState<SimpleMessage>(null);
    const [warning, setWarning] = useState<SimpleMessage>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setCurrentImageUrl(profile?.image_path ?? null);
    }, [profile?.image_path]);

    if (!user || !profile) {
        return <SimpleSpinner />;
    }

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setWarning(null);
        setIsSubmitting(true);

        let uploadedImageUrl: string | null = null;
        const previousImageUrl = profile.image_path;

        try {
            let imagePath = currentImageUrl;
            if (imageFile) {
                uploadedImageUrl = await uploadImage(imageFile, "profiles", user.id);
                imagePath = uploadedImageUrl;
            }

            const updatedProfile = await updateProfileImage(user.id, imagePath);
            setProfile(updatedProfile);
            setImageFile(null);
            setSuccess(t("features.profile.saved"));

            if (previousImageUrl && previousImageUrl !== imagePath) {
                try {
                    await deleteImageFromStorage(previousImageUrl);
                } catch (cleanupError) {
                    console.error(cleanupError);
                    setWarning(t("features.profile.cleanupWarning"));
                }
            }
        } catch (submitError) {
            console.error(submitError);
            if (uploadedImageUrl) {
                try {
                    await deleteImageFromStorage(uploadedImageUrl);
                } catch (cleanupError) {
                    console.error(cleanupError);
                }
            }
            setError(t("features.profile.saveError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <section aria-labelledby="profile-heading" className="col-12 col-lg-8 col-xl-6">
                    <h1 className="h2 mb-2" id="profile-heading">
                        {t("features.profile.title")}
                    </h1>
                    <p className="text-secondary mb-4">{t("features.profile.lead")}</p>

                    <Feedback
                        errors={error ? [error] : []}
                        successes={success ? [success] : []}
                        warnings={warning ? [warning] : []}
                    />

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <p className="mb-3">
                                <span className="fw-semibold">{t("features.profile.email")}: </span>
                                {user.email}
                            </p>
                            <form onSubmit={handleSubmit}>
                                <ImageUploader
                                    currentImageUrl={currentImageUrl}
                                    disabled={isSubmitting}
                                    id="profile-image-upload"
                                    label={t("features.profile.image")}
                                    onFileSelect={setImageFile}
                                    onRemoveCurrent={() => setCurrentImageUrl(null)}
                                    selectedFile={imageFile}
                                />
                                <button className="btn btn-primary" disabled={isSubmitting} type="submit">
                                    {isSubmitting ? t("common.loading") : t("features.profile.save")}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
