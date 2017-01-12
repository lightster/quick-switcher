{
  baseUrl: ".",
  name: "src/quick-switcher",
  name: 'node_modules/almond/almond',
  include: ['src/quick-switcher'],
  out: "dist/quick-switcher.min.js",
  wrap: {
    startFile: '.almond/start.frag',
    endFile: '.almond/end.frag'
  }
}
