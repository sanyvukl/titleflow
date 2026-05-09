import UploadFileIcon from "@mui/icons-material/UploadFile";
import ModulePlaceholder from "../../components/common/ModulePlaceholder";

function DocumentsPage() {
    return (
        <ModulePlaceholder
            title="Documents"
            description="Secure document upload, listing, and download workflow for title applications."
            roles={["DEALER", "DMV_CLERK", "ADMIN"]}
            icon={<UploadFileIcon color="primary" />}
        />
    );
}

export default DocumentsPage;