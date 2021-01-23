import { Grid, CircularProgress } from '@material-ui/core';
import './index.css';

const Loader = () => (
  <Grid container direction="column" justifyContent="center" alignItems="center" className="loader">
    <CircularProgress />
  </Grid>
);

export default Loader;
