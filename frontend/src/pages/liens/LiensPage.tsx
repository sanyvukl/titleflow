import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ModulePlaceholder from "../../components/common/ModulePlaceholder";

function LiensPage() {
    return (
        <ModulePlaceholder
            title="Liens"
            description="Lien workflow for lenders to create, view, and release liens connected to title applications."
            roles={["LENDER", "DEALER", "DMV_CLERK", "ADMIN"]}
            icon={<AccountBalanceIcon color="primary" />}
        />
    );
}

export default LiensPage;