import Main from './components/Main';
import { StylesProvider } from '@material-ui/core';

function App() {
  return (
    <StylesProvider injectFirst>
      <Main />
    </StylesProvider>
  );
}

export default App;
