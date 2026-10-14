import { faUser } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Person } from "../../../../types";

interface IArtistMemberItem {
    member: Person;
}

export const ArtistMemberItem = ({ member }: IArtistMemberItem) => {
    const fullName = `${member.first_name} ${member.last_name}`;

    return (
        <div className="d-flex align-items-center gap-2">
            <div className="tbf-member-avatar">
                {member.image_path ? (
                    <img alt={fullName} className="w-100 h-100 object-fit-cover" src={member.image_path} />
                ) : (
                    <FontAwesomeIcon icon={faUser} size="sm" />
                )}
            </div>
            <span className="fw-semibold">{fullName}</span>
        </div>
    );
};
