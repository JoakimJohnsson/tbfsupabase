import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import type { RecordWithArtists } from "../../../types";
import { RecordListItem } from "./RecordListItem";

interface IRecordToolRow {
    record: RecordWithArtists;
    artistNames: string;
    isEditing: boolean;
    handleStartEdit: (record: RecordWithArtists) => void;
    handleCancelEdit: () => void;
    deletingRecordId: string | null;
    handleDeleteRecord: (record: RecordWithArtists) => void;
}

export const RecordToolRow = ({
    record,
    artistNames,
    isEditing,
    handleStartEdit,
    handleCancelEdit,
    deletingRecordId,
    handleDeleteRecord,
}: IRecordToolRow) => {
    const { t } = useTranslation();
    const deleteRecordText =
        deletingRecordId === record.id ? t("features.admin.records.deleteRecord.deleting") : t("common.delete");

    return (
        <ListRowItem
            actions={
                <>
                    <ToolButton
                        ariaLabel={isEditing ? t("common.cancel") : t("common.edit")}
                        icon={isEditing ? faXmark : faPenToSquare}
                        onClick={() => (isEditing ? handleCancelEdit() : handleStartEdit(record))}
                        size="sm"
                        text={isEditing ? t("common.cancel") : t("common.edit")}
                        variant={isEditing ? "secondary" : "outline-secondary"}
                    />
                    <ToolButton
                        ariaLabel={deleteRecordText}
                        disabled={isEditing || deletingRecordId !== null}
                        icon={faTrashCan}
                        onClick={() => {
                            void handleDeleteRecord(record);
                        }}
                        size="sm"
                        text={deleteRecordText}
                        variant="outline-danger"
                    />
                </>
            }
            className={`py-2${isEditing ? " bg-primary-subtle" : ""}`}
        >
            <RecordListItem
                artistNames={artistNames || t("features.admin.records.message.noArtists")}
                record={record}
            />
        </ListRowItem>
    );
};
