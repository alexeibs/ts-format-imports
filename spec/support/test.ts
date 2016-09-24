import {readFileSync} from "fs";
import * as ts from "typescript";
import {class1} from 'package1/module1';
import {class2} from 'package2/module3';
import {class3} from 'package1/module1';
import {class4} from './module4';

export function func() {
  let sum = 0;
  for (let i = 0; i < 10; ++i)
    sum += i;
  return sum;
}
