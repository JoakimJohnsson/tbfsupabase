import type { SubmitEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { signIn } from "../api/signIn";
import Feedback from "../../../components/feedback/Feedback";
import { FormInput } from "../../../components/form";

export const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const redirectTo = from
        ? `${from.pathname}${from.search}${from.hash}`
        : "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError(null);
        setIsSubmitting(true);

        try {
            await signIn(email, password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            console.error(err);
            setError(t("features.auth.login.error.loginError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1>{t("features.auth.login.title")}</h1>

            <Feedback errors={[error]} />

            <form onSubmit={handleSubmit}>
                <FormInput
                    autoComplete="email"
                    id="email"
                    label={t("forms.email")}
                    name="email"
                    onChange={setEmail}
                    required
                    type="email"
                    value={email}
                />

                <FormInput
                    autoComplete="current-password"
                    id="password"
                    label={t("forms.password")}
                    name="password"
                    onChange={setPassword}
                    required
                    type="password"
                    value={password}
                />

                <button
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting
                        ? t("features.auth.login.submitting")
                        : t("features.auth.login.submit")}
                </button>
            </form>
        </>
    );
};
