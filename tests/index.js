import './setup.js'

// TEST CODE START
import './common/templateCompiler/compile.js'
import './common/templateCompiler/node.js'

import './components/backtop.js'

// TEST CODE END

mocha.checkLeaks()
mocha.run()
