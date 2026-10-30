import type { SubmitEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { signIn } from "../api/signIn";
import { Feedback } from "../../../components/feedback/Feedback";
import { FormInput } from "../../../components/form/FormInput";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";

export const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const redirectTo = from ? `${from.pathname}${from.search}${from.hash}` : "/";

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
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-lg-5">
                    <Card className="shadow-sm border">
                        <CardBody padding="comfortable">
                            <div className="text-center mb-4">
                                <h1 className="h3 fw-bold mb-1">{t("features.auth.login.title")}</h1>
                                <p className="text-secondary small mb-0">{t("features.auth.login.lead")}</p>
                            </div>

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

                                <div className="d-grid mt-4">
                                    <button
                                        className="btn btn-primary py-2 fw-semibold"
                                        disabled={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? t("features.auth.login.submitting")
                                            : t("features.auth.login.submit")}
                                    </button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};
