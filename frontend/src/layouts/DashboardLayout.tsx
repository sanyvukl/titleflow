import type { ReactNode } from "react";
import {
    AppBar,
    Box,
    Button,
    Chip,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useLocation, useNavigate } from "react-router";
import { logoutUser } from "../auth/authSlice";
import type { RoleName } from "../auth/authTypes";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const drawerWidth = 280;

interface NavigationItem {
    label: string;
    path: string;
    roles: RoleName[];
    icon: ReactNode;
}

const navigationItems: NavigationItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        roles: ["ADMIN", "DEALER", "DMV_CLERK", "LENDER", "DEVELOPER"],
        icon: <DashboardIcon />,
    },
    {
        label: "Title Applications",
        path: "/dashboard/title-applications",
        roles: ["DEALER"],
        icon: <ArticleIcon />,
    },
    {
        label: "DMV Review",
        path: "/dashboard/dmv-review",
        roles: ["DMV_CLERK"],
        icon: <FactCheckIcon />,
    },
    {
        label: "Documents",
        path: "/dashboard/documents",
        roles: ["DEALER", "DMV_CLERK", "ADMIN"],
        icon: <UploadFileIcon />,
    },
    {
        label: "Liens",
        path: "/dashboard/liens",
        roles: ["LENDER", "DEALER", "DMV_CLERK", "ADMIN"],
        icon: <AccountBalanceIcon />,
    },
    {
        label: "Audit Logs",
        path: "/dashboard/audit-logs",
        roles: ["DMV_CLERK", "ADMIN"],
        icon: <HistoryIcon />,
    },
];

function DashboardLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useAppSelector((state) => state.auth);

    const visibleNavigationItems = navigationItems.filter((item) =>
        item.roles.some((role) => user?.roles.includes(role))
    );

    async function handleLogout() {
        await dispatch(logoutUser());
        navigate("/login");
    }

    function handleNavigate(item: NavigationItem) {
        navigate(item.path);
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                                TitleFlow
                            </Typography>
                            <Typography variant="caption">
                                Secure Digital Vehicle Title & Lien Processing
                            </Typography>
                        </Box>

                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                                alignItems: "center",
                            }}
                        >
                            {user && (
                                <Chip
                                    label={`${user.firstName} ${user.lastName}`}
                                    size="small"
                                    sx={{
                                        color: "white",
                                        borderColor: "rgba(255,255,255,0.7)",
                                    }}
                                    variant="outlined"
                                />
                            )}

                            <Button
                                color="inherit"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    display: { xs: "none", md: "block" },
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Toolbar />

                <Box sx={{ p: 2 }}>
                    <Typography variant="overline" color="text.secondary">
                        Navigation
                    </Typography>
                </Box>

                <Divider />

                <List>
                    {visibleNavigationItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => handleNavigate(item)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: "100vh",
                    backgroundColor: "#f5f6f8",
                }}
            >
                <Toolbar />

                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default DashboardLayout;