import { Typography, Paper, Card, CardContent, Grid, Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  card: {
    height: "100%"
  },
}));
export default function Hero() {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
        <Container maxWidth='md'>
          <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
            Star Wars Travel Calculator
          </Typography>
          <Typography variant='h5' align='center' color='textSecondary' paragraph>
            This is a tool to calculate the minimum amount of ressuplies a starship could travel given the distance.
          </Typography>
        </Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent >
                <Typography variant='h5' component='h2'>
                  MGLT
                  <Typography component='small' color='textSecondary' gutterBottom>
                    (Megalight)
                  </Typography>
                </Typography>
                <Typography variant='body2' component='p'>
                  The Maximum number of Megalights this starship can travel in a standard hour. We can assume it is
                  similar to AU, the distance between our Sun (Sol) and Earth.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardContent >
                <Typography variant='h5' component='h2'>
                  Consumables
                </Typography>
                <Typography variant='body2' component='p'>
                  The maximum length of time that this starship can provide consumables for its entire crew without
                  having to resupply.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    </Paper>
  );
}
