import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import type { RecordWithArtists } from "../../../types";
import { RecordListItem } from "./RecordListItem";

interface IRecordToolRow {
    record: RecordWithArtists;
    artistNames: string;
    handleStartEdit: (record: RecordWithArtists) => void;
    deletingRecordId: string | null;
    handleDeleteRecord: (record: RecordWithArtists) => void;
}

export const RecordToolRow = ({
    record,
    artistNames,
    handleStartEdit,
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
                        icon={faPenToSquare}
                        onClick={() => {
                            handleStartEdit(record);
                        }}
                        text={t("common.edit")}
                        variant="outline-secondary"
                    />
                    <ToolButton
                        icon={faTrashCan}
                        onClick={() => {
                            void handleDeleteRecord(record);
                        }}
                        text={deleteRecordText}
                        variant="outline-danger"
                    />
                </>
            }
        >
            <RecordListItem
                artistNames={artistNames || t("features.admin.records.message.noArtists")}
                record={record}
            />
        </ListRowItem>
    );
};
