import * as React from 'react';
// import Box from '@material/Box';
import { Box, Button, Stack, CardActions, CardContent, Typography, Card } from '@material-ui/core';
// import Card from '@material/Card';
// import CardActions from '@material/CardActions';
// import CardContent from '@material/CardContent';
// import Stack from '@material/Stack';
// import Button from '@material/Button';
// import { styled } from '@material/styles';
import { styled } from '@material-ui/styles';
// import Typography from '@material/Typography';

// type Props = {
//     hoverShadow: number;
// };
const options = {
    shouldForwardProp: (prop) => prop !== 'hoverShadow',
};
const StyledCard = styled(
    Card,
    options,
)(({ theme, hoverShadow = 1 }) => ({
    ':hover': {
        boxShadow: theme.shadows[hoverShadow],
    },
}));

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

const Content = () => (
    <>
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
                be{bull}nev{bull}o{bull}lent
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
            </Typography>
            <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Learn More</Button>
        </CardActions>
    </>
);

export default function BasicCard() {
    return (
        <div m={3} gap={3}>
            <Card
                sx={{
                    minWidth: 275,
                    ':hover': {
                        boxShadow: 20,
                    },
                }}
            >
                <Content />
            </Card>
            <StyledCard hoverShadow={10}>
                <Content />
            </StyledCard>
        </div>
    );
}
