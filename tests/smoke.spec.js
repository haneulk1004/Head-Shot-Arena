// Head-Shot Arena 스모크 테스트: 게임이 열리고, 시작되고, 기본 조작이 반영되는지 확인
const { test, expect } = require('@playwright/test');
const path = require('path');

const THREE_LOCAL = path.join(__dirname, '..', 'node_modules', 'three', 'build', 'three.min.js');

test.beforeEach(async ({ page }) => {
  // 외부 CDN 대신 같은 버전(0.128.0)의 로컬 파일을 사용해 네트워크 영향 제거
  await page.route('**/three@0.128.0/build/three.min.js', (route) =>
    route.fulfill({ path: THREE_LOCAL, contentType: 'application/javascript' })
  );
});

async function openGame(page, errors) {
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/index.html');
  await expect(page.locator('#start-screen')).toBeVisible();
}

async function startGame(page) {
  await page.getByRole('button', { name: 'GAME START' }).click();
  await expect(page.locator('#start-screen')).toBeHidden();
}

test('TC-01 첫 화면이 스크립트 오류 없이 열린다', async ({ page }) => {
  const errors = [];
  await openGame(page, errors);
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('TC-02 GAME START를 누르면 시작 화면이 사라진다', async ({ page }) => {
  const errors = [];
  await openGame(page, errors);
  await startGame(page);
  expect(errors).toEqual([]);
});

test('TC-03 시작 직후 HUD 초기값이 HP 100, SCORE 0, LV. 1이다', async ({ page }) => {
  await openGame(page, []);
  await startGame(page);
  await expect(page.locator('#hp')).toHaveText('100');
  await expect(page.locator('#score')).toHaveText('0');
  await expect(page.locator('#level-display')).toHaveText('LV. 1');
});

test('TC-04 숫자 키 3을 누르면 RIFLE 슬롯이 활성화된다', async ({ page }) => {
  await openGame(page, []);
  await startGame(page);
  await page.keyboard.press('3');
  await expect(page.locator('#slot-rifle')).toHaveClass(/active/);
  await expect(page.locator('#slot-pistol')).not.toHaveClass(/active/);
});

test('TC-05 게임이 시작되면 타이머가 흐른다', async ({ page }) => {
  await openGame(page, []);
  await startGame(page);
  await expect(page.locator('#game-timer')).not.toHaveText('00:00', { timeout: 10000 });
});

test('TC-06 시작 전 볼륨 슬라이더 값이 화면 표시에 반영된다', async ({ page }) => {
  await openGame(page, []);
  await page.locator('#volume-slider').fill('70');
  await expect(page.locator('#volume-val')).toHaveText('70%');
});
