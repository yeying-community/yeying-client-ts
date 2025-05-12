import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/yeying-client-ts.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/yeying-client-ts.esm.js',
            format: 'esm',
            sourcemap: true,
        },
        {
            file: 'dist/yeying-client-ts.umd.js',
            format: 'umd',
            // script标签的形式引入时，全局变量的模块名
            name: 'YEYING_CLIENT',
            sourcemap: true,
        },
    ],
    onwarn(warning, warn) {
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        warn(warning);
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({include: ["src/**/*.ts"], exclude: ["node_modules", "**/*.ut.ts", "**/*.it.ts"]}),
    ]
};
