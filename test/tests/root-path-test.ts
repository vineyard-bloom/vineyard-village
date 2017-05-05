require('source-map-support').install()
import * as assert from 'assert'
import {jumpPath} from "../source/pathing";
const path = require('path')

describe('root-path', function () {
  it('find the root path', function () {
    const rootPath = jumpPath()
    assert.equal(rootPath, path.resolve(__dirname, '..'))
  })
})