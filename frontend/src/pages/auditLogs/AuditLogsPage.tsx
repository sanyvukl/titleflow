import HistoryIcon from "@mui/icons-material/History";
import ModulePlaceholder from "../../components/common/ModulePlaceholder";

function AuditLogsPage() {
    return (
        <ModulePlaceholder
            title="Audit Logs"
            description="Read-only history of important workflow events across title applications, documents, and liens."
            roles={["DMV_CLERK", "ADMIN"]}
            icon={<HistoryIcon color="primary" />}
        />
    );
}

export default AuditLogsPage;