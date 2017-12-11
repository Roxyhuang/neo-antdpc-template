import React from 'react';
import CSSModules from 'react-css-modules';
import s from './list.less';

class ListB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
    };
  }

  componentDidMount() {
    // TODO
  }

  render() {
    return (
      <div>
        <div className={s.listB}>B</div>
      </div>

    );
  }
}

export default CSSModules(ListB, s);
