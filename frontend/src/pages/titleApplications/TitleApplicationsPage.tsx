import ArticleIcon from "@mui/icons-material/Article";
import ModulePlaceholder from "../../components/common/ModulePlaceholder";

function TitleApplicationsPage() {
    return (
        <ModulePlaceholder
            title="Title Applications"
            description="Dealer workflow for creating, editing, submitting, and tracking title applications."
            roles={["DEALER"]}
            icon={<ArticleIcon color="primary" />}
        />
    );
}

export default TitleApplicationsPage;