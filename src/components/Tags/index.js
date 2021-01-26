import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography, Grid } from '@material-ui/core';
import {
  PieChart, Pie, Cell, Legend, Tooltip
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
  tagText: {
    marginTop: 0,
    fontSize: '0.85rem',
    fontFamily: 'proxima-nova,Roboto,"Helvetica Neue",Arial,sans-serif',
    fontWeight: 300,
  },
  tagContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: 300,
  },
}));

const COLORS = [
  "#f5f5dc", 
  "#a52a2a", 
  "#ff00ff",
  "#ffd700",
  "#008000",
  "#4b0082",
  "#f0e68c",
  "#add8e6",
  "#e0ffff",
  "#90ee90",
  "#d3d3d3",
  "#ffb6c1",
  "#00ff00",
  "#ff00ff",
  "#800000",
  "#000080",
  "#808000",
  "#ffa500",
  "#ffc0cb",
  "#800080",
  "#800080",
  "#ff0000",
  "#c0c0c0"
];

const style = {
  top: 0,
  left: 350,
  lineHeight: '24px',
};


const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul style={{
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      height: 300,
    }}>
      {
        payload.map((entry, index) => (
          <li key={`item-${index}`} style={{listStyleType: 'none'}}>
            <svg viewBox="0 0 10 10" style={{width: 10, marginRight: 5}} xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" style={{fill:`${entry.color}`}} />
            </svg>
            {entry.value}
          </li>
        ))
      }
    </ul>
  );
}

export default function Tags({data, total = 0, showTag}) {
  const classes = useStyles();

  let tags = data.map(({data}) => {return data['Tag'] ? data['Tag'] : 'No Tag';});

  let allTags = Object.values(tags.reduce((c, v) => {
      c[v] = c[v] || [v, 0];
      c[v][1]++;
      return c;
    },{})).map(o=>({name: o[0], value : o[1]}));

  let lesData = 0;
  let tagsData = allTags.filter(tag => {
    let value = tag['value'] / total * 100;
    if(value < 1) {
      lesData += tag['value'];
      return false;
    }
    return true;
  }).map(function(tag) {
    const percentage = Math.ceil(tag['value'] / total * 1000) / 10;
    return {name: `${percentage}% ${tag['name']}`, value : tag['value']};
  });

  let lessPercentage = Math.ceil(lesData / total * 1000) / 10;

  if(!!tagsData.length) tagsData.splice(tagsData.length, 0, {name: `${lessPercentage}% Others`, value: lesData});

  tagsData = _.reverse(_.sortBy(tagsData, [function(o) { return o.value; }]));
  allTags = _.reverse(_.sortBy(allTags, [function(o) { return o.value; }]));

  return (
    <div className={classes.root}>
      {
        showTag === 0 && <Paper className={classes.paper}>
          <Typography variant="h1" className={classes.title}>
            Tags
          </Typography>
          <Grid>
            <PieChart width={300} height={300}>
              <Pie
                data={tagsData}
                cx={150}
                cy={150}
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {
                  data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }
              </Pie>
              <Tooltip />
              <Legend content={renderLegend} width={600} layout="vertical" wrapperStyle={style} />
            </PieChart>
          </Grid>
          <ul className={classes.tagContainer}>
          {
            allTags.map((tag, index) => (
              <li key={index} style={{listStyleType: 'none'}} >
                <Typography variant="h6" className={classes.tagText}>
                  {tag.name} - {tag.value}
                </Typography>
              </li>
            ))
          }
          </ul>
        </Paper>
      }
    </div>
  );
}