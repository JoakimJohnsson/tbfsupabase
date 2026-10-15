import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../../components/lists/ListRowItem";
import type { Person } from "../../../../types";
import { ArtistMemberItem } from "./ArtistMemberItem";

interface IArtistMemberToolRow {
    member: Person;
    isEditing: boolean;
    onStartEdit: (member: Person) => void;
    onCancelEdit: () => void;
    onDelete: (member: Person) => void;
}

export const ArtistMemberToolRow = ({
    member,
    isEditing,
    onStartEdit,
    onCancelEdit,
    onDelete,
}: IArtistMemberToolRow) => {
    const { t } = useTranslation();
    const fullName = `${member.first_name} ${member.last_name}`;

    return (
        <ListRowItem
            actions={
                <>
                    <ToolButton
                        ariaLabel={isEditing ? t("common.cancel") : `${t("common.edit")} ${fullName}`}
                        icon={isEditing ? faXmark : faPenToSquare}
                        onClick={() => (isEditing ? onCancelEdit() : onStartEdit(member))}
                        size="sm"
                        text={isEditing ? t("common.cancel") : t("common.edit")}
                        variant={isEditing ? "secondary" : "outline-secondary"}
                    />
                    <ToolButton
                        ariaLabel={`${t("common.remove")} ${fullName}`}
                        disabled={isEditing}
                        icon={faTrashCan}
                        onClick={() => onDelete(member)}
                        size="sm"
                        text={t("common.remove")}
                        variant="outline-danger"
                    />
                </>
            }
            className={`py-2${isEditing ? " bg-primary-subtle" : ""}`}
        >
            <ArtistMemberItem member={member} />
        </ListRowItem>
    );
};
