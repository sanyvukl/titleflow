import {
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import type { ReactNode } from "react";

interface ModulePlaceholderProps {
    title: string;
    description: string;
    roles: string[];
    icon?: ReactNode;
}

function ModulePlaceholder({
                               title,
                               description,
                               roles,
                               icon,
                           }: ModulePlaceholderProps) {
    return (
        <Stack spacing={3}>
            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2}>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems: "center",
                            }}
                        >
                            {icon}

                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                                {title}
                            </Typography>
                        </Stack>

                        <Typography variant="body1" color="text.secondary">
                            {description}
                        </Typography>

                        <Divider />

                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Planned access
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    flexWrap: "wrap",
                                    rowGap: 1,
                                }}
                            >
                                {roles.map((role) => (
                                    <Chip key={role} label={role} variant="outlined" />
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                        Coming in a future sprint
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        This route is connected now, but the full business workflow UI will be
                        built later.
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
}

export default ModulePlaceholder;