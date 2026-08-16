import type {SubmitEvent} from "react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {signIn} from "../api/signIn";

export const LoginPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

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
            navigate("/");
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

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label
                        className="form-label"
                        htmlFor="email"
                    >
                        {t("forms.email")}
                    </label>

                    <input
                        autoComplete="email"
                        className="form-control"
                        id="email"
                        name="email"
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        required
                        type="email"
                        value={email}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="form-label"
                        htmlFor="password"
                    >
                        {t("forms.password")}
                    </label>

                    <input
                        autoComplete="current-password"
                        className="form-control"
                        id="password"
                        name="password"
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        required
                        type="password"
                        value={password}
                    />
                </div>

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
