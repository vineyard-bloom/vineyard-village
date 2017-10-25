import {diffConfigs} from "../../source/utility";
import {expect} from 'chai'

require('source-map-support').install()

describe('Config array test', function () {

  it('Allows varying arrays lengths', function () {
    const messages = diffConfigs('first', {
        items: []
      },
      'second', {
        items: ['sword']
      })

    console.log('messages', messages)
    expect(messages).to.have.lengthOf(0)
  })

  it('Fails on mismatched array types', function () {
    const messages = diffConfigs('first', {
        items: {}
      },
      'second', {
        items: ['sword']
      })

    console.log('messages', messages)
    expect(messages).to.have.lengthOf(1)
  })

  it('Returns a single missing array error instead of multiple missing index errors', function () {
    const messages = diffConfigs('first', {},
      'second', {
        items: ['sword', 'elixer']
      })

    console.log('messages', messages)
    expect(messages).to.have.lengthOf(1)
  })

})