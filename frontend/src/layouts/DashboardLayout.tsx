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
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import ShieldIcon from "@mui/icons-material/Shield";

import { Outlet, useLocation, useNavigate } from "react-router";

import { logoutUser } from "../auth/authSlice";
import type { RoleName } from "../auth/authTypes";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const drawerWidth = 288;

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
        roles: ["ADMIN", "DEALER", "DMV_CLERK", "DEVELOPER"],
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

    function isActivePath(path: string) {
        if (path === "/dashboard") {
            return location.pathname === path;
        }

        return location.pathname.startsWith(path);
    }

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "background.default",
            }}
        >
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "#082B55",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 10px 28px rgba(6, 30, 58, 0.22)",
                }}
            >
                <Toolbar sx={{ minHeight: 72 }}>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: "14px",
                                    display: "grid",
                                    placeItems: "center",
                                    background:
                                        "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                                    boxShadow: "0 10px 24px rgba(79, 125, 243, 0.35)",
                                }}
                            >
                                <ShieldIcon sx={{ color: "white" }} />
                            </Box>

                            <Box>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        color: "white",
                                        fontWeight: 800,
                                        letterSpacing: "0.02em",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    TitleFlow
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.72)",
                                        letterSpacing: "0.04em",
                                    }}
                                >
                                    Secure Digital Title Processing
                                </Typography>
                            </Box>
                        </Stack>

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
                                    variant="outlined"
                                    sx={{
                                        color: "white",
                                        borderColor: "rgba(255, 255, 255, 0.35)",
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        sx: { fontWeight: 700 },
                                    }}
                                />
                            )}

                            <Button
                                color="inherit"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{
                                    color: "white",
                                    borderColor: "rgba(255, 255, 255, 0.28)",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
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
                        background:
                            "linear-gradient(180deg, #061E3A 0%, #082B55 55%, #0B2D57 100%)",
                        color: "white",
                        borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                    },
                }}
            >
                <Toolbar sx={{ minHeight: 72 }} />

                <Box sx={{ p: 3 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: "rgba(255, 255, 255, 0.55)",
                            fontWeight: 800,
                            letterSpacing: "0.12em",
                        }}
                    >
                        Workspace
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "rgba(255, 255, 255, 0.72)",
                            mt: 0.5,
                        }}
                    >
                        DMV-grade workflow console
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)" }} />

                <List sx={{ px: 2, py: 2 }}>
                    {visibleNavigationItems.map((item) => {
                        const selected = isActivePath(item.path);

                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 0.75 }}>
                                <ListItemButton
                                    selected={selected}
                                    onClick={() => handleNavigate(item)}
                                    sx={{
                                        borderRadius: "16px",
                                        px: 2,
                                        py: 1.35,
                                        color: selected
                                            ? "white"
                                            : "rgba(255, 255, 255, 0.74)",
                                        "&.Mui-selected": {
                                            background:
                                                "linear-gradient(135deg, rgba(79, 125, 243, 0.95) 0%, rgba(47, 128, 237, 0.95) 100%)",
                                            boxShadow:
                                                "0 12px 24px rgba(47, 128, 237, 0.28)",
                                        },
                                        "&.Mui-selected:hover": {
                                            background:
                                                "linear-gradient(135deg, rgba(79, 125, 243, 1) 0%, rgba(47, 128, 237, 1) 100%)",
                                        },
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            color: "white",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 42,
                                            color: selected
                                                ? "white"
                                                : "rgba(255, 255, 255, 0.68)",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Typography
                                                sx={{
                                                    fontWeight: selected ? 800 : 700,
                                                    fontSize: "0.95rem",
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: "18px",
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(255, 255, 255, 0.62)",
                                display: "block",
                                mb: 0.5,
                            }}
                        >
                            Signed in as
                        </Typography>

                        <Typography sx={{ color: "white", fontWeight: 800 }}>
                            {user?.roles.join(", ") ?? "User"}
                        </Typography>
                    </Box>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: "100vh",
                    background:
                        "radial-gradient(circle at top right, rgba(79, 125, 243, 0.13), transparent 32%), #F6F8FB",
                }}
            >
                <Toolbar sx={{ minHeight: 72 }} />

                <Box
                    sx={{
                        px: { xs: 2, md: 4 },
                        py: { xs: 2, md: 4 },
                        maxWidth: "1480px",
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default DashboardLayout;