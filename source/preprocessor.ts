import {Version} from 'vineyard-lawn'
import {LoggedInPreprocessor} from "vineyard-users";

export class Preprocessor extends LoggedInPreprocessor {

  constructor(versions: Version[]) {
    super(versions);
  }
}