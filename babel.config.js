module.exports = {
  env: {
    build: {
      presets: ['@babel/preset-env'],
    },
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
      ],
    },
  },
}
