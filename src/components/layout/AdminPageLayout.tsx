import type { ReactNode } from "react";
interface AdminPageLayoutProps {
    title: string;
    lead?: string;
    sidebar: ReactNode;
    children: ReactNode;
}
export const AdminPageLayout = ({ title, lead, sidebar, children }: AdminPageLayoutProps) => {
    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h1 className="h2 fw-bold">{title}</h1>
                {lead && <p className="text-secondary mb-0">{lead}</p>}
            </div>
            <div className="row g-4">
                <aside className="col-12 col-lg-5 col-xl-4">{sidebar}</aside>
                <main className="col-12 col-lg-7 col-xl-8">{children}</main>
            </div>
        </div>
    );
};
