import React, { useContext } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { CSVReader as CSVParser } from 'react-papaparse';
import { LoadingContext } from '../../contexts/loading';

const buttonRef = React.createRef();

const csvHeaders = [
  "Date",
  "Funnel",
  "Tag",
  "Name",
  "Email",
  "Phone",
  "Last Challenge Day Completed",
];

const useStyles = makeStyles((theme) => ({
  button: {
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 300,
    background: '#AE8E3E',
    '&:hover': {
      background: '#AE8E3E',
    }
  },
}));

const CSVReader = ({handleData, handleError}) => {
  const classes = useStyles();
  const { setLoading } = useContext(LoadingContext);

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnDrop = (data) => {
    setLoading({
      loading: true,
    });

    setTimeout(() => {
      handleCSVValid(data, (isValid) => {
        if(isValid) {
          handleCSVToJSON(data, (data, total, startDate, dueDate) => {
            handleData(data, total, startDate, dueDate);
          })
        }
        else {
          const error = true;
          const msg = 'Invalid CSV file! Please check the columns of the csv';
          handleError(error, msg);
        }
        setLoading({
          loading: false,
        });
      })
    }, 1000);
  }

  const handleCSVValid = (data, cb) => {
    const dataHeader = data[0].meta.fields;
    let isValid = _.isEqual(dataHeader.sort(), csvHeaders.sort());
    cb(isValid);
  }

  const handleCSVToJSON = async (data, callback) => {
    data.pop();

    const total = data.length;
    let startDate = new Date(Math.min(...data.map(({data}) => new Date(data['Date'])))).toUTCString();
    let dueDate = new Date(Math.max(...data.map(({data}) => new Date(data['Date'])))).toUTCString();
    startDate = formatDate(startDate);
    dueDate = formatDate(dueDate);
    callback(data, total, startDate, dueDate);
  }

  const handleOnError = (err, file, inputElem, reason) => {
    const error = true;
    handleError(error, err.message);
  }

  const formatDate = (date) => {
    let dateObj = (new Date(date)).toISOString().split('T')[0];
    let yyyy = dateObj.split('-')[0];
    let yy = yyyy.substring(2);
    let mm = dateObj.split('-')[1];
    let dd = dateObj.split('-')[2];
    return dd + '/' + mm + '/' + yy;
  }

  return (
    <CSVParser
      ref={buttonRef}
      onDrop={handleOnDrop}
      onError={handleOnError}
      noDrag
      noClick
      noProgressBar
      config={{
        header: true,
      }}
      style={{
        dropArea: {
          borderRadius: 0,
          borderStyle: 'none',
          borderWidth: 0,
          height: 'unset',
          padding: 0,
        }
      }}
    >{() => (
      <Button variant="contained" color="primary" onClick={handleOpenDialog} className={classes.button}>
        Import Affiliate CSV
      </Button>
      )}
    </CSVParser>
  );
}
 
export default CSVReader;