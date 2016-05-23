/**
 * Created by edgar on 29/06/15.
 */

module.exports.tasks = {
    ts: {
        development: {
            src: [
                'app/references.ts',
                'app/components/**/*.ts',
                'app/modules/**/*.ts'
            ],
            outDir: 'dist',
            reference: 'app/references.ts',
            options: {
                module: 'amd', // or commonjs
                target: 'es5', // or es3 or es6
                sourceMap: true,
                declaration: true,
                fast: 'never',
                comments: true
            }
        },

        watch: {
            src: [
                'app/references.ts',
                'app/components/**/*.ts',
                'app/modules/**/*.ts'
            ],
            outDir: 'dist',
            reference: 'app/references.ts',
            options: {
                module: 'amd', // or commonjs
                target: 'es5', // or es3 or es6
                sourceMap: true,
                declaration: true,
                fast: 'always',
                comments: true
            }
        },

        release: {
            src: [
                'app/references.ts',
                'app/components/**/*.ts',
                'app/modules/**/*.ts'
            ],
            outDir: 'dist/temp',
            reference: 'app/references.ts',
            options: {
                module: 'amd', // or commonjs
                target: 'es5', // or es3 or es6
                sourceMap: true,
                declaration: true,
                fast: 'never',
                comments: true
            }
        }
    }
};