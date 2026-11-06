import { useTranslation } from "react-i18next";
import { FormSelect } from "../form/FormSelect";
import { CATALOGUE_SORTS, type CatalogueSort } from "../../lib/helpers/sortHelpers";

interface CatalogueSortSelectProps {
    id: string;
    value: CatalogueSort;
    onChange: (value: CatalogueSort) => void;
}

export const CatalogueSortSelect = ({ id, value, onChange }: CatalogueSortSelectProps) => {
    const { t } = useTranslation();

    return (
        <FormSelect
            containerClassName="mb-3"
            id={id}
            label={t("catalogue.sort.label")}
            onChange={(value) => {
                const sort = CATALOGUE_SORTS.find((option) => option === value);
                if (!sort) {
                    console.error("Invalid catalogue sort order", value);
                    return;
                }
                onChange(sort);
            }}
            options={CATALOGUE_SORTS.map((sort) => ({ value: sort, label: t(`catalogue.sort.${sort}`) }))}
            value={value}
        />
    );
};
