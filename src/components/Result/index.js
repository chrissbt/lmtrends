import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Label
} from 'recharts';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    boxShadow: '0px 6px 15px grey',
  },

  title: {
    marginTop: 0,
    fontSize: '2.5rem',
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 300,
    padding: theme.spacing(2),
  },
  customTooltip: {
    background: '#FFFFFF',
    boxShadow: '0px 6px 15px grey',
    padding: theme.spacing(2),
    opacity: 0.8
  }
}));

const CustomTooltip = ({ active, payload, label, total, classes }) => {
  if (!payload) return null;
  if (active) {
    const value = payload[0].value;
    const percentage = Math.ceil(value / total * 1000) / 10;;
    return (
      <div className={classes.customTooltip}>
        <p className="intro">{`Members: ${payload[0].value} (${percentage}%)`}</p>
      </div>
    );
  }

  return null;
};

const renderCustomizedLabel = (props) => {
  const { total, x, y, width, value } = props;
  const radius = 10;
  const percentage = Math.ceil(value / total * 1000) / 10;
  return (
    <g>
      <text x={x + width / 2} y={y - radius} fill="#000" textAnchor="middle" dominantBaseline="middle">
        {percentage} %
      </text>
    </g>
  );
};

export default function Result({data, total}) {
  const classes = useStyles();

  let challenges = [];
  if (data.length > 0) {
    challenges = data.map(({data}) => {return data['Last Challenge Day Completed'].toLowerCase() === 'none' ? '0' : data['Last Challenge Day Completed']});
    challenges = Object.values(challenges.reduce((c, v) => {
        c[v] = c[v] || [v, 0];
        c[v][1]++;
        return c;
      },{})).map(o=>({name: o[0] === '0' ? 'None' : o[0] , members : o[1]}));
  };
  
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h1" className={classes.title}>
          Challenge Completion Frequency
        </Typography>
        <div style={{ width: '100%', height: 500 }}>
          <ResponsiveContainer>
            <BarChart
              data={challenges}
              margin={{
                top: 30, right: 30, left: 20, bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name">
                <Label value="Last Challenge Day" offset={-15} position="insideBottom" />
              </XAxis>
              <YAxis label={{ value: 'Members', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} total={total} classes={classes} cursor={false} />
              <Bar dataKey="members" fill="#AE8E3E" minPointSize={10} isAnimationActive={false}>
                <LabelList dataKey="members" content={renderCustomizedLabel} total={total} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Paper>
    </div>
  );
}