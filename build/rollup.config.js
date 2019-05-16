import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';

export default {
    input: 'index.js',
    output: {
        name: 'VueSilentbox',
        exports: 'named'
    },
    plugins: [
        vue({
            css: true,
            compileTemplate: true
        }),
        commonjs(),
        buble()
    ]
}