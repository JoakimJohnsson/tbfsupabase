import React from "react";
import { useTranslation } from "react-i18next";

interface AdminPageLayoutProps {
    title: string;
    lead?: string;
    sidebar: React.ReactNode;
    children: React.ReactNode;
    breadcrumbs?: React.ReactNode;
}

export const AdminPageLayout = ({ title, lead, sidebar, children, breadcrumbs }: AdminPageLayoutProps) => {
    const { t } = useTranslation();

    return (
        <>
            {breadcrumbs}
            <h1 className={"mt-3"}>{title}</h1>
            {lead && <p className="lead">{lead}</p>}

            <div className="row g-4">
                <section aria-label={t("features.admin.ariaLabels.editor")} className="col-12 col-lg-5 col-xl-4">
                    {sidebar}
                </section>
                <div className="col-12 col-lg-7 col-xl-8">{children}</div>
            </div>
        </>
    );
};
