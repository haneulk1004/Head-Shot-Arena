// Playwright 설정: 테스트 전에 게임을 로컬 서버로 띄운다
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:8080',
    screenshot: 'only-on-failure',
    launchOptions: {
      // GitHub 가상 머신에는 그래픽 카드가 없어 WebGL을 소프트웨어로 처리
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
    },
  },
  webServer: {
    command: 'npx http-server -p 8080 -s -c-1 .',
    url: 'http://127.0.0.1:8080/index.html',
    reuseExistingServer: !process.env.CI,
  },
});
