import {Box, LinearProgress, LinearProgressProps, Typography} from "@mui/material";

type MPProgressProps = LinearProgressProps & {
    value: number
}

const MPProgress: React.FC<MPProgressProps> = (props: MPProgressProps) => {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default MPProgress

/*
export default function MPProgress(props: LinearProgressProps & { value: number }) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}
                </Typography>
            </Box>
        </Box>
    );
}
 */