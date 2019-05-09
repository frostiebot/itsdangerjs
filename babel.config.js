const definedOptions = ([,value]) => value !== undefined
const reduceOptions = (map, [key, value]) => ({ ...map, [key]: value })
const createOptions = (options = {}) => Object.entries(options).filter(definedOptions).reduce(reduceOptions, {})

const generatePreset = ({ loose, modules, useBuiltIns } = {}) => [
  '@babel/preset-env',
  { targets: { node: '8.10' }, ...createOptions({ loose, modules, useBuiltIns }) },
]

const basePreset = generatePreset()
const envPreset = generatePreset({ loose: false, modules: false, useBuiltIns: false })

module.exports = {
  presets: [ basePreset ],
  env: {
    es: { presets: [ envPreset ] },
    cjs: { presets: [ envPreset ] },
  },
  plugins: [
    [ '@babel/plugin-proposal-class-properties' ],
  ],
}
