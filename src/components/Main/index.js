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

const tag = [
  {
    value: 'All Tags',
    id: 0,
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
    newData: []
  })

  const [showCustomDate, selectShowCustomDate] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [filterTime, setFilterime] = useState(time);

  const [showTime, selectShowTime] = useState(0);

  const [filterTags, setFilterTags] = useState(tag);

  const [showTag, selectShowTag] = useState(0);

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

    let tags = data.map(({data}) => {return data['Tag'] ? data['Tag'] : 'No Tag';});
    let allTags = Object.values(tags.reduce((c, v) => {
      c[v] = c[v] || [v, 0];
      c[v][1]++;
      return c;
    },{})).map((o, i)=>({value: o[0], id: i+1}));

    allTags.unshift({value: 'All Tags', id: 0});
    setFilterTags(allTags);
    selectShowTag(allTags[0].id);
  }

  const handleError = (error, msg) => {
    setCSVReaderError({
      error,
      msg
    })
  }
  
  const { error, msg } = csvReaderError;
  const { data, totalCount, newData } = result;
  const { startDate, dueDate } = date;
  const [customDate, setCustomDate] = useState([null, null]);

  useEffect( () => {
    if (customDate[0] !== null && customDate[1] !== null){
      let totalCount = 0;
      let newData = result.data.filter(({data}) => {
        var dateObject = new Date(data['Date']);
        var compare = dateObject.getTime() >= new Date(customDate[0]).getTime() && dateObject.getTime() <= new Date(customDate[1]).getTime();
        if(!compare) {
          return false;
        }
        return true;
      }).map(function(tag) {
        return tag;
      });
      totalCount = newData.length;
      if (showTag === 0){
        setResult((prev) =>({
          ...prev,
          totalCount,
          newData
        }));
      } else {
        newData = newData.filter(({data}) => {
          var tagObject = data['Tag'];
          tagObject = tagObject === 'No Tag' ? '' : tagObject;
          var compare = tagObject === filterTags[showTag].value;
          if(!compare) {
            return false;
          }
          return true;
        }).map(function(tag) {
          return tag;
        });
        totalCount = newData.length;
        setResult((prev) =>({
          ...prev,
          totalCount,
          newData
        }))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customDate]);

  const handleTimeChange = (event) => {
    event.preventDefault();
    selectShowTime(event.target.value);
  }

  const handleTagChange = (event) => {
    event.preventDefault();
    selectShowTag(event.target.value);
  }

  useEffect(() => {
    let totalCount = 0;
    let newData = [];
    let count = 0;
      selectShowCustomDate(false);
      switch (showTime) {
        case 0:
          count = 0;
          break;
        case 1:
          count = 90;
          break;
        case 2:
          count = 60;
          break;
        case 3:
          count = 30;
          break;
        case 4:
          count = 14;
          break;
        case 5:
          count = 100;
          selectShowCustomDate(true);
          break;
        default:
          break;
      }

      if(count === 0) {
        totalCount = result.total;
        newData = result.data;
      } else if (count === 100){
        newData = result.data.filter(({data}) => {
          var dateObject = new Date(data['Date']);
          var compare = dateObject.getTime() >= new Date(customDate[0]).getTime() && dateObject.getTime() <= new Date(customDate[1]).getTime();
          if(!compare) {
            return false;
          }
          return true;
        }).map(function(tag) {
          return tag;
        });
        totalCount = newData.length;
      }
      else {
        let today = new Date()
        let priorDate = new Date().setDate(today.getDate()-count);
        priorDate = new Date(priorDate)
        newData = result.data.filter(({data}) => {
          var dateObject = new Date(data['Date']);
          var compare = dateObject.getTime() >= priorDate.getTime();
          if(!compare) {
            return false;
          }
          return true;
        }).map(function(tag) {
          return tag;
        });
        totalCount = newData.length;
      }
      if (showTag === 0){
        setResult((prev) =>({
          ...prev,
          totalCount,
          newData
        }));
      } else {
        newData = newData.filter(({data}) => {
          var tagObject = data['Tag'];
          tagObject = tagObject === 'No Tag' ? '' : tagObject;
          var compare = tagObject === filterTags[showTag].value;
          if(!compare) {
            return false;
          }
          return true;
        }).map(function(tag) {
          return tag;
        });
        totalCount = newData.length;
        setResult((prev) =>({
          ...prev,
          totalCount,
          newData
        }))
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTime, showTag])

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
      <Grid container spacing={3} justifyContent="space-between">
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
            startText=""
            endText=""
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
      <Grid container spacing={3}>
        <Grid item>
          <TextField
          id="time-currency"
          select
          value={showTime}
          onChange={handleTimeChange}
          disabled={result.total === 0}
          >
            {filterTime.map((time) => (
              <MenuItem key={time.value} value={time.id}>
                {time.value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
          id="time-currency"
          select
          value={showTag}
          onChange={handleTagChange}
          disabled={result.total === 0}
          >
            {filterTags.map((tag) => (
              <MenuItem key={tag.value} value={tag.id}>
                {tag.value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

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
            showTag = {showTag}
          />
        </>
      }
    </div>
  );
}