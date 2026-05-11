import type { ReactNode } from "react";

import { Box, Stack, Typography } from "@mui/material";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                mb: 3,
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        color: "text.primary",
                    }}
                >
                    {title}
                </Typography>

                {subtitle && (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 0.75 }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>

            {actions && (
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    sx={{
                        alignItems: { xs: "stretch", sm: "center" },
                    }}
                >
                    {actions}
                </Stack>
            )}
        </Stack>
    );
}

export default PageHeader;