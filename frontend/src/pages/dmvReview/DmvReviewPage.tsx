import FactCheckIcon from "@mui/icons-material/FactCheck";
import ModulePlaceholder from "../../components/common/ModulePlaceholder";

function DmvReviewPage() {
    return (
        <ModulePlaceholder
            title="DMV Review"
            description="DMV clerk workflow for reviewing submitted applications, approving, rejecting, or requesting more information."
            roles={["DMV_CLERK"]}
            icon={<FactCheckIcon color="primary" />}
        />
    );
}

export default DmvReviewPage;