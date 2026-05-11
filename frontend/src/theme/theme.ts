import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#4F7DF3",
            dark: "#2F80ED",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#0B2D57",
            dark: "#061E3A",
            contrastText: "#FFFFFF",
        },
        success: {
            main: "#2E7D32",
        },
        warning: {
            main: "#ED6C02",
        },
        error: {
            main: "#D32F2F",
        },
        background: {
            default: "#F6F8FB",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#0B2545",
            secondary: "#5B6472",
        },
        divider: "#E2E8F0",
    },

    typography: {
        fontFamily:
            '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#0B2545",
        },
        h5: {
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#0B2545",
        },
        h6: {
            fontWeight: 700,
            color: "#0B2545",
        },
        body1: {
            lineHeight: 1.7,
        },
        button: {
            fontWeight: 700,
            letterSpacing: "0.04em",
        },
    },

    shape: {
        borderRadius: 14,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#F6F8FB",
                    color: "#0B2545",
                },
                "*": {
                    boxSizing: "border-box",
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 12px 30px rgba(8, 43, 85, 0.06)",
                    backgroundImage: "none",
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    textTransform: "none",
                    boxShadow: "none",
                    paddingInline: 22,
                    minHeight: 42,
                },
                outlined: {
                    borderColor: "#C8D4E8",
                    color: "#0B2D57",
                    "&:hover": {
                        borderColor: "#4F7DF3",
                        backgroundColor: "#EEF5FF",
                    },
                },
            },

            variants: [
                {
                    props: { variant: "contained", color: "primary" },
                    style: {
                        background:
                            "linear-gradient(135deg, #4F7DF3 0%, #2F80ED 100%)",
                        boxShadow: "0 10px 22px rgba(79, 125, 243, 0.25)",
                        "&:hover": {
                            boxShadow: "0 12px 26px rgba(79, 125, 243, 0.32)",
                        },
                    },
                },
            ],
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundColor: "#FFFFFF",
                },
            },
        },

        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: "#EEF5FF",
                    color: "#0B2D57",
                    fontWeight: 700,
                    borderBottom: "1px solid #D8E3F5",
                },
                body: {
                    borderBottom: "1px solid #E2E8F0",
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    fontWeight: 700,
                },
            },
        },

        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                },
            },
        },
    },
});

export default appTheme;