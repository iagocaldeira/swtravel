import { useState } from "react";
import Head from "next/head";
import duration from "dayjs/plugin/duration";
import dayjs from "dayjs";
import clsx from "clsx";
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  makeStyles,
  FormControl,
  InputAdornment,
  FilledInput,
  FormHelperText,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Container,
} from "@material-ui/core";
import Hero from "../components/hero";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: "90vw",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
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

  tableContainer: {
    maxHeight: "90vh",
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor: theme.palette.grey[800],
  },
}));

export default function Home({ starships }) {
  const classes = useStyles();
  
  const [distance, setDistance] = useState(1000000);
  const calculateTravelTime = (MGLT) => Math.ceil(Math.max(0, distance) / MGLT);
  const calculateTravelRessuplies = (consumables, travelTime) => Math.floor(travelTime / consumables);

  return (
    <>
      <AppBar position='absolute' color='default' className={classes.appBar}>
        <Toolbar>
          <Typography component='h1' variant='h5' color='inherit' noWrap>
            Star Wars Travel Calculator
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Hero />
        <Paper className={classes.paper}>
          <Typography component='h3' variant='h6' color='textPrimary' gutterBottom>
            Input Travel Distance
          </Typography>
          <FormControl className={clsx(classes.margin, classes.textField)} variant='filled'>
            <FilledInput
              id='filled-adornment-weight'
              value={distance}
              type='number'
              min='0'
              onChange={(e) => setDistance(e.target.value)}
              endAdornment={<InputAdornment position='end'>MGLTs</InputAdornment>}
              aria-describedby='filled-weight-helper-text'
              inputProps={{
                "aria-label": "weight",
              }}
            />
            <FormHelperText id='filled-weight-helper-text'>Megalights</FormHelperText>
          </FormControl>
        </Paper>
        <Paper className={classes.paper}>
          <TableContainer className={classes.tableContainer}>
            <Table size='small' stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align='right'>Maximum MGLT per hour</TableCell>
                  <TableCell align='right'>
                    Consumables <small>(hours)</small>
                  </TableCell>
                  <TableCell align='right'>
                    Travel Time <small>(hours)</small>
                  </TableCell>
                  <TableCell align='right'>Ressuplies</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {starships?.map((starship) => (
                  <TableRow key={starship.id} hover tabIndex={-1}>
                    <TableCell>
                      <strong>{starship.name}</strong>
                    </TableCell>
                    <TableCell align='right'> {starship.MGLT}</TableCell>
                    <TableCell align='right'> {starship.consumables}</TableCell>
                    <TableCell align='right'> {calculateTravelTime(starship.MGLT)}</TableCell>
                    <TableCell align='right'>
                      {calculateTravelRessuplies(starship.consumables, calculateTravelTime(starship.MGLT))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </main>
      <footer className={classes.footer}>
        <Container maxWidth='sm'>
          <Typography variant='body1'>App made with ❤️ by Iago Caldeira.</Typography>
        </Container>
      </footer>
    </>
  );
}

export async function getStaticProps() {
  dayjs.extend(duration);
  const pages = Array(4)
    .fill()
    .map((_, i) => fetch(`https://swapi.dev/api/starships/?page=${i + 1}`));
  const pageFetchList = await Promise.all(pages);
  const results = (await Promise.all(pageFetchList.map((x) => x.json())))
    .reduce((acc, cur) => acc.concat(cur.results), [])
    .filter((x) => /^\d+$/.test(x.MGLT))
    .map((x) => ({
      ...x,
      id: /\d+/.exec(x.url)[0],
      consumables: dayjs.duration(...x.consumables.split(" ")).asHours(),
    }));
  return {
    props: {
      starships: results,
    },
  };
}
