import { useEffect, useState, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../api/updateProfile";
import { uploadImage, deleteImageFromStorage } from "../../../lib/supabase/storage";
import { Feedback } from "../../../components/feedback/Feedback";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { FormInput } from "../../../components/form/FormInput";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { Breadcrumbs } from "../../../components/navs/Breadcrumbs";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { type SimpleMessage } from "../../../types";

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, profile, setProfile } = useAuth();
    const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
    const [firstName, setFirstName] = useState(profile?.first_name ?? "");
    const [lastName, setLastName] = useState(profile?.last_name ?? "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(profile?.image_path ?? null);
    const [error, setError] = useState<SimpleMessage>(null);
    const [success, setSuccess] = useState<SimpleMessage>(null);
    const [warning, setWarning] = useState<SimpleMessage>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setCurrentImageUrl(profile?.image_path ?? null);
    }, [profile?.image_path]);

    useEffect(() => {
        setDisplayName(profile?.display_name ?? "");
        setFirstName(profile?.first_name ?? "");
        setLastName(profile?.last_name ?? "");
    }, [profile?.id, profile?.display_name, profile?.first_name, profile?.last_name]);

    if (!user || !profile) {
        return <SimpleSpinner />;
    }

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;
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

            const updatedProfile = await updateProfile(user.id, {
                display_name: displayName.trim() || null,
                first_name: firstName.trim() || null,
                last_name: lastName.trim() || null,
                image_path: imagePath,
            });
            setProfile(updatedProfile);
            setImageFile(null);
            setSuccess(t("features.auth.profile.updateSuccess"));

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
            setError(t("features.auth.profile.updateError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Breadcrumbs
                items={[{ label: t("navigation.home"), to: "/" }, { label: t("features.auth.profile.title") }]}
            />
            <div className="row justify-content-center">
                <section aria-labelledby="profile-heading" className="col-12 col-lg-8 col-xl-6">
                    <h1 className="h2 mb-2" id="profile-heading">
                        {t("features.auth.profile.title")}
                    </h1>
                    <p className="text-secondary mb-4">{t("features.auth.profile.lead")}</p>

                    <Feedback
                        errors={error ? [error] : []}
                        successes={success ? [success] : []}
                        warnings={warning ? [warning] : []}
                    />

                    <Card>
                        <CardBody padding="comfortable">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="profile-email">
                                    {t("features.auth.profile.email")}
                                </label>
                                <input
                                    autoComplete="email"
                                    className="form-control"
                                    disabled
                                    id="profile-email"
                                    name="email"
                                    type="email"
                                    value={user.email ?? ""}
                                />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <FormInput
                                    autoComplete="nickname"
                                    disabled={isSubmitting}
                                    id="profile-display-name"
                                    label={t("features.auth.profile.displayName")}
                                    name="display_name"
                                    onChange={setDisplayName}
                                    placeholder={t("features.auth.profile.displayNamePlaceholder")}
                                    value={displayName}
                                />
                                <FormInput
                                    autoComplete="given-name"
                                    disabled={isSubmitting}
                                    id="profile-first-name"
                                    label={t("features.auth.profile.firstName")}
                                    name="first_name"
                                    onChange={setFirstName}
                                    placeholder={t("features.auth.profile.firstNamePlaceholder")}
                                    value={firstName}
                                />
                                <FormInput
                                    autoComplete="family-name"
                                    disabled={isSubmitting}
                                    id="profile-last-name"
                                    label={t("features.auth.profile.lastName")}
                                    name="last_name"
                                    onChange={setLastName}
                                    placeholder={t("features.auth.profile.lastNamePlaceholder")}
                                    value={lastName}
                                />
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
                                    {isSubmitting
                                        ? t("features.auth.profile.submitting")
                                        : t("features.auth.profile.save")}
                                </button>
                            </form>
                        </CardBody>
                    </Card>
                </section>
            </div>
        </>
    );
};
