import {class1} from 'package1/module1';
import {class2, class3} from 'package2/module3';

import {
  class4,
  class5
} from 'package1/module2';

export function func() {
  let sum = 0;
  for (let i = 0; i < 10; ++i)
    sum += i;
  return sum;
}
