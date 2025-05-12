import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import * as path from "node:path";

export default defineConfig({
  test: {
    include: ["**/*.{it,ut}.?(c|m)[jt]s?(x)"],
    globals: true,
    environment: "happy-dom",
    setupFiles: './vitest.setup.ts',
    testTimeout: 60000, // 超时时间 60 秒
  },
})
// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '.env') });