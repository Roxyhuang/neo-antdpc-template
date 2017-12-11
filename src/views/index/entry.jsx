import ReactDOM from 'react-dom';
import 'assets/css/global.less';

// import { Provider } from 'react-redux';
// import store from './core/store';
import routers from '../../routes/route';

const MOUNT_NODE = document.getElementById('root');

ReactDOM.render(
  <div>
    { routers }
  </div>, MOUNT_NODE,
);
