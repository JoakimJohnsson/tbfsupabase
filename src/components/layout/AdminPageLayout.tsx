import React from "react";
import { useTranslation } from "react-i18next";

interface AdminPageLayoutProps {
    title: string;
    lead?: string;
    sidebar: React.ReactNode;
    children: React.ReactNode;
}

export const AdminPageLayout = ({ title, lead, sidebar, children }: AdminPageLayoutProps) => {
    const { t } = useTranslation();

    return (
        <main className="container-fluid" id="main-content">
            <header className="mb-4">
                <h1 className="h2 fw-bold">{title}</h1>
                {lead && <p className="text-secondary mb-0">{lead}</p>}
            </header>
            <div className="row g-4">
                <aside aria-label={t("features.admin.ariaLabels.sidebar")} className="col-12 col-lg-5 col-xl-4">
                    {sidebar}
                </aside>
                <div className="col-12 col-lg-7 col-xl-8">{children}</div>
            </div>
        </main>
    );
};
