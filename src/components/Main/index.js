import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import DateRangePicker from '@material-ui/lab/DateRangePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import CSVReader from '../CSVReader/index';
import Loader from '../Loader/index';
import Stats from '../Stats/index';
import Result from '../Result';
import Tags from '../Tags';
import { LoadingContext } from '../../contexts/loading';

const time = [
  {
    value: 'All Time',
    id: 0,
  },
  {
    value: '90 days',
    id: 1,
  },
  {
    value: '60 days',
    id: 2,
  },
  {
    value: '30 days',
    id: 3,
  },
  {
    value: '14 days',
    id: 4,
  },
  {
    value: 'Custom date range',
    id: 5,
  },
];


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(6),
  },
  title: {
    marginTop: 0,
    fontSize: '2.5rem',
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 300,
  },
  date: {
    marginTop: 0,
    fontSize: '1rem',
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
  },
  alert: {
    margin: theme.spacing(0, 0, 6),
  },
}));

export default function Main() {
  const classes = useStyles();
  const { loading } = useContext(LoadingContext);

  const [csvReaderError, setCSVReaderError] = useState({
    error: false,
    msg: '',
  })

  const [date, setDate] = useState({
    startDate: '',
    dueDate: ''
  })

  const [result, setResult] = useState({
    total: 0,
    totalCount: 0,
    data: [],
  })

  const [showTime, selectShowTime] = useState('All Time');

  const handleData = (data, total, startDate, dueDate) => {
    setResult({
      total,
      totalCount: total,
      data,
      newData: data,
    });
    setDate({
      startDate,
      dueDate
    })
  }

  const handleError = (error, msg) => {
    setCSVReaderError({
      error,
      msg
    })
  }

  const handleChange = (event) => {
    let count = 0;
    switch (event.target.value) {
      case 'All Time':
        count = 0;
        break;
      case '90 days':
        count = 90;
        break;
      case '60 days':
        count = 60;
        break;
      case '30 days':
        count = 30;
        break;
      case '14 days':
        count = 14;
        break;
      case 'Custom date range':
        count = 0;
        break;
      default:
        break;
    }
    if(count === 0) {
      const totalCount = result.total;
      const newData = result.data;
      setResult((prev) =>({
        ...prev,
        totalCount,
        newData
      }))
      selectShowTime(event.target.value);
    }
    else {
      let today = new Date()
      let priorDate = new Date().setDate(today.getDate()-count);
      priorDate = new Date(priorDate)
      let newData = result.data.filter(({data}) => {
        var dateObject = new Date(data['Date']);
        var compare = dateObject.getTime() >= priorDate.getTime();
        if(!compare) {
          return false;
        }
        return true;
      }).map(function(tag) {
        return tag;
      });
      const totalCount = newData.length;
      setResult((prev) =>({
        ...prev,
        totalCount,
        newData
      }))
      selectShowTime(event.target.value);
    }
  };

  const { error, msg } = csvReaderError;
  const { data, totalCount, newData } = result;
  const { startDate, dueDate } = date;
  const [value, setValue] = useState([null, null]);
  console.log('first value', value[0], 'second value', value[1]);
  return (
    <div className={classes.root}>
      {
        loading &&
        <Loader />
      }
      {
        error &&
        <Alert className={classes.alert} severity="error">{msg}</Alert>
      }
      <Grid container spacing={3} justify="space-between">
        <Grid item>
          <Typography variant="h1" className={classes.title}>
            LM Trends
          </Typography>
          {
            startDate &&
            <Typography variant="h6" className={classes.date}>
              {startDate} to {dueDate}
            </Typography>
          }
        </Grid>
        <Grid item>
          <CSVReader
            handleData = {handleData}
            handleError = {handleError}
          />
        </Grid>
      </Grid>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
          startText="Check-in"
          endText="Check-out"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} variant="standard" />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} variant="standard" />
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
      <TextField
        id="time-currency"
        select
        value={showTime}
        onChange={handleChange}
        disabled={result.total === 0}
      >
        {time.map((time) => (
          <MenuItem key={time.value} value={time.value}>
            {time.value}
          </MenuItem>
        ))}
      </TextField>
      <Stats
        total = {totalCount}
      />
      {
        !!data.length &&
        <>
          <Result
            data = {newData}
            total = {totalCount}
          />
          <Tags
            data = {newData}
            total = {totalCount}
          />
        </>
      }
    </div>
  );
}