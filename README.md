# Vineyard Village

Vineyard Village is a thin hub library that pulls together the Vineyard ecosystem to form a particular, unified web server.  It integrates three Vineyard libraries:

1. [Vineyard Ground](https://github.com/silentorb/vineyard-ground) - ORM
2. [Vineyard Lawn](https://github.com/silentorb/vineyard-lawn) - Web services
3. [Vineyard Users](https://github.com/silentorb/vineyard-users) - User management
4. [Vineyard Error Logging](https://github.com/silentorb/vineyard-error-logging) - Logging errors to a database
5. [Vineyard Lawn Logging](https://github.com/silentorb/vineyard-lawn-logging) - Logging web requests to a database

## Structure

Vineyard Village is divided into two main classes:

1. **GenericVillage** - Wraps `Ground`, schema definitions, and site configuration.

2. **GenericWebService** - Wraps `Lawn` and `Users`.

Both classes use a generic Model parameter, which is meant to be passed the model interface for the particular project that is using Village.

The intended usage pattern is for server projects to define their own Village and WebService classes which are derived from GenericVillage and GenericWebService.

## Examples

Within a project using Village the convention is to create two files: `village.ts` and `web-service.ts`. 

**village.ts**
```
import {Model} from './model'
import {GenericVillage, CommonConfig} from 'vineyard-village'

export interface Config extends CommonConfig {
   // Project specific configuration
}

const config = require('../config/config.json') as Config

compareConfigs("config.json", config, "config-sample.json", require('../config/config-sample.json'))

export class Village extends GenericVillage<Model, Config> {

  constructor() {
    super({
      config: config,
      schema: require('./model/schema.json')
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

## API

### GenericVillage<Model, Config>

The hub of a project's configuration and data access.

#### `getConfig() : Config`

Returns the project's central configuration object.

#### `getModel() : Model`
u
Returns the project's central data access object.

### GenericWebService<Model, Config>

The hub of web services and user management.