import { faSearch } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

interface SearchToolbarProps {
    title: ReactNode;
    countText: ReactNode;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    showSearch?: boolean;
}

export const SearchToolbar = ({
    title,
    countText,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    showSearch = true,
}: SearchToolbarProps) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="h4 fw-bold mb-0">{title}</h2>
            <div className="text-secondary small">{countText}</div>
            {showSearch && (
                <div className="input-group input-group-sm w-auto">
                    <span className="input-group-text bg-body border-end-0">
                        <FontAwesomeIcon className="text-muted" icon={faSearch} />
                    </span>
                    <input
                        aria-label={searchPlaceholder}
                        className="form-control border-start-0"
                        onChange={(event) => {
                            onSearchChange(event.target.value);
                        }}
                        placeholder={searchPlaceholder}
                        type="search"
                        value={searchValue}
                    />
                </div>
            )}
        </div>
    );
};

