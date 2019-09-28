import { configure } from 'enzyme'
import jasmineEnzyme from 'jasmine-enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'ignore-styles'

configure({ adapter: new Adapter() })

beforeEach(() => {
  jasmineEnzyme()
})
