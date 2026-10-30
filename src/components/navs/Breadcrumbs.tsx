import { Link } from "react-router";

export interface BreadcrumbItem {
    label: string;
    to?: string;
}

interface IBreadcrumbs {
    items: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumbs = ({ items, className = "" }: IBreadcrumbs) => {
    if (items.length <= 1) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className={className}>
            <ol className="breadcrumb mb-0">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return isLast ? (
                        <li className="breadcrumb-item active" aria-current="page" key={item.label}>
                            {item.label}
                        </li>
                    ) : (
                        <li className="breadcrumb-item" key={item.label}>
                            <Link to={item.to ?? "#"}>{item.label}</Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
