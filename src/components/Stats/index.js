import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PeopleIcon from '@material-ui/icons/People';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  stats: {
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 300,
  },
  icon: {
    fontSize: 45,
    color: '#AE8E3E',
  },
  count: {
    margin: theme.spacing(0, 2, 0),
    fontSize: '2.5rem',
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 600,
    color: '#000000',
  },
}));

export default function Stats({total}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item sm>
          <Paper className={classes.paper}>
            <PeopleIcon className={classes.icon} />
            <p className={classes.count}>{total}</p>
            <p className={classes.stats}>Total Members</p>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}