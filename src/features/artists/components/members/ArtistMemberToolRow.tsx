import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../../components/lists/ListRowItem";
import type { Person } from "../../../../types";
import { ArtistMemberItem } from "./ArtistMemberItem";

interface IArtistMemberToolRow {
    member: Person;
    onStartEdit: (member: Person) => void;
    onDelete: (member: Person) => void;
}

export const ArtistMemberToolRow = ({ member, onStartEdit, onDelete }: IArtistMemberToolRow) => {
    const { t } = useTranslation();
    const fullName = `${member.first_name} ${member.last_name}`;

    return (
        <ListRowItem
            actions={
                <>
                    <ToolButton
                        ariaLabel={`${t("common.edit")} ${fullName}`}
                        icon={faPenToSquare}
                        onClick={() => onStartEdit(member)}
                        size="sm"
                        text={t("common.edit")}
                        variant="outline-secondary"
                    />
                    <ToolButton
                        ariaLabel={`${t("common.remove")} ${fullName}`}
                        icon={faTrashCan}
                        onClick={() => onDelete(member)}
                        size="sm"
                        text={t("common.remove")}
                        variant="outline-danger"
                    />
                </>
            }
            className="py-2"
        >
            <ArtistMemberItem member={member} />
        </ListRowItem>
    );
};
