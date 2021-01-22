import React, { useState, useContext, useEffect } from 'react';
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

  const [showTime, selectShowTime] = useState(0);

  const [showCustomDate, selectShowCustomDate] = useState(false);

  const [filterTime, setFilterTime] = useState(time);

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
      case 0:
        count = 0;
        selectShowCustomDate(false);
        break;
      case 1:
        count = 90;
        selectShowCustomDate(false);
        break;
      case 2:
        count = 60;
        selectShowCustomDate(false);
        break;
      case 3:
        count = 30;
        selectShowCustomDate(false);
        break;
      case 4:
        count = 14;
        selectShowCustomDate(false);
        break;
      case 5:
        count = 100;
        selectShowCustomDate(true);
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
    } else if (count === 100){
      let newData = result.data.filter(({data}) => {
        var dateObject = new Date(data['Date']);
        var compare = dateObject.getTime() >= new Date(customDate[0]).getTime();
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
  const [customDate, setCustomDate] = useState([null, null]);

  let dateTimes = filterTime;
  
  useEffect( () => {
    if (customDate[0] !== null && customDate[1] !== null){
      async function run(cb){
        let result = (await Promise.all(dateTimes.filter((time, index) => {
          if(time.id === 5){
            time['value'] = moment(customDate[0]).format('L') + '-' + moment(customDate[1]).format('L');
          }
          return time;
        })));
        cb(result);
      }
      run((result) => {
        setFilterTime(result)
        selectShowTime(result[5].id)
      });
    }
  }, [customDate]);

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
      {
        showCustomDate &&  <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="Check-in"
            endText="Check-out"
            value={customDate}
            onChange={(newValue) => {
              setCustomDate(newValue);
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
      }
     
      <TextField
        id="time-currency"
        select
        value={showTime}
        onChange={handleChange}
        disabled={result.total === 0}
      >
        {filterTime.map((time) => (
          <MenuItem key={time.value} value={time.id}>
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