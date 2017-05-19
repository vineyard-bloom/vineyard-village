# Vineyard Village

Vineyard Village is a thin hub library that pulls together the Vineyard ecosystem to form a particular, unified web server.  It integrates three Vineyard libraries:

1. [Vineyard Ground](https://github.com/silentorb/vineyard-ground) - SQL ORM
2. [Vineyard Lawn](https://github.com/silentorb/vineyard-lawn) - JSON web services
2. [Vineyard Users](https://github.com/silentorb/vineyard-users) - Basic user services

## Structure

Vineyard Village is divided into two main classes:

1. **GenericVillage** - Wraps `Ground`, schema definitions, and site configuration.

2. **GenericWebService** - Wraps `Lawn` and `Users`.

Both classes use a generic Model parameter, which is meant to be passed the model interface for the particular project that is using Village.

The intended usage pattern is for server projects to define their own Village and WebService classes which are derived from GenericVillage and GenericWebService.

## Examples

**village.ts**
```
import {Model} from '../model'
import {GenericVillage} from 'vineyard-village'

export class Village extends GenericVillage<Model> {

  constructor() {
    super({
      publicConfig: require('../../config/general.json'),
      privateConfig: require('../../config/secrets.json'),
      schema: require('../model/schema.json')
    })
  }
}
```

**web-service.ts**
```
import {Model} from '../model';
import {GenericWebService} from 'vineyard-village'
import {Version} from 'vineyard-lawn/source/version'
import {Village} from '../common/village'
import {initializeEndpoints} from './endpoints'

const versions: Version[] = [
  new Version(1, 0),
  new Version(1, 1),
  new Version(2, 0),
]

export class WebService extends GenericWebService<Model> {

  constructor(village: Village) {
    super(village, versions)
    initializeEndpoints(this, village)
  }
}
```