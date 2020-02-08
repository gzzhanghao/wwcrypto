module.exports = api => {
  const isTest = api.env('test')
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: isTest ? 'current' : 8 } }],
      '@babel/preset-typescript',
    ],
  }
}
