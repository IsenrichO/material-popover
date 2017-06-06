import Aesthetic, { createStyler } from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss';
import { create } from 'jss';
import preset from 'jss-preset-default';

export default createStyler(new Aesthetic(
  new JSSAdapter(create(preset())), {
    stylesPropName: 'classNames',
  }
));
